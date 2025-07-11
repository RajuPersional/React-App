from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import os

# Initialize SQLAlchemy
db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    register_number = db.Column(db.Integer, primary_key=True)
    plain_password = db.Column(db.String(100))  # For development only
    password = db.Column(db.String(200), nullable=False)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone_number = db.Column(db.String(15))
    date_of_birth = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    attendance = db.relationship('Attendance', backref='user', lazy=True)

    def set_password(self, password):
        self.password = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password, password)

class Course(db.Model):
    __tablename__ = 'courses'
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(20), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    attendance = db.relationship('Attendance', backref='course', lazy=True)

class Attendance(db.Model):
    __tablename__ = 'attendance'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.register_number'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(20), nullable=False)  # 'present', 'absent', 'leave'
    hours = db.Column(db.Float, default=1.0)  # Number of hours for the class
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    __table_args__ = (
        db.UniqueConstraint('user_id', 'course_id', 'date', name='_user_course_date_uc'),
    )

def init_db(app):
    """Initialize the database with required tables and sample data"""
    with app.app_context():
        # Create all tables
        db.create_all()
        
        # Add sample data if no users exist
        if not User.query.first():
            # Add sample users
            users = [
                User(
                    register_number=1,
                    plain_password='1',
                    name='Raju',
                    email='raju@gmail.com',
                    phone_number='9121159199',
                    date_of_birth=datetime(2000, 1, 15)
                ),
                User(
                    register_number=2,
                    plain_password='2',
                    name='Jane Smith',
                    email='jane.smith@example.com',
                    phone_number='2345678901',
                    date_of_birth=datetime(2001, 3, 20)
                ),
                User(
                    register_number=3,
                    plain_password='3',
                    name='Mike Johnson',
                    email='mike.johnson@example.com',
                    phone_number='3456789012',
                    date_of_birth=datetime(2002, 5, 10)
                )
            ]
            
            # Set passwords for users
            for user in users:
                user.set_password(user.plain_password)
                db.session.add(user)
            
            # Add sample courses
            courses = [
                Course(code='CS101', name='Introduction to Computer Science'),
                Course(code='MATH201', name='Discrete Mathematics'),
                Course(code='PHY101', name='Physics')
            ]
            
            for course in courses:
                db.session.add(course)
            
            db.session.commit()
            print("Database initialized with sample data")
