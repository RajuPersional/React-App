from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from waitress import serve
import logging
import os
import json

app = Flask(__name__)
CORS(app, supports_credentials=True)

# ✅ Setup logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ✅ SQLite DB setup
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///students.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


# ✅ Student Model
class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    registration_number = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


# ✅ Helper to get JSON path
def get_json_path():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(current_dir, 'Json_Files', 'Attendance.json')


# ✅ Load JSON data once at startup
cached_attendance_data = {}
try:
    json_path = get_json_path()
    logger.info(f"Loading attendance data from: {json_path}")
    with open(json_path, 'r', encoding='utf-8') as file:
        cached_attendance_data = json.load(file)

except Exception as e:
    logger.error(f"Failed to load attendance JSON on startup: {e}")
    cached_attendance_data = {}


# ✅ Initialize database
with app.app_context():
    db.create_all()


# ✅ Login route
@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        registration_number = data.get('registrationNumber')
        password = data.get('password')

        if not registration_number or not password:
            return jsonify({'error': 'Registration number and password are required'}), 400

        student = Student.query.filter_by(registration_number=registration_number).first()
        if not student or not student.check_password(password):
            return jsonify({'error': 'Invalid credentials'}), 401

        logger.info(f"User '{registration_number}' logged in successfully")
        return jsonify({'message': 'Login successful'}), 200

    except Exception as e:
        logger.error(f"Login error: {e}")
        return jsonify({'error': str(e)}), 500


# ✅ Attendance data route
@app.route('/api/merged-attendance', methods=['GET'])
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


# ✅ Run the app
if __name__ == '__main__':
    serve(app, host='127.0.0.1', port=5000)