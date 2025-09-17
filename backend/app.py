from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import os
from datetime import datetime, timedelta

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'your-secret-key-change-in-production'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

jwt = JWTManager(app)
CORS(app)

# Database initialization
def init_db():
    conn = sqlite3.connect('launchpad.db')
    cursor = conn.cursor()
    
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL CHECK (role IN ('student', 'alumni')),
            graduation_year INTEGER,
            department TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Projects table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            category TEXT NOT NULL,
            status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'paused')),
            team_members TEXT,
            tags TEXT,
            created_by INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (created_by) REFERENCES users (id)
        )
    ''')
    
    # Blog posts table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS blog_posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            category TEXT,
            author_id INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (author_id) REFERENCES users (id)
        )
    ''')
    
    # Mentorship requests table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS mentorship_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            alumni_id INTEGER NOT NULL,
            message TEXT,
            status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES users (id),
            FOREIGN KEY (alumni_id) REFERENCES users (id)
        )
    ''')
    
    # Project applications table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS project_applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            project_id INTEGER NOT NULL,
            message TEXT,
            status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES users (id),
            FOREIGN KEY (project_id) REFERENCES projects (id)
        )
    ''')
    
    conn.commit()
    conn.close()

# Auth routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['name', 'email', 'password', 'role']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400
    
    # Validate role
    if data['role'] not in ['student', 'alumni']:
        return jsonify({'error': 'Invalid role'}), 400
    
    # Validate alumni-specific fields
    if data['role'] == 'alumni':
        if not data.get('graduation_year') or not data.get('department'):
            return jsonify({'error': 'Graduation year and department are required for alumni'}), 400
    
    conn = sqlite3.connect('launchpad.db')
    cursor = conn.cursor()
    
    try:
        # Check if user already exists
        cursor.execute('SELECT id FROM users WHERE email = ?', (data['email'],))
        if cursor.fetchone():
            return jsonify({'error': 'User already exists'}), 400
        
        # Hash password
        password_hash = generate_password_hash(data['password'])
        
        # Insert user
        cursor.execute('''
            INSERT INTO users (name, email, password_hash, role, graduation_year, department)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            data['name'],
            data['email'],
            password_hash,
            data['role'],
            data.get('graduation_year'),
            data.get('department')
        ))
        
        user_id = cursor.lastrowid
        
        # Create access token
        access_token = create_access_token(identity=user_id)
        
        # Get user data
        cursor.execute('SELECT id, name, email, role, graduation_year, department FROM users WHERE id = ?', (user_id,))
        user_data = cursor.fetchone()
        
        user = {
            'id': user_data[0],
            'name': user_data[1],
            'email': user_data[2],
            'role': user_data[3],
            'graduation_year': user_data[4],
            'department': user_data[5]
        }
        
        conn.commit()
        return jsonify({
            'token': access_token,
            'user': user
        }), 201
        
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password are required'}), 400
    
    conn = sqlite3.connect('launchpad.db')
    cursor = conn.cursor()
    
    try:
        # Get user
        cursor.execute('SELECT id, name, email, password_hash, role, graduation_year, department FROM users WHERE email = ?', (data['email'],))
        user_data = cursor.fetchone()
        
        if not user_data or not check_password_hash(user_data[3], data['password']):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Create access token
        access_token = create_access_token(identity=user_data[0])
        
        user = {
            'id': user_data[0],
            'name': user_data[1],
            'email': user_data[2],
            'role': user_data[3],
            'graduation_year': user_data[4],
            'department': user_data[5]
        }
        
        return jsonify({
            'token': access_token,
            'user': user
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# Protected routes
@app.route('/api/projects', methods=['GET'])
def get_projects():
    conn = sqlite3.connect('launchpad.db')
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            SELECT p.id, p.title, p.description, p.category, p.status, p.team_members, p.tags, p.created_at,
                   u.name as created_by_name
            FROM projects p
            LEFT JOIN users u ON p.created_by = u.id
            ORDER BY p.created_at DESC
        ''')
        
        projects = []
        for row in cursor.fetchall():
            projects.append({
                'id': row[0],
                'title': row[1],
                'description': row[2],
                'category': row[3],
                'status': row[4],
                'team_members': row[5],
                'tags': row[6],
                'created_at': row[7],
                'created_by_name': row[8]
            })
        
        return jsonify(projects), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/blog', methods=['GET'])
def get_blog_posts():
    conn = sqlite3.connect('launchpad.db')
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            SELECT b.id, b.title, b.content, b.category, b.created_at, b.updated_at,
                   u.name as author_name
            FROM blog_posts b
            LEFT JOIN users u ON b.author_id = u.id
            ORDER BY b.created_at DESC
        ''')
        
        posts = []
        for row in cursor.fetchall():
            posts.append({
                'id': row[0],
                'title': row[1],
                'content': row[2],
                'category': row[3],
                'created_at': row[4],
                'updated_at': row[5],
                'author_name': row[6]
            })
        
        return jsonify(posts), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/blog/<int:post_id>', methods=['GET'])
def get_blog_post(post_id):
    conn = sqlite3.connect('launchpad.db')
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            SELECT b.id, b.title, b.content, b.category, b.created_at, b.updated_at,
                   u.name as author_name
            FROM blog_posts b
            LEFT JOIN users u ON b.author_id = u.id
            WHERE b.id = ?
        ''', (post_id,))
        
        post_data = cursor.fetchone()
        
        if not post_data:
            return jsonify({'error': 'Blog post not found'}), 404
        
        post = {
            'id': post_data[0],
            'title': post_data[1],
            'content': post_data[2],
            'category': post_data[3],
            'created_at': post_data[4],
            'updated_at': post_data[5],
            'author_name': post_data[6]
        }
        
        return jsonify(post), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    
    conn = sqlite3.connect('launchpad.db')
    cursor = conn.cursor()
    
    try:
        cursor.execute('SELECT id, name, email, role, graduation_year, department FROM users WHERE id = ?', (user_id,))
        user_data = cursor.fetchone()
        
        if not user_data:
            return jsonify({'error': 'User not found'}), 404
        
        user = {
            'id': user_data[0],
            'name': user_data[1],
            'email': user_data[2],
            'role': user_data[3],
            'graduation_year': user_data[4],
            'department': user_data[5]
        }
        
        return jsonify(user), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# Project application endpoints
@app.route('/api/projects/<int:project_id>/apply', methods=['POST'])
@jwt_required()
def apply_to_project(project_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    
    conn = sqlite3.connect('launchpad.db')
    cursor = conn.cursor()
    
    try:
        # Check if user is a student
        cursor.execute('SELECT role FROM users WHERE id = ?', (user_id,))
        user_role = cursor.fetchone()
        
        if not user_role or user_role[0] != 'student':
            return jsonify({'error': 'Only students can apply to projects'}), 403
        
        # Check if project exists
        cursor.execute('SELECT id FROM projects WHERE id = ?', (project_id,))
        if not cursor.fetchone():
            return jsonify({'error': 'Project not found'}), 404
        
        # Check if already applied
        cursor.execute('SELECT id FROM project_applications WHERE student_id = ? AND project_id = ?', (user_id, project_id))
        if cursor.fetchone():
            return jsonify({'error': 'You have already applied to this project'}), 400
        
        # Create application
        cursor.execute('''
            INSERT INTO project_applications (student_id, project_id, message)
            VALUES (?, ?, ?)
        ''', (user_id, project_id, data.get('message', '')))
        
        conn.commit()
        return jsonify({'message': 'Application submitted successfully'}), 201
        
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/projects/<int:project_id>', methods=['GET'])
def get_project_detail(project_id):
    conn = sqlite3.connect('launchpad.db')
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            SELECT p.id, p.title, p.description, p.category, p.status, p.team_members, p.tags, p.created_at,
                   u.name as created_by_name, u.email as created_by_email
            FROM projects p
            LEFT JOIN users u ON p.created_by = u.id
            WHERE p.id = ?
        ''', (project_id,))
        
        project_data = cursor.fetchone()
        
        if not project_data:
            return jsonify({'error': 'Project not found'}), 404
        
        project = {
            'id': project_data[0],
            'title': project_data[1],
            'description': project_data[2],
            'category': project_data[3],
            'status': project_data[4],
            'team_members': json.loads(project_data[5]) if project_data[5] else [],
            'tags': json.loads(project_data[6]) if project_data[6] else [],
            'created_at': project_data[7],
            'created_by_name': project_data[8],
            'created_by_email': project_data[9]
        }
        
        return jsonify(project), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# Mentorship request endpoints
@app.route('/api/mentorship/request', methods=['POST'])
@jwt_required()
def request_mentorship():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    conn = sqlite3.connect('launchpad.db')
    cursor = conn.cursor()
    
    try:
        # Check if user is a student
        cursor.execute('SELECT role FROM users WHERE id = ?', (user_id,))
        user_role = cursor.fetchone()
        
        if not user_role or user_role[0] != 'student':
            return jsonify({'error': 'Only students can request mentorship'}), 403
        
        alumni_id = data.get('alumni_id')
        if not alumni_id:
            return jsonify({'error': 'Alumni ID is required'}), 400
        
        # Check if alumni exists and is actually an alumni
        cursor.execute('SELECT role FROM users WHERE id = ?', (alumni_id,))
        alumni_role = cursor.fetchone()
        
        if not alumni_role or alumni_role[0] != 'alumni':
            return jsonify({'error': 'Invalid alumni ID'}), 400
        
        # Check if already requested
        cursor.execute('SELECT id FROM mentorship_requests WHERE student_id = ? AND alumni_id = ?', (user_id, alumni_id))
        if cursor.fetchone():
            return jsonify({'error': 'You have already sent a mentorship request to this alumni'}), 400
        
        # Create mentorship request
        cursor.execute('''
            INSERT INTO mentorship_requests (student_id, alumni_id, message)
            VALUES (?, ?, ?)
        ''', (user_id, alumni_id, data.get('message', '')))
        
        conn.commit()
        return jsonify({'message': 'Mentorship request sent successfully'}), 201
        
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/mentorship/requests', methods=['GET'])
@jwt_required()
def get_mentorship_requests():
    user_id = get_jwt_identity()
    
    conn = sqlite3.connect('launchpad.db')
    cursor = conn.cursor()
    
    try:
        # Get user role
        cursor.execute('SELECT role FROM users WHERE id = ?', (user_id,))
        user_role = cursor.fetchone()
        
        if not user_role:
            return jsonify({'error': 'User not found'}), 404
        
        if user_role[0] == 'student':
            # Get requests sent by student
            cursor.execute('''
                SELECT mr.id, mr.message, mr.status, mr.created_at,
                       u.name as alumni_name, u.email as alumni_email
                FROM mentorship_requests mr
                LEFT JOIN users u ON mr.alumni_id = u.id
                WHERE mr.student_id = ?
                ORDER BY mr.created_at DESC
            ''', (user_id,))
        else:
            # Get requests received by alumni
            cursor.execute('''
                SELECT mr.id, mr.message, mr.status, mr.created_at,
                       u.name as student_name, u.email as student_email
                FROM mentorship_requests mr
                LEFT JOIN users u ON mr.student_id = u.id
                WHERE mr.alumni_id = ?
                ORDER BY mr.created_at DESC
            ''', (user_id,))
        
        requests = []
        for row in cursor.fetchall():
            requests.append({
                'id': row[0],
                'message': row[1],
                'status': row[2],
                'created_at': row[3],
                'other_user_name': row[4],
                'other_user_email': row[5]
            })
        
        return jsonify(requests), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# Get alumni list for mentorship
@app.route('/api/alumni', methods=['GET'])
def get_alumni():
    conn = sqlite3.connect('launchpad.db')
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            SELECT id, name, email, graduation_year, department
            FROM users
            WHERE role = 'alumni'
            ORDER BY name
        ''')
        
        alumni = []
        for row in cursor.fetchall():
            alumni.append({
                'id': row[0],
                'name': row[1],
                'email': row[2],
                'graduation_year': row[3],
                'department': row[4]
            })
        
        return jsonify(alumni), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5001)
