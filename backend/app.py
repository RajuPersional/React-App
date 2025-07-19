from flask import Flask, jsonify, request, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from waitress import serve
from dotenv import load_dotenv
import json ,logging,os,functools,re,sys
from datetime import datetime


# Load environment variables from .env file
load_dotenv()


app = Flask(__name__)

# Configure CORS for React frontend on localhost:5173
CORS(app,origins=['http://localhost:5173'],supports_credentials=True)
# Always use 'localhost' (not 127.0.0.1) for both backend and frontend in development.

# Configure logging
logging.basicConfig(level=logging.DEBUG,
    # format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    # handlers=[
    #     logging.StreamHandler(stream=sys.stdout)
    # ]

)
logger = logging.getLogger(__name__) # this will create a logger for the current file "INFO:__main__:Starting Flask server"

# Enable Flask debug logging
app.logger.setLevel(logging.DEBUG)
app.logger.handlers = logging.getLogger().handlers

# Enable SQLAlchemy logging
# logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)

# SQLite DB setup
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///students.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Flask will handle session cookie automatically. No need to set cookie manually.
 
# Configure session
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

def fetch_json_data(file_path):
    with open(file_path, 'r') as file: # the with open (file_path, 'r') will one the json data and the varaible file will access to the file 
        return json.load(file)


# Student Model
class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    registration_number = db.Column(db.String(20), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)# nullable =false the value should not be null value 
    dob = db.Column(db.Date, nullable=False)
    mobile_number = db.Column(db.String(15), nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())# This will store the time when the user is created

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


def create_sample_users():
    sample_users = fetch_json_data('Json_Files/User_Data.json')
    
    try:
        for user_data in sample_users:
            # Check if user already exists
            if not Student.query.filter_by(registration_number=user_data['registration_number']).first():
                user = Student(
                    registration_number=user_data['registration_number'],
                    name=user_data['name'],
                    email=user_data['email'],
                    dob=datetime.strptime(user_data['dob'], '%Y-%m-%d'),
                    mobile_number=user_data['mobile_number']
                )
                user.set_password(str(user_data['password']))  # We need to Convert into the String because the set_password need the String as the input 
                db.session.add(user)
        
        db.session.commit()
        logger.info("Sample users created successfully!")
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error creating sample users: {str(e)}")

# Initialize database
with app.app_context():
    db.create_all()
    # Create sample users after database is created
    create_sample_users()

# Helper to get JSON path
def get_json_path():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(current_dir, 'Json_Files', 'Attendance.json')


# Load JSON data once at startup
cached_attendance_data = {}
try:
    json_path = get_json_path()
    logger.info(f"Loading attendance data from: {json_path}")
    with open(json_path, 'r', encoding='utf-8') as file:
        cached_attendance_data = json.load(file)

except Exception as e:
    logger.error(f"Failed to load attendance JSON on startup: {e}")
    cached_attendance_data = {}


# Configure session
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

# Session management decorator
def require_session(f):#The f is a parameter — it will receive another function as input.
    @functools.wraps(f) # this will make act like the original function
    def decorated_function(*args, **kwargs):
        logger.info(f"Checking session - Current session: {dict(session)}")
        
        if 'register_number' not in session:
            logger.warning("No register_number in session")
            return jsonify({'status': 'error', 'message': 'Not logged in'}), 401
        
        try:
            register_number = session['register_number']
            logger.info(f"Validating session for register_number: {register_number}")
            
            if not register_number or not isinstance(register_number, str):
                logger.warning(f"Invalid register_number format: {register_number}")
                return jsonify({'status': 'fail', 'message': 'Invalid session data'}), 401
            
            # Verify user exists in database
            user_data = Student.query.filter_by(registration_number=register_number).first()
            if not user_data:
                logger.warning(f"User not found for register_number: {register_number}")
                return jsonify({'status': 'fail', 'message': 'User not found'}), 401
            
            logger.info(f"Session validation successful for user: {register_number}")
            return f(*args, **kwargs)
            
        except Exception as e:
            logger.error(f"Session verification error: {str(e)}", exc_info=True)
            return jsonify({'status': 'error', 'message': 'Session verification failed'}), 500
    
    return decorated_function


# Login route
@app.route('/api/login', methods=['POST'])
def login():
    try:
        logger.info("=== LOGIN ATTEMPT ===")
        data = request.get_json()
        registration_number = data.get('registrationNumber')
        password = data.get('password')

        logger.info(f"Login attempt for registration number: {registration_number}")
        logger.info(f"Session before login: {dict(session)}")
        
        if not registration_number or not password:
            logger.warning("Missing credentials in login request")
            return jsonify({'error': 'Registration number and password are required'}), 400

        student = Student.query.filter_by(registration_number=registration_number).first()
        if not student or not student.check_password(password):
            logger.warning(f"Invalid credentials for registration number: {registration_number}")
            return jsonify({'error': 'Invalid credentials'}), 401

        logger.info(f"User '{registration_number}' logged in successfully")
        session['register_number'] = registration_number
        logger.info(f"Session created for user: {registration_number}")
        logger.info(f"Session data after login: {dict(session)}")
        
        response = jsonify({
            'message': 'Login successful',
        })
        # DO NOT manually set the session cookie; let Flask handle it automatically.
        logger.info(f"Response headers before sending: {dict(response.headers)}")
        return response, 200

    except Exception as e:
        logger.error(f"Login error: {e}", exc_info=True)
        return jsonify({'error': str(e)}), 500


@app.route('/api/logout', methods=['POST'])
@require_session
def logout():
    try:
        logger.info("=== LOGOUT ATTEMPT ===")
        logger.info(f"Session before logout: {dict(session)}")
        logger.info(f"Request cookies: {request.cookies}")
        
        # Clear the session
        session.clear()
        
        # Create response
        response = jsonify({'message': 'Logout successful'})
        
        # Explicitly clear the session cookie
        # response.set_cookie('session', '', expires=0,httponly=True,path='/') “Flask tells the browser (via HTTP response) to store this cookie in the browser.”
        
        logger.info(f"Session after logout: {dict(session)}")
        logger.info(f"Response headers: {dict(response.headers)}")
        
        return response, 200
    except Exception as e:
        logger.error(f"Logout error: {e}", exc_info=True)
        return jsonify({'error': str(e)}), 500

# Attendance data route
@app.route('/api/merged-attendance', methods=['GET'])
@require_session
def get_merged_attendance():
    try:
        if not cached_attendance_data:
            return jsonify({
                'status': 'error',
                'error': 'Attendance data not loaded'
            }), 500

        logger.debug("Returning cached attendance data")
        return jsonify({
            'status': 'success',
            'data': {
                'courses': cached_attendance_data.get('courses', {}),
                'attendance': cached_attendance_data.get('attendance', {})
            }
        }), 200

    except Exception as e:
        logger.error(f"Error in merged-attendance route: {e}")
        return jsonify({
            'status': 'error',
            'error': str(e)
        }), 500


# Run the app
if __name__ == '__main__':
    logger.info("Starting Flask server")
    serve(app, host='localhost', port=5000)