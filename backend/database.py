import sqlite3
from werkzeug.security import generate_password_hash

def init_db():
    """Initialize the database with a users table"""
    conn = sqlite3.connect('students.db')
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            registration_number TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            name TEXT,
            email TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create a test user if not exists
    try:
        cursor.execute('''
            INSERT INTO users (registration_number, password_hash, name, email)
            VALUES (?, ?, ?, ?)
        ''', (
            '123456789',
            generate_password_hash('password123'),
            'Raju',
            'test@example.com'
        ))
    except sqlite3.IntegrityError:
        pass  # User already exists
    
    conn.commit()
    conn.close()

def add_user(registration_number, password, name, email):
    """Add a new user to the database"""
    conn = sqlite3.connect('students.db')
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            INSERT INTO users (registration_number, password_hash, name, email)
            VALUES (?, ?, ?, ?)
        ''', (
            registration_number,
            generate_password_hash(password),
            name,
            email
        ))
        conn.commit()
        return True
    except sqlite3.IntegrityError:
        return False
    finally:
        conn.close()

def check_login(registration_number, password):
    """Check if user exists and verify password"""
    conn = sqlite3.connect('students.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT password_hash FROM users 
        WHERE registration_number = ?
    ''', (registration_number,))
    
    result = cursor.fetchone()
    
    if result and check_password_hash(result[0], password):
        # Get user data
        cursor.execute('''
            SELECT * FROM users 
            WHERE registration_number = ?
        ''', (registration_number,))
        user_data = cursor.fetchone()
        
        conn.close()
        return True, {
            'registration_number': user_data[1],
            'name': user_data[3],
            'email': user_data[4]
        }
    
    conn.close()
    return False, "Invalid credentials"

def get_user_data(registration_number):
    """Get user data by registration number"""
    conn = sqlite3.connect('students.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT * FROM users 
        WHERE registration_number = ?
    ''', (registration_number,))
    
    result = cursor.fetchone()
    conn.close()
    
    if result:
        return {
            'registration_number': result[1],
            'name': result[3],
            'email': result[4],
            'created_at': result[5]
        }
    return None

if __name__ == '__main__':
    init_db()