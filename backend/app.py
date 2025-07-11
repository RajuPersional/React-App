from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy 
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import logging
import os 
import json

app = Flask(__name__)
CORS(app,supports_credentials=True)

logging.basicConfig(
    level=logging.DEBUG, # log everything from DEBUG and above
    format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///students.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


def get_json_path():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(current_dir, 'Json_Files', 'Attendance.json')
    return json_path



# Create Student model
class Student(db.Model):# 1*
    id = db.Column(db.Integer, primary_key=True)
    registration_number = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

# Initialize database
with app.app_context():
    db.create_all()
 


@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        registration_number = data.get('registrationNumber')
        password = data.get('password')
        
        if not registration_number or not password:
            return jsonify({'error': 'Registration number and password are required'}), 400

        # Find user
        student = Student.query.filter_by(registration_number=registration_number).first()#<Student  id=1, registration_number="12345", password_hash="hashvalue", created_at="..." >
        if not student or not student.check_password(password):
            return jsonify({'error': 'Invalid credentials'}), 401

        return jsonify({'message': 'Login successful'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500




@app.route('/api/merged-attendance', methods=['GET', 'OPTIONS'])
def get_merged_attendance():
    try:
        # Get the JSON file path
        json_path = get_json_path()
        logger.info(f"Attempting to read attendance data from: {json_path}")
        
        # Check if file exists
        if not os.path.exists(json_path):
            logger.error(f"JSON file not found at: {json_path}")
            return jsonify({
                'status': 'error',
                'error': f'JSON file not found at: {json_path}'
            }), 404
        
        # Read and validate the JSON file
        with open(json_path, 'r', encoding='utf-8') as file:
            data = json.load(file)# loads the json into the python Directory
            
            # Validate the data structure
            if not isinstance(data, dict):
                logger.error("Invalid JSON structure: root must be a dictionary")
                return jsonify({
                    'status': 'error',
                    'error': 'Invalid JSON structure: root must be a dictionary'
                }), 400
            
            # Ensure required keys exist
            if 'courses' not in data or 'attendance' not in data:
                logger.error("Missing required keys in JSON: 'courses' or 'attendance' not found")
                return jsonify({
                    'status': 'error',
                    'error': "Missing required keys in JSON: 'courses' or 'attendance' not found"
                }), 400
            
            logger.info("Successfully read and validated attendance data")
            return jsonify({
                'status': 'success',
                'data': {
                    'courses': data.get('courses', {}),
                    'attendance': data.get('attendance', {})
                }
            }), 200
            
    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error: {str(e)}")
        return jsonify({
            'status': 'error',
            'error': f'Invalid JSON format: {str(e)}'
        }), 400
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return jsonify({
            'status': 'error',
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)