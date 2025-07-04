from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import os

app = Flask(__name__)
CORS(app)

# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///students.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Create Student model
class Student(db.Model):
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
    
    # Create a test user if not exists
    test_user = Student.query.filter_by(registration_number='test123').first()
    if not test_user:
        test_user = Student(registration_number='test123')
        test_user.set_password('password123')
        db.session.add(test_user)
        db.session.commit()

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        registration_number = data.get('registrationNumber')
        password = data.get('password')
        
        if not registration_number or not password:
            return jsonify({'error': 'Registration number and password are required'}), 400

        # Check if user already exists
        if Student.query.filter_by(registration_number=registration_number).first():
            return jsonify({'error': 'Registration number already exists'}), 400

        # Create new user
        student = Student(registration_number=registration_number)
        student.set_password(password)
        db.session.add(student)
        db.session.commit()

        return jsonify({'message': 'Registration successful'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        registration_number = data.get('registrationNumber')
        password = data.get('password')
        
        if not registration_number or not password:
            return jsonify({'error': 'Registration number and password are required'}), 400

        # Find user
        student = Student.query.filter_by(registration_number=registration_number).first()
        if not student or not student.check_password(password):
            return jsonify({'error': 'Invalid credentials'}), 401

        return jsonify({'message': 'Login successful'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)