from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import sqlite3
import os
import json
import uuid
from datetime import datetime, timedelta

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'your-secret-key-change-in-production'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

jwt = JWTManager(app)
CORS(app)

# Create uploads directory if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Add general request debugging
@app.before_request
def log_request_info():
    print(f"DEBUG: Incoming request: {request.method} {request.path}")
    print(f"DEBUG: Headers: {dict(request.headers)}")
    if request.method == 'POST':
        print(f"DEBUG: Body: {request.get_data(as_text=True)}")

# Helper function to get user ID from JWT identity
def get_user_id_from_jwt():
    identity = get_jwt_identity()
    return int(identity.replace('user_', ''))

# Add JWT error handler
@jwt.invalid_token_loader
def invalid_token_callback(error_string):
    print(f"DEBUG: Invalid token error: {error_string}")
    return jsonify({'error': f'Invalid token: {error_string}'}), 422

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    print(f"DEBUG: Expired token")
    return jsonify({'error': 'Token has expired'}), 422

@jwt.unauthorized_loader
def missing_token_callback(error_string):
    print(f"DEBUG: Missing token error: {error_string}")
    return jsonify({'error': f'Missing token: {error_string}'}), 422

# Database initialization
def init_db():
    if os.environ.get("RENDER") == "true":  # Running on Render
        base_dir = os.environ.get("RENDER_DATA_DIR", ".")
        db_path = os.path.join(base_dir, "launchpad.db")
    else:  # Local development
        db_path = "launchpad.db"

    conn = sqlite3.connect(db_path)
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
            hall TEXT,
            branch TEXT,
            bio TEXT,
            current_company TEXT,
            current_position TEXT,
            location TEXT,
            work_preference TEXT CHECK (work_preference IN ('onsite', 'remote', 'hybrid')),
            phone TEXT,
            website TEXT,
            linkedin TEXT,
            github TEXT,
            avatar TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Add new columns if they don't exist (for existing databases)
    try:
        cursor.execute('ALTER TABLE users ADD COLUMN hall TEXT')
    except:
        pass
    try:
        cursor.execute('ALTER TABLE users ADD COLUMN branch TEXT')
    except:
        pass
    try:
        cursor.execute('ALTER TABLE users ADD COLUMN bio TEXT')
    except:
        pass
    try:
        cursor.execute('ALTER TABLE users ADD COLUMN current_company TEXT')
    except:
        pass
    try:
        cursor.execute('ALTER TABLE users ADD COLUMN current_position TEXT')
    except:
        pass
    try:
        cursor.execute('ALTER TABLE users ADD COLUMN location TEXT')
    except:
        pass
    try:
        cursor.execute('ALTER TABLE users ADD COLUMN work_preference TEXT')
    except:
        pass
    try:
        cursor.execute('ALTER TABLE users ADD COLUMN phone TEXT')
    except:
        pass
    try:
        cursor.execute('ALTER TABLE users ADD COLUMN website TEXT')
    except:
        pass
    try:
        cursor.execute('ALTER TABLE users ADD COLUMN linkedin TEXT')
    except:
        pass
    try:
        cursor.execute('ALTER TABLE users ADD COLUMN github TEXT')
    except:
        pass
    try:
        cursor.execute('ALTER TABLE users ADD COLUMN avatar TEXT')
    except:
        pass
    try:
        cursor.execute('ALTER TABLE users ADD COLUMN years_of_experience INTEGER')
    except:
        pass
    try:
        cursor.execute('ALTER TABLE users ADD COLUMN domain TEXT')
    except:
        pass
    try:
        cursor.execute('ALTER TABLE users ADD COLUMN tech_skills TEXT')
    except:
        pass
    try:
        cursor.execute('ALTER TABLE users ADD COLUMN program TEXT')
    except:
        pass
    try:
        cursor.execute('ALTER TABLE users ADD COLUMN cv_pdf TEXT')
    except:
        pass
    try:
        cursor.execute('ALTER TABLE users ADD COLUMN joining_year INTEGER')
    except:
        pass
    try:
        cursor.execute('ALTER TABLE users ADD COLUMN institute TEXT')
    except:
        pass
    try:
        cursor.execute('ALTER TABLE users ADD COLUMN specialization TEXT')
    except:
        pass
    try:
        cursor.execute('ALTER TABLE users ADD COLUMN past_projects TEXT')
    except:
        pass
    
    # Add new columns to project_positions table if they don't exist
    try:
        cursor.execute('ALTER TABLE project_positions ADD COLUMN stipend INTEGER')
    except:
        pass
    try:
        cursor.execute('ALTER TABLE project_positions ADD COLUMN duration TEXT')
    except:
        pass
    try:
        cursor.execute('ALTER TABLE project_positions ADD COLUMN location TEXT')
    except:
        pass
    
    # Add new columns to projects table if they don't exist
    try:
        cursor.execute('ALTER TABLE projects ADD COLUMN stipend INTEGER')
    except:
        pass
    try:
        cursor.execute('ALTER TABLE projects ADD COLUMN duration TEXT')
    except:
        pass
    try:
        cursor.execute('ALTER TABLE projects ADD COLUMN skills_required TEXT')
    except:
        pass
    try:
        cursor.execute('ALTER TABLE projects ADD COLUMN location TEXT')
    except:
        pass
    try:
        cursor.execute('ALTER TABLE projects ADD COLUMN work_type TEXT')
    except:
        pass
    try:
        cursor.execute('ALTER TABLE projects ADD COLUMN is_recruiting BOOLEAN DEFAULT 1')
    except:
        pass
    try:
        cursor.execute('ALTER TABLE projects ADD COLUMN images TEXT')
    except:
        pass
    try:
        cursor.execute('ALTER TABLE projects ADD COLUMN project_links TEXT')
    except:
        pass
    try:
        cursor.execute('ALTER TABLE projects ADD COLUMN jd_pdf TEXT')
    except:
        pass
    try:
        cursor.execute('ALTER TABLE projects ADD COLUMN contact_details TEXT')
    except:
        pass
    try:
        cursor.execute('ALTER TABLE projects ADD COLUMN team_roles TEXT')
    except:
        pass
    try:
        cursor.execute('ALTER TABLE projects ADD COLUMN partners TEXT')
    except:
        pass
    try:
        cursor.execute('ALTER TABLE projects ADD COLUMN funding TEXT')
    except:
        pass
    try:
        cursor.execute('ALTER TABLE projects ADD COLUMN highlights TEXT')
    except:
        pass
    
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
            stipend INTEGER,
            duration TEXT,
            skills_required TEXT,
            location TEXT,
            work_type TEXT CHECK (work_type IN ('remote', 'onsite', 'hybrid')),
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
    try:
        cursor.execute('ALTER TABLE blog_posts ADD COLUMN images TEXT')
    except:
        pass
    try:
        cursor.execute('ALTER TABLE blog_posts ADD COLUMN pdfs TEXT')
    except:
        pass
    
    # Conversations table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS conversations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user1_id INTEGER NOT NULL,
            user2_id INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user1_id) REFERENCES users (id),
            FOREIGN KEY (user2_id) REFERENCES users (id),
            UNIQUE(user1_id, user2_id)
        )
    ''')
    
    # Messages table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sender_id INTEGER NOT NULL,
            receiver_id INTEGER NOT NULL,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_read INTEGER DEFAULT 0,
            FOREIGN KEY (sender_id) REFERENCES users (id),
            FOREIGN KEY (receiver_id) REFERENCES users (id)
        )
    ''')
    
    # Blog likes table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS blog_likes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            blog_post_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (blog_post_id) REFERENCES blog_posts (id),
            FOREIGN KEY (user_id) REFERENCES users (id),
            UNIQUE(blog_post_id, user_id)
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
    
    # Project positions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS project_positions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            required_skills TEXT,
            count INTEGER DEFAULT 1,
            filled_count INTEGER DEFAULT 0,
            is_active BOOLEAN DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (project_id) REFERENCES projects (id)
        )
    ''')
    
    # Project applications table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS project_applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            project_id INTEGER NOT NULL,
            position_id INTEGER,
            message TEXT,
            status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES users (id),
            FOREIGN KEY (project_id) REFERENCES projects (id),
            FOREIGN KEY (position_id) REFERENCES project_positions (id)
        )
    ''')
    
    # Add position_id column to existing project_applications table
    try:
        cursor.execute('ALTER TABLE project_applications ADD COLUMN position_id INTEGER REFERENCES project_positions(id)')
    except:
        pass
    
    # Add feedback columns to project_applications table
    try:
        cursor.execute('ALTER TABLE project_applications ADD COLUMN feedback TEXT')
    except:
        pass
    try:
        cursor.execute('ALTER TABLE project_applications ADD COLUMN completed_at TIMESTAMP')
    except:
        pass
    try:
        cursor.execute('ALTER TABLE project_applications ADD COLUMN is_completed BOOLEAN DEFAULT 0')
    except:
        pass
    
    # User skills table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_skills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            skill_name TEXT NOT NULL,
            skill_type TEXT DEFAULT 'technical' CHECK (skill_type IN ('technical', 'soft', 'language')),
            proficiency_level TEXT DEFAULT 'intermediate' CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # User achievements table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_achievements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            achievement_type TEXT DEFAULT 'award' CHECK (achievement_type IN ('award', 'certification', 'project', 'publication', 'other')),
            date_earned DATE,
            issuer TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # User languages table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_languages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            language_name TEXT NOT NULL,
            proficiency_level TEXT DEFAULT 'intermediate' CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'native')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
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
        access_token = create_access_token(identity=f"user_{user_id}")
        
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

@app.route('/api/users/<int:student_id>/applied-projects', methods=['GET'])
@jwt_required()
def get_user_applied_projects(student_id: int):
    conn = sqlite3.connect('launchpad.db')
    cursor = conn.cursor()

    try:
        cursor.execute('SELECT role FROM users WHERE id = ?', (student_id,))
        role_row = cursor.fetchone()
        if not role_row or role_row[0] != 'student':
            return jsonify({'error': 'Target user is not a student'}), 400

        cursor.execute('''
            SELECT p.id, p.title, p.description, p.category, p.status, p.team_members, p.tags, p.created_at,
                   u.name as created_by_name, pa.status as application_status, pa.created_at as applied_at,
                   pa.is_completed, pa.completed_at, pa.feedback
            FROM project_applications pa
            JOIN projects p ON pa.project_id = p.id
            LEFT JOIN users u ON p.created_by = u.id
            WHERE pa.student_id = ?
            ORDER BY pa.created_at DESC
        ''', (student_id,))

        results = []
        for row in cursor.fetchall():
            results.append({
                'id': row[0],
                'title': row[1],
                'description': row[2],
                'category': row[3],
                'status': row[4],
                'team_members': json.loads(row[5]) if row[5] else [],
                'tags': json.loads(row[6]) if row[6] else [],
                'created_at': row[7],
                'created_by_name': row[8],
                'application_status': row[9],
                'applied_at': row[10],
                'is_completed': bool(row[11]) if row[11] is not None else False,
                'completed_at': row[12],
                'feedback': row[13]
            })

        return jsonify(results), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/users/<int:student_id>/completed-projects', methods=['GET'])
@jwt_required()
def get_user_completed_projects(student_id: int):
    conn = sqlite3.connect('launchpad.db')
    cursor = conn.cursor()

    try:
        cursor.execute('SELECT role FROM users WHERE id = ?', (student_id,))
        role_row = cursor.fetchone()
        if not role_row or role_row[0] != 'student':
            return jsonify({'error': 'Target user is not a student'}), 400

        cursor.execute('''
            SELECT pa.id, pa.feedback, pa.completed_at, pa.created_at as applied_at,
                   p.id as project_id, p.title, p.description, p.category, p.status,
                   u.name as alumni_name, u.email as alumni_email
            FROM project_applications pa
            JOIN projects p ON pa.project_id = p.id
            JOIN users u ON p.created_by = u.id
            WHERE pa.student_id = ? AND pa.is_completed = 1
            ORDER BY pa.completed_at DESC
        ''', (student_id,))

        completed_projects = []
        for row in cursor.fetchall():
            completed_projects.append({
                'application_id': row[0],
                'feedback': row[1],
                'completed_at': row[2],
                'applied_at': row[3],
                'project_id': row[4],
                'title': row[5],
                'description': row[6],
                'category': row[7],
                'status': row[8],
                'alumni_name': row[9],
                'alumni_email': row[10]
            })

        return jsonify(completed_projects), 200
    except Exception as e:
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
        access_token = create_access_token(identity=f"user_{user_data[0]}")
        
        user = {
            'id': user_data[0],
            'name': user_data[1],
            'email': user_data[2],
            'role': user_data[4],
            'graduation_year': user_data[5],
            'department': user_data[6]
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
    from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
    
    conn = sqlite3.connect('launchpad.db')
    cursor = conn.cursor()
    
    # Get user_id if authenticated (optional for this endpoint)
    user_id = None
    try:
        verify_jwt_in_request(optional=True)
        identity = get_jwt_identity()
        if identity:
            user_id = int(identity.replace('user_', ''))
    except:
        pass
    
    try:
        # Get filter parameters
        availability_filter = request.args.get('availability', 'all')  # 'all', 'available', 'not_available'
        
        cursor.execute('''
            SELECT p.id, p.title, p.description, p.category, p.status, p.team_members, p.tags, p.skills_required, 
                   p.stipend, p.duration, p.location, p.work_type, p.created_at, u.name as created_by_name, p.is_recruiting,
                   p.images, p.project_links, p.jd_pdf, p.created_by, p.contact_details, p.team_roles, p.partners, p.funding, p.highlights
            FROM projects p
            LEFT JOIN users u ON p.created_by = u.id
            ORDER BY p.created_at DESC
        ''')
        
        projects = []
        for row in cursor.fetchall():
            project_id = row[0]
            
            # Check if user has applied to this project (only if user is authenticated)
            has_applied = False
            if user_id:
                cursor.execute('SELECT id FROM project_applications WHERE student_id = ? AND project_id = ?', 
                              (user_id, project_id))
                has_applied = cursor.fetchone() is not None
            
            # Apply availability filter
            if availability_filter == 'available' and has_applied:
                continue
            elif availability_filter == 'not_available' and not has_applied:
                continue
            
            projects.append({
                'id': project_id,
                'title': row[1],
                'description': row[2],
                'category': row[3],
                'status': row[4],
                'team_members': json.loads(row[5]) if row[5] else [],
                'tags': json.loads(row[6]) if row[6] else [],
                'skills_required': json.loads(row[7]) if row[7] else [],
                'stipend': row[8],
                'duration': row[9],
                'location': row[10],
                'work_type': row[11],
                'created_at': row[12],
                'created_by_name': row[13],
                'is_recruiting': bool(row[14]) if row[14] is not None else True,
                'images': json.loads(row[15]) if row[15] else [],
                'project_links': json.loads(row[16]) if row[16] else [],
                'jd_pdf': row[17],
                'created_by_id': row[18],
                'contact_details': json.loads(row[19]) if row[19] else {},
                'team_roles': json.loads(row[20]) if row[20] else [],
                'partners': json.loads(row[21]) if row[21] else [],
                'funding': row[22],
                'highlights': json.loads(row[23]) if row[23] else [],
                'has_applied': has_applied
            })
        
        return jsonify(projects), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# Get recommended projects for a student based on their skills
@app.route('/api/projects/recommended', methods=['GET'])
@jwt_required()
def get_recommended_projects():
    user_id = get_user_id_from_jwt()
    
    conn = sqlite3.connect('launchpad.db')
    cursor = conn.cursor()
    
    try:
        # Get user's skills
        cursor.execute('''
            SELECT skill_name FROM user_skills WHERE user_id = ?
        ''', (user_id,))
        user_skills = [row[0].lower() for row in cursor.fetchall()]
        
        # Get user's department and specialization for additional matching
        cursor.execute('''
            SELECT department, specialization, branch FROM users WHERE id = ?
        ''', (user_id,))
        user_data = cursor.fetchone()
        user_keywords = []
        if user_data:
            if user_data[0]:  # department
                user_keywords.append(user_data[0].lower())
            if user_data[1]:  # specialization
                user_keywords.append(user_data[1].lower())
            if user_data[2]:  # branch
                user_keywords.append(user_data[2].lower())
        
        # Get all active projects
        cursor.execute('''
            SELECT p.id, p.title, p.description, p.category, p.status, p.team_members, p.tags, p.skills_required, 
                   p.stipend, p.duration, p.location, p.work_type, p.created_at, u.name as created_by_name, p.is_recruiting,
                   p.images, p.project_links, p.jd_pdf, p.created_by, p.contact_details, p.team_roles, p.partners, p.funding, p.highlights
            FROM projects p
            LEFT JOIN users u ON p.created_by = u.id
            WHERE p.status = 'active'
            ORDER BY p.created_at DESC
        ''')
        
        projects_with_scores = []
        for row in cursor.fetchall():
            project_id = row[0]
            
            # Check if user has already applied
            cursor.execute('SELECT id FROM project_applications WHERE student_id = ? AND project_id = ?', 
                          (user_id, project_id))
            if cursor.fetchone():
                continue  # Skip projects already applied to
            
            # Calculate match score
            skills_required = json.loads(row[7]) if row[7] else []
            tags = json.loads(row[6]) if row[6] else []
            title = row[1].lower()
            description = row[2].lower()
            category = row[3].lower()
            
            score = 0
            matched_skills = []
            
            # Match skills (highest weight)
            for skill in user_skills:
                for req_skill in skills_required:
                    if skill in req_skill.lower() or req_skill.lower() in skill:
                        score += 10
                        matched_skills.append(req_skill)
                        break
            
            # Match tags
            for skill in user_skills:
                for tag in tags:
                    if skill in tag.lower() or tag.lower() in skill:
                        score += 5
                        break
            
            # Match keywords in title and description
            for keyword in user_keywords:
                if keyword in title:
                    score += 3
                if keyword in description:
                    score += 2
                if keyword in category:
                    score += 3
            
            # Match skills in title/description
            for skill in user_skills:
                if skill in title:
                    score += 4
                if skill in description:
                    score += 2
            
            # Only include projects with some relevance
            if score > 0:
                project_data = {
                    'id': project_id,
                    'title': row[1],
                    'description': row[2],
                    'category': row[3],
                    'status': row[4],
                    'team_members': json.loads(row[5]) if row[5] else [],
                    'tags': tags,
                    'skills_required': skills_required,
                    'stipend': row[8],
                    'duration': row[9],
                    'location': row[10],
                    'work_type': row[11],
                    'created_at': row[12],
                    'created_by_name': row[13],
                    'is_recruiting': bool(row[14]) if row[14] is not None else True,
                    'images': json.loads(row[15]) if row[15] else [],
                    'project_links': json.loads(row[16]) if row[16] else [],
                    'jd_pdf': row[17],
                    'created_by_id': row[18],
                    'contact_details': json.loads(row[19]) if row[19] else {},
                    'team_roles': json.loads(row[20]) if row[20] else [],
                    'partners': json.loads(row[21]) if row[21] else [],
                    'funding': row[22],
                    'highlights': json.loads(row[23]) if row[23] else [],
                    'match_score': score,
                    'matched_skills': list(set(matched_skills))
                }
                projects_with_scores.append(project_data)
        
        # Sort by match score (highest first)
        projects_with_scores.sort(key=lambda x: x['match_score'], reverse=True)
        
        # If no matches, return recent active projects
        if not projects_with_scores:
            cursor.execute('''
                SELECT p.id, p.title, p.description, p.category, p.status, p.team_members, p.tags, p.skills_required, 
                       p.stipend, p.duration, p.location, p.work_type, p.created_at, u.name as created_by_name, p.is_recruiting,
                       p.images, p.project_links, p.jd_pdf, p.created_by, p.contact_details, p.team_roles, p.partners, p.funding, p.highlights
                FROM projects p
                LEFT JOIN users u ON p.created_by = u.id
                WHERE p.status = 'active'
                ORDER BY p.created_at DESC
                LIMIT 10
            ''')
            
            for row in cursor.fetchall():
                project_id = row[0]
                cursor.execute('SELECT id FROM project_applications WHERE student_id = ? AND project_id = ?', 
                              (user_id, project_id))
                if cursor.fetchone():
                    continue
                    
                projects_with_scores.append({
                    'id': project_id,
                    'title': row[1],
                    'description': row[2],
                    'category': row[3],
                    'status': row[4],
                    'team_members': json.loads(row[5]) if row[5] else [],
                    'tags': json.loads(row[6]) if row[6] else [],
                    'skills_required': json.loads(row[7]) if row[7] else [],
                    'stipend': row[8],
                    'duration': row[9],
                    'location': row[10],
                    'work_type': row[11],
                    'created_at': row[12],
                    'created_by_name': row[13],
                    'is_recruiting': bool(row[14]) if row[14] is not None else True,
                    'images': json.loads(row[15]) if row[15] else [],
                    'project_links': json.loads(row[16]) if row[16] else [],
                    'jd_pdf': row[17],
                    'created_by_id': row[18],
                    'contact_details': json.loads(row[19]) if row[19] else {},
                    'team_roles': json.loads(row[20]) if row[20] else [],
                    'partners': json.loads(row[21]) if row[21] else [],
                    'funding': row[22],
                    'highlights': json.loads(row[23]) if row[23] else [],
                    'match_score': 0,
                    'matched_skills': []
                })
        
        return jsonify(projects_with_scores), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# Create a project (alumni only)
@app.route('/api/projects', methods=['POST'])
@jwt_required()
def create_project():
    try:
        user_id = get_user_id_from_jwt()
        print(f"DEBUG: User ID from JWT: {user_id}")
    except Exception as e:
        print(f"DEBUG: JWT Error: {e}")
        return jsonify({'error': f'JWT Error: {str(e)}'}), 422
    
    data = request.get_json()
    print(f"DEBUG: Request data: {data}")
    print(f"DEBUG: Authorization header: {request.headers.get('Authorization')}")
    print(f"DEBUG: All headers: {dict(request.headers)}")

    conn = sqlite3.connect('launchpad.db')
    cursor = conn.cursor()

    try:
        cursor.execute('SELECT role FROM users WHERE id = ?', (user_id,))
        role_row = cursor.fetchone()
        if not role_row or role_row[0] != 'alumni':
            return jsonify({'error': 'Only alumni can create projects'}), 403

        required = ['title', 'description', 'category']
        for field in required:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400

        status = data.get('status') or 'active'
        team_members = json.dumps(data.get('team_members', []))
        tags = json.dumps(data.get('tags', []))
        skills_required = json.dumps(data.get('skills_required', []))
        is_recruiting = data.get('is_recruiting', True)
        # Enforce uploads-only for images/JD: initialize empty values here
        images = json.dumps([])
        project_links = json.dumps(data.get('project_links', []))
        jd_pdf = None
        contact_details = json.dumps(data.get('contact_details', {}))
        team_roles = json.dumps(data.get('team_roles', []))
        partners = json.dumps(data.get('partners', []))
        funding = data.get('funding')
        highlights = json.dumps(data.get('highlights', []))

        cursor.execute('''
            INSERT INTO projects (title, description, category, status, team_members, tags, skills_required, stipend, duration, location, work_type, is_recruiting, images, project_links, jd_pdf, contact_details, team_roles, partners, funding, highlights, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''' , (
            data['title'], data['description'], data['category'], status, team_members, tags, skills_required,
            None, None, None, None, is_recruiting, images, project_links, jd_pdf, contact_details, team_roles, partners, funding, highlights, user_id
        ))

        project_id = cursor.lastrowid
        
        # Create positions if provided
        positions = data.get('positions', [])
        if positions:
            for position in positions:
                cursor.execute('''
                    INSERT INTO project_positions (project_id, title, description, required_skills, count, filled_count, is_active, stipend, duration, location)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    project_id,
                    position.get('title'),
                    position.get('description'),
                    json.dumps(position.get('required_skills', [])),
                    position.get('count', 1),
                    0,
                    True,
                    position.get('stipend'),
                    position.get('duration'),
                    position.get('location')
                ))
        
        conn.commit()
        return jsonify({'id': project_id, 'message': 'Project created'}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# Update a project (alumni only - project creator)
@app.route('/api/projects/<int:project_id>', methods=['PUT'])
@jwt_required()
def update_project(project_id):
    try:
        user_id = get_user_id_from_jwt()
    except Exception as e:
        return jsonify({'error': f'JWT Error: {str(e)}'}), 422
    
    data = request.get_json()
    conn = sqlite3.connect('launchpad.db')
    cursor = conn.cursor()

    try:
        # Check if project exists and user is the creator
        cursor.execute('SELECT created_by FROM projects WHERE id = ?', (project_id,))
        project = cursor.fetchone()
        
        if not project:
            return jsonify({'error': 'Project not found'}), 404
        
        if project[0] != user_id:
            return jsonify({'error': 'Only the project creator can update this project'}), 403

        # Prepare update data
        team_members = json.dumps(data.get('team_members', [])) if 'team_members' in data else None
        tags = json.dumps(data.get('tags', [])) if 'tags' in data else None
        skills_required = json.dumps(data.get('skills_required', [])) if 'skills_required' in data else None
        images = json.dumps(data.get('images', [])) if 'images' in data else None
        project_links = json.dumps(data.get('project_links', [])) if 'project_links' in data else None
        contact_details = json.dumps(data.get('contact_details', {})) if 'contact_details' in data else None
        team_roles = json.dumps(data.get('team_roles', [])) if 'team_roles' in data else None
        partners = json.dumps(data.get('partners', [])) if 'partners' in data else None
        highlights = json.dumps(data.get('highlights', [])) if 'highlights' in data else None

        # Build dynamic update query
        update_fields = []
        update_values = []
        
        if 'title' in data:
            update_fields.append('title = ?')
            update_values.append(data['title'])
        if 'description' in data:
            update_fields.append('description = ?')
            update_values.append(data['description'])
        if 'category' in data:
            update_fields.append('category = ?')
            update_values.append(data['category'])
        if 'status' in data:
            update_fields.append('status = ?')
            update_values.append(data['status'])
        if team_members is not None:
            update_fields.append('team_members = ?')
            update_values.append(team_members)
        if tags is not None:
            update_fields.append('tags = ?')
            update_values.append(tags)
        if skills_required is not None:
            update_fields.append('skills_required = ?')
            update_values.append(skills_required)
        # Note: stipend, duration, location, work_type are now only at position level
        if 'is_recruiting' in data:
            update_fields.append('is_recruiting = ?')
            update_values.append(data.get('is_recruiting'))
        # Do not allow direct setting of images via update; use upload endpoint
        if project_links is not None:
            update_fields.append('project_links = ?')
            update_values.append(project_links)
        # Do not allow direct setting of jd_pdf; use upload endpoint
        if contact_details is not None:
            update_fields.append('contact_details = ?')
            update_values.append(contact_details)
        if team_roles is not None:
            update_fields.append('team_roles = ?')
            update_values.append(team_roles)
        if partners is not None:
            update_fields.append('partners = ?')
            update_values.append(partners)
        if 'funding' in data:
            update_fields.append('funding = ?')
            update_values.append(data.get('funding'))
        if highlights is not None:
            update_fields.append('highlights = ?')
            update_values.append(highlights)

        if not update_fields and 'positions' not in data:
            return jsonify({'error': 'No fields to update'}), 400

        # Update project scalar fields
        if update_fields:
            update_values.append(project_id)
            query = f"UPDATE projects SET {', '.join(update_fields)} WHERE id = ?"
            cursor.execute(query, update_values)

        # Update positions if provided
        def coerce_bool(value):
            if isinstance(value, bool):
                return value
            if isinstance(value, int):
                return value != 0
            if isinstance(value, str):
                return value.strip().lower() in ['true', '1', 'yes', 'on']
            return bool(value)

        if 'positions' in data:
            for position in data.get('positions') or []:
                pos_id = position.get('id')
                title = position.get('title')
                description = position.get('description')
                required_skills_json = json.dumps(position.get('required_skills', []))
                count = position.get('count')
                is_active = 1 if coerce_bool(position.get('is_active', True)) else 0

                if pos_id:
                    # Only update if position belongs to this project
                    cursor.execute('SELECT id FROM project_positions WHERE id = ? AND project_id = ?', (pos_id, project_id))
                    if cursor.fetchone():
                        pos_fields = []
                        pos_values = []
                        if title is not None:
                            pos_fields.append('title = ?')
                            pos_values.append(title)
                        if description is not None:
                            pos_fields.append('description = ?')
                            pos_values.append(description)
                        if required_skills_json is not None:
                            pos_fields.append('required_skills = ?')
                            pos_values.append(required_skills_json)
                        if count is not None:
                            pos_fields.append('count = ?')
                            pos_values.append(count)
                        if position.get('stipend') is not None:
                            pos_fields.append('stipend = ?')
                            pos_values.append(position.get('stipend'))
                        if position.get('duration') is not None:
                            pos_fields.append('duration = ?')
                            pos_values.append(position.get('duration'))
                        if position.get('location') is not None:
                            pos_fields.append('location = ?')
                            pos_values.append(position.get('location'))
                        pos_fields.append('is_active = ?')
                        pos_values.append(is_active)
                        if pos_fields:
                            pos_values.extend([pos_id, project_id])
                            cursor.execute(f"UPDATE project_positions SET {', '.join(pos_fields)} WHERE id = ? AND project_id = ?", pos_values)
                else:
                    # Insert new position
                    cursor.execute('''
                        INSERT INTO project_positions (project_id, title, description, required_skills, count, filled_count, is_active, stipend, duration, location)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ''', (
                        project_id,
                        title,
                        description,
                        required_skills_json,
                        count or 1,
                        0,
                        is_active,
                        position.get('stipend'),
                        position.get('duration'),
                        position.get('location')
                    ))

        conn.commit()
        return jsonify({'message': 'Project updated successfully'}), 200
    except Exception as e:
        conn.rollback()
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
                   b.images, b.pdfs, u.name as author_name, b.author_id
            FROM blog_posts b
            LEFT JOIN users u ON b.author_id = u.id
            ORDER BY b.created_at DESC
        ''')
        
        posts = []
        for row in cursor.fetchall():
            post_id = row[0]
            
            # Get likes count for this post
            cursor.execute('SELECT COUNT(*) FROM blog_likes WHERE blog_post_id = ?', (post_id,))
            likes_count = cursor.fetchone()[0]
            
            posts.append({
                'id': post_id,
                'title': row[1],
                'content': row[2],
                'category': row[3],
                'created_at': row[4],
                'updated_at': row[5],
                'images': json.loads(row[6]) if row[6] else [],
                'pdfs': json.loads(row[7]) if row[7] else [],
                'author_name': row[8],
                'author_id': row[9],
                'likes_count': likes_count,
                'is_liked': False  # Will be updated if user is logged in
            })
        
        return jsonify(posts), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/blog', methods=['POST'])
@jwt_required()
def create_blog_post():
    try:
        user_id = get_user_id_from_jwt()
        print(f"DEBUG: User ID from JWT: {user_id}")
    except Exception as e:
        print(f"DEBUG: JWT Error: {e}")
        return jsonify({'error': f'JWT Error: {str(e)}'}), 422
    
    data = request.get_json()
    print(f"DEBUG: Request data: {data}")
    print(f"DEBUG: Authorization header: {request.headers.get('Authorization')}")
    print(f"DEBUG: All headers: {dict(request.headers)}")

    conn = sqlite3.connect('launchpad.db')
    cursor = conn.cursor()

    try:
        cursor.execute('SELECT role FROM users WHERE id = ?', (user_id,))
        role_row = cursor.fetchone()
        if not role_row or role_row[0] != 'alumni':
            return jsonify({'error': 'Only alumni can create blog posts'}), 403

        required = ['title', 'content']
        for field in required:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400

        # Enforce uploads-only for blogs: start with empty arrays
        images_json = json.dumps([])
        pdfs_json = json.dumps([])
        cursor.execute('''
            INSERT INTO blog_posts (title, content, category, author_id, images, pdfs)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (data['title'], data['content'], data.get('category'), user_id, images_json, pdfs_json))

        conn.commit()
        post_id = cursor.lastrowid
        return jsonify({'id': post_id, 'message': 'Blog post created'}), 201
    except Exception as e:
        conn.rollback()
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
                   b.images, b.pdfs, u.name as author_name, b.author_id
            FROM blog_posts b
            LEFT JOIN users u ON b.author_id = u.id
            WHERE b.id = ?
        ''', (post_id,))
        
        post_data = cursor.fetchone()
        
        if not post_data:
            return jsonify({'error': 'Blog post not found'}), 404
        
        # Get likes count
        cursor.execute('SELECT COUNT(*) FROM blog_likes WHERE blog_post_id = ?', (post_id,))
        likes_count = cursor.fetchone()[0]
        
        # Check if current user has liked this post (if user is logged in)
        is_liked = False
        # Note: We'll need to get user_id from JWT token for this to work properly
        
        post = {
            'id': post_data[0],
            'title': post_data[1],
            'content': post_data[2],
            'category': post_data[3],
            'created_at': post_data[4],
            'updated_at': post_data[5],
            'images': json.loads(post_data[6]) if post_data[6] else [],
            'pdfs': json.loads(post_data[7]) if post_data[7] else [],
            'author_name': post_data[8],
            'author_id': post_data[9],
            'likes_count': likes_count,
            'is_liked': is_liked
        }
        
        return jsonify(post), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# Update a blog post (author only)
@app.route('/api/blog/<int:post_id>', methods=['PUT'])
@jwt_required()
def update_blog_post(post_id):
    try:
        user_id = get_user_id_from_jwt()
    except Exception as e:
        return jsonify({'error': f'JWT Error: {str(e)}'}), 422
    data = request.get_json()
    conn = sqlite3.connect('launchpad.db')
    cursor = conn.cursor()
    try:
        cursor.execute('SELECT author_id FROM blog_posts WHERE id = ?', (post_id,))
        row = cursor.fetchone()
        if not row:
            return jsonify({'error': 'Blog post not found'}), 404
        if row[0] != user_id:
            return jsonify({'error': 'Only the author can update this post'}), 403
        fields = []
        values = []
        if 'title' in data:
            fields.append('title = ?')
            values.append(data['title'])
        if 'content' in data:
            fields.append('content = ?')
            values.append(data['content'])
        if 'category' in data:
            fields.append('category = ?')
            values.append(data['category'])
        # Do not allow direct setting of images/pdfs via update; use upload endpoints
        if not fields:
            return jsonify({'error': 'No fields to update'}), 400
        fields.append('updated_at = CURRENT_TIMESTAMP')
        query = f"UPDATE blog_posts SET {', '.join(fields)} WHERE id = ?"
        values.append(post_id)
        cursor.execute(query, values)
        conn.commit()
        return jsonify({'message': 'Blog post updated successfully'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# Delete a blog post (author only)
@app.route('/api/blog/<int:post_id>', methods=['DELETE'])
@jwt_required()
def delete_blog_post(post_id):
    try:
        user_id = get_user_id_from_jwt()
    except Exception as e:
        return jsonify({'error': f'JWT Error: {str(e)}'}), 422
    conn = sqlite3.connect('launchpad.db')
    cursor = conn.cursor()
    try:
        cursor.execute('SELECT author_id FROM blog_posts WHERE id = ?', (post_id,))
        row = cursor.fetchone()
        if not row:
            return jsonify({'error': 'Blog post not found'}), 404
        if row[0] != user_id:
            return jsonify({'error': 'Only the author can delete this post'}), 403
        cursor.execute('DELETE FROM blog_posts WHERE id = ?', (post_id,))
        # Clean up likes for this post
        cursor.execute('DELETE FROM blog_likes WHERE blog_post_id = ?', (post_id,))
        conn.commit()
        return jsonify({'message': 'Blog post deleted successfully'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_user_id_from_jwt()
    
    conn = sqlite3.connect('launchpad.db')
    cursor = conn.cursor()
    
    try:
        # Get basic user info
        cursor.execute('''
            SELECT id, name, email, role, graduation_year, department, hall, branch, bio,
                   current_company, current_position, location, work_preference,
                   phone, website, linkedin, github, avatar, program, joining_year,
                   institute, specialization, past_projects, cv_pdf
            FROM users WHERE id = ?
        ''', (user_id,))
        user_data = cursor.fetchone()
        
        if not user_data:
            return jsonify({'error': 'User not found'}), 404
        
        # Get skills
        cursor.execute('SELECT skill_name, skill_type, proficiency_level FROM user_skills WHERE user_id = ?', (user_id,))
        skills_data = cursor.fetchall()
        
        # Get achievements
        cursor.execute('SELECT title, description, achievement_type, date_earned, issuer FROM user_achievements WHERE user_id = ?', (user_id,))
        achievements_data = cursor.fetchall()
        
        # Get languages
        cursor.execute('SELECT language_name, proficiency_level FROM user_languages WHERE user_id = ?', (user_id,))
        languages_data = cursor.fetchall()
        
        user = {
            'id': user_data[0],
            'name': user_data[1],
            'email': user_data[2],
            'role': user_data[3],
            'graduation_year': user_data[4],
            'department': user_data[5],
            'hall': user_data[6],
            'branch': user_data[7],
            'bio': user_data[8],
            'current_company': user_data[9],
            'current_position': user_data[10],
            'location': user_data[11],
            'work_preference': user_data[12],
            'phone': user_data[13],
            'website': user_data[14],
            'linkedin': user_data[15],
            'github': user_data[16],
            'avatar': user_data[17],
            'program': user_data[18],
            'joining_year': user_data[19],
            'institute': user_data[20],
            'specialization': user_data[21],
            'past_projects': json.loads(user_data[22]) if user_data[22] else [],
            'cv_pdf': user_data[23],
            'skills': [{'name': s[0], 'type': s[1], 'proficiency': s[2]} for s in skills_data],
            'achievements': [{'title': a[0], 'description': a[1], 'type': a[2], 'date_earned': a[3], 'issuer': a[4]} for a in achievements_data],
            'languages': [{'name': l[0], 'proficiency': l[1]} for l in languages_data]
        }
        
        return jsonify(user), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# Get user profile by ID (for viewing other users' profiles)
@app.route('/api/users/<int:user_id>/profile', methods=['GET'])
@jwt_required()
def get_user_profile_by_id(user_id):
    conn = sqlite3.connect('launchpad.db')
    cursor = conn.cursor()
    
    try:
        # Get basic user info
        cursor.execute('''
            SELECT id, name, email, role, graduation_year, department, hall, branch, bio,
                   current_company, current_position, location, work_preference,
                   phone, website, linkedin, github, avatar, program, joining_year,
                   institute, specialization, past_projects, cv_pdf
            FROM users WHERE id = ?
        ''', (user_id,))
        user_data = cursor.fetchone()
        
        if not user_data:
            return jsonify({'error': 'User not found'}), 404
        
        # Get skills
        cursor.execute('SELECT skill_name, skill_type, proficiency_level FROM user_skills WHERE user_id = ?', (user_id,))
        skills_data = cursor.fetchall()
        
        # Get achievements
        cursor.execute('SELECT title, description, achievement_type, date_earned, issuer FROM user_achievements WHERE user_id = ?', (user_id,))
        achievements_data = cursor.fetchall()
        
        # Get languages
        cursor.execute('SELECT language_name, proficiency_level FROM user_languages WHERE user_id = ?', (user_id,))
        languages_data = cursor.fetchall()
        
        user = {
            'id': user_data[0],
            'name': user_data[1],
            'email': user_data[2],
            'role': user_data[3],
            'graduation_year': user_data[4],
            'department': user_data[5],
            'hall': user_data[6],
            'branch': user_data[7],
            'bio': user_data[8],
            'current_company': user_data[9],
            'current_position': user_data[10],
            'location': user_data[11],
            'work_preference': user_data[12],
            'phone': user_data[13],
            'website': user_data[14],
            'linkedin': user_data[15],
            'github': user_data[16],
            'avatar': user_data[17],
            'program': user_data[18],
            'joining_year': user_data[19],
            'institute': user_data[20],
            'specialization': user_data[21],
            'past_projects': json.loads(user_data[22]) if user_data[22] else [],
            'cv_pdf': user_data[23],
            'skills': [{'name': s[0], 'type': s[1], 'proficiency': s[2]} for s in skills_data],
            'achievements': [{'title': a[0], 'description': a[1], 'type': a[2], 'date_earned': a[3], 'issuer': a[4]} for a in achievements_data],
            'languages': [{'name': l[0], 'proficiency': l[1]} for l in languages_data]
        }
        
        return jsonify(user), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# Update profile endpoint
@app.route('/api/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_user_id_from_jwt()
    data = request.get_json()
    
    conn = sqlite3.connect('launchpad.db')
    cursor = conn.cursor()
    
    try:
        # Update basic profile info
        past_projects_json = json.dumps(data.get('past_projects')) if data.get('past_projects') else None
        
        cursor.execute('''
            UPDATE users SET 
                name = COALESCE(?, name),
                bio = COALESCE(?, bio),
                hall = COALESCE(?, hall),
                branch = COALESCE(?, branch),
                current_company = COALESCE(?, current_company),
                current_position = COALESCE(?, current_position),
                location = COALESCE(?, location),
                work_preference = COALESCE(?, work_preference),
                phone = COALESCE(?, phone),
                website = COALESCE(?, website),
                linkedin = COALESCE(?, linkedin),
                github = COALESCE(?, github),
                avatar = COALESCE(?, avatar),
                program = COALESCE(?, program),
                joining_year = COALESCE(?, joining_year),
                institute = COALESCE(?, institute),
                specialization = COALESCE(?, specialization),
                past_projects = COALESCE(?, past_projects)
            WHERE id = ?
        ''', (
            data.get('name'), data.get('bio'), data.get('hall'), data.get('branch'),
            data.get('current_company'), data.get('current_position'), data.get('location'),
            data.get('work_preference'), data.get('phone'), data.get('website'),
            data.get('linkedin'), data.get('github'), data.get('avatar'),
            data.get('program'), data.get('joining_year'), data.get('institute'),
            data.get('specialization'), past_projects_json, user_id
        ))
        
        # Update skills if provided
        if 'skills' in data:
            # Delete existing skills
            cursor.execute('DELETE FROM user_skills WHERE user_id = ?', (user_id,))
            # Insert new skills
            for skill in data['skills']:
                cursor.execute('''
                    INSERT INTO user_skills (user_id, skill_name, skill_type, proficiency_level)
                    VALUES (?, ?, ?, ?)
                ''', (user_id, skill.get('name'), skill.get('type', 'technical'), skill.get('proficiency', 'intermediate')))
        
        # Update achievements if provided
        if 'achievements' in data:
            # Delete existing achievements
            cursor.execute('DELETE FROM user_achievements WHERE user_id = ?', (user_id,))
            # Insert new achievements
            for achievement in data['achievements']:
                cursor.execute('''
                    INSERT INTO user_achievements (user_id, title, description, achievement_type, date_earned, issuer)
                    VALUES (?, ?, ?, ?, ?, ?)
                ''', (user_id, achievement.get('title'), achievement.get('description'), 
                      achievement.get('type', 'award'), achievement.get('date_earned'), achievement.get('issuer')))
        
        # Update languages if provided
        if 'languages' in data:
            # Delete existing languages
            cursor.execute('DELETE FROM user_languages WHERE user_id = ?', (user_id,))
            # Insert new languages
            for language in data['languages']:
                cursor.execute('''
                    INSERT INTO user_languages (user_id, language_name, proficiency_level)
                    VALUES (?, ?, ?)
                ''', (user_id, language.get('name'), language.get('proficiency', 'intermediate')))
        
        conn.commit()
        return jsonify({'message': 'Profile updated successfully'}), 200
        
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# Project application endpoints
@app.route('/api/projects/<int:project_id>/apply', methods=['POST'])
@jwt_required()
def apply_to_project(project_id):
    user_id = get_user_id_from_jwt()
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

# Get projects a student applied to
@app.route('/api/students/applied-projects', methods=['GET'])
@jwt_required()
def get_student_applied_projects():
    user_id = get_user_id_from_jwt()

    conn = sqlite3.connect('launchpad.db')
    cursor = conn.cursor()

    try:
        cursor.execute('SELECT role FROM users WHERE id = ?', (user_id,))
        role_row = cursor.fetchone()
        if not role_row or role_row[0] != 'student':
            return jsonify({'error': 'Only students can view applied projects'}), 403

        cursor.execute('''
            SELECT p.id, p.title, p.description, p.category, p.status, p.team_members, p.tags, p.created_at,
                   u.name as created_by_name, pa.status as application_status, pa.created_at as applied_at,
                   pa.is_completed, pa.completed_at, pa.feedback
            FROM project_applications pa
            JOIN projects p ON pa.project_id = p.id
            LEFT JOIN users u ON p.created_by = u.id
            WHERE pa.student_id = ?
            ORDER BY pa.created_at DESC
        ''', (user_id,))

        results = []
        for row in cursor.fetchall():
            results.append({
                'id': row[0],
                'title': row[1],
                'description': row[2],
                'category': row[3],
                'status': row[4],
                'team_members': json.loads(row[5]) if row[5] else [],
                'tags': json.loads(row[6]) if row[6] else [],
                'created_at': row[7],
                'created_by_name': row[8],
                'application_status': row[9],
                'applied_at': row[10],
                'is_completed': bool(row[11]) if row[11] is not None else False,
                'completed_at': row[12],
                'feedback': row[13]
            })

        return jsonify(results), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/projects/<int:project_id>', methods=['GET'])
def get_project_detail(project_id):
    conn = sqlite3.connect('launchpad.db')
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            SELECT p.id, p.title, p.description, p.category, p.status, p.team_members, p.tags, p.skills_required,
                   p.stipend, p.duration, p.location, p.work_type, p.created_at, u.id as created_by_id, u.name as created_by_name, u.email as created_by_email,
                   p.is_recruiting, p.images, p.project_links, p.jd_pdf, p.contact_details, p.team_roles, p.partners, p.funding, p.highlights
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
            'skills_required': json.loads(project_data[7]) if project_data[7] else [],
            'stipend': project_data[8],
            'duration': project_data[9],
            'location': project_data[10],
            'work_type': project_data[11],
            'created_at': project_data[12],
            'created_by_id': project_data[13],
            'created_by_name': project_data[14],
            'created_by_email': project_data[15],
            'is_recruiting': bool(project_data[16]) if project_data[16] is not None else True,
            'images': json.loads(project_data[17]) if project_data[17] else [],
            'project_links': json.loads(project_data[18]) if project_data[18] else [],
            'jd_pdf': project_data[19],
            'contact_details': json.loads(project_data[20]) if project_data[20] else {},
            'team_roles': json.loads(project_data[21]) if project_data[21] else [],
            'partners': json.loads(project_data[22]) if project_data[22] else [],
            'funding': project_data[23],
            'highlights': json.loads(project_data[24]) if project_data[24] else []
        }
        
        # Fetch positions for this project
        cursor.execute('''
            SELECT pp.id, pp.title, pp.description, pp.required_skills, pp.count, pp.filled_count, pp.is_active,
                   u.id as selected_student_id, u.name as selected_student_name, u.email as selected_student_email,
                   pp.stipend, pp.duration, pp.location
            FROM project_positions pp
            LEFT JOIN project_applications pa ON pp.id = pa.position_id AND pa.status = 'accepted'
            LEFT JOIN users u ON pa.student_id = u.id
            WHERE pp.project_id = ?
            ORDER BY pp.id
        ''', (project_id,))
        
        positions_data = cursor.fetchall()
        positions_dict = {}
        
        for pos_data in positions_data:
            pos_id = pos_data[0]
            if pos_id not in positions_dict:
                positions_dict[pos_id] = {
                    'id': pos_id,
                    'title': pos_data[1],
                    'description': pos_data[2],
                    'required_skills': json.loads(pos_data[3]) if pos_data[3] else [],
                    'count': pos_data[4],
                    'filled_count': pos_data[5],
                    'is_active': bool(pos_data[6]),
                    'selected_students': [],
                    'stipend': pos_data[10],
                    'duration': pos_data[11],
                    'location': pos_data[12]
                }
            
            # Add selected student if exists
            if pos_data[7]:  # selected_student_id
                positions_dict[pos_id]['selected_students'].append({
                    'id': pos_data[7],
                    'name': pos_data[8],
                    'email': pos_data[9]
                })
        
        project['positions'] = list(positions_dict.values())
        
        return jsonify(project), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# Mentorship request endpoints
@app.route('/api/mentorship/request', methods=['POST'])
@jwt_required()
def request_mentorship():
    user_id = get_user_id_from_jwt()
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

# Create mentorship request (student sends to alumni)
@app.route('/api/mentorship/requests', methods=['POST'])
@jwt_required()
def create_mentorship_request():
    user_id = get_user_id_from_jwt()
    data = request.get_json()
    
    alumni_id = data.get('alumni_id')
    message = data.get('message', '')
    
    if not alumni_id:
        return jsonify({'error': 'Alumni ID is required'}), 400
    
    conn = sqlite3.connect('launchpad.db')
    cursor = conn.cursor()
    
    try:
        # Check if user is a student
        cursor.execute('SELECT role FROM users WHERE id = ?', (user_id,))
        user_role = cursor.fetchone()
        
        if not user_role or user_role[0] != 'student':
            return jsonify({'error': 'Only students can send mentorship requests'}), 403
        
        # Check if alumni exists
        cursor.execute('SELECT role FROM users WHERE id = ?', (alumni_id,))
        alumni = cursor.fetchone()
        
        if not alumni:
            return jsonify({'error': 'Alumni not found'}), 404
        
        if alumni[0] != 'alumni':
            return jsonify({'error': 'User is not an alumni'}), 400
        
        # Check if request already exists
        cursor.execute('''
            SELECT id FROM mentorship_requests 
            WHERE student_id = ? AND alumni_id = ?
        ''', (user_id, alumni_id))
        
        existing = cursor.fetchone()
        if existing:
            return jsonify({'error': 'You have already sent a mentorship request to this alumni'}), 400
        
        # Create mentorship request
        cursor.execute('''
            INSERT INTO mentorship_requests (student_id, alumni_id, message, status, created_at)
            VALUES (?, ?, ?, 'pending', datetime('now'))
        ''', (user_id, alumni_id, message))
        
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
    user_id = get_user_id_from_jwt()
    
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
            SELECT id, name, email, graduation_year, department, hall, branch, bio,
                   current_company, current_position, location, work_preference,
                   linkedin, github, years_of_experience, domain, tech_skills
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
                'department': row[4],
                'hall': row[5],
                'branch': row[6],
                'bio': row[7],
                'current_company': row[8],
                'current_position': row[9],
                'location': row[10],
                'work_preference': row[11],
                'linkedin': row[12],
                'github': row[13],
                'years_of_experience': row[14],
                'domain': row[15],
                'tech_skills': json.loads(row[16]) if row[16] else []
            })
        
        return jsonify(alumni), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# Student dashboard statistics
@app.route('/api/students/dashboard-stats', methods=['GET'])
@jwt_required()
def get_student_dashboard_stats():
    user_id = get_user_id_from_jwt()
    
    conn = sqlite3.connect('launchpad.db')
    cursor = conn.cursor()
    
    try:
        # Check if user is a student
        cursor.execute('SELECT role FROM users WHERE id = ?', (user_id,))
        user_role = cursor.fetchone()
        
        if not user_role or user_role[0] != 'student':
            return jsonify({'error': 'Only students can access dashboard stats'}), 403
        
        # Get applied projects count
        cursor.execute('SELECT COUNT(*) FROM project_applications WHERE student_id = ?', (user_id,))
        applied_projects = cursor.fetchone()[0]
        
        # Get accepted projects count
        cursor.execute('SELECT COUNT(*) FROM project_applications WHERE student_id = ? AND status = "accepted"', (user_id,))
        accepted_projects = cursor.fetchone()[0]
        
        # Get pending applications count
        cursor.execute('SELECT COUNT(*) FROM project_applications WHERE student_id = ? AND status = "pending"', (user_id,))
        pending_applications = cursor.fetchone()[0]
        
        # Get mentorship requests count
        cursor.execute('SELECT COUNT(*) FROM mentorship_requests WHERE student_id = ?', (user_id,))
        mentorship_requests = cursor.fetchone()[0]
        
        stats = {
            'applied_projects': applied_projects,
            'accepted_projects': accepted_projects,
            'pending_applications': pending_applications,
            'mentorship_requests': mentorship_requests
        }
        
        return jsonify(stats), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# Alumni dashboard statistics
@app.route('/api/alumni/dashboard-stats', methods=['GET'])
@jwt_required()
def get_alumni_dashboard_stats():
    user_id = get_user_id_from_jwt()
    
    conn = sqlite3.connect('launchpad.db')
    cursor = conn.cursor()
    
    try:
        # Check if user is an alumni
        cursor.execute('SELECT role FROM users WHERE id = ?', (user_id,))
        user_role = cursor.fetchone()
        
        if not user_role or user_role[0] != 'alumni':
            return jsonify({'error': 'Only alumni can access dashboard stats'}), 403
        
        # Get active projects count
        cursor.execute('SELECT COUNT(*) FROM projects WHERE created_by = ? AND status = "active"', (user_id,))
        active_projects = cursor.fetchone()[0]
        
        # Get total projects count
        cursor.execute('SELECT COUNT(*) FROM projects WHERE created_by = ?', (user_id,))
        total_projects = cursor.fetchone()[0]
        
        # Get mentees count (accepted mentorship requests)
        cursor.execute('SELECT COUNT(*) FROM mentorship_requests WHERE alumni_id = ? AND status = "accepted"', (user_id,))
        mentees = cursor.fetchone()[0]
        
        # Get blog posts count
        cursor.execute('SELECT COUNT(*) FROM blog_posts WHERE author_id = ?', (user_id,))
        blog_posts = cursor.fetchone()[0]
        
        # Get pending mentorship requests count
        cursor.execute('SELECT COUNT(*) FROM mentorship_requests WHERE alumni_id = ? AND status = "pending"', (user_id,))
        pending_mentorship_requests = cursor.fetchone()[0]
        
        # Get pending project applications count
        cursor.execute('''
            SELECT COUNT(*) FROM project_applications pa
            JOIN projects p ON pa.project_id = p.id
            WHERE p.created_by = ? AND pa.status = "pending"
        ''', (user_id,))
        pending_project_applications = cursor.fetchone()[0]
        
        stats = {
            'active_projects': active_projects,
            'total_projects': total_projects,
            'mentees': mentees,
            'blog_posts': blog_posts,
            'pending_mentorship_requests': pending_mentorship_requests,
            'pending_project_applications': pending_project_applications
        }
        
        return jsonify(stats), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# Accept/Decline mentorship request
@app.route('/api/mentorship/<int:request_id>/<action>', methods=['POST'])
@jwt_required()
def handle_mentorship_request(request_id, action):
    user_id = get_user_id_from_jwt()
    
    if action not in ['accept', 'decline']:
        return jsonify({'error': 'Invalid action'}), 400
    
    conn = sqlite3.connect('launchpad.db')
    cursor = conn.cursor()
    
    try:
        # Check if user is an alumni and owns this request
        cursor.execute('''
            SELECT mr.id, mr.alumni_id, u.role
            FROM mentorship_requests mr
            JOIN users u ON mr.alumni_id = u.id
            WHERE mr.id = ?
        ''', (request_id,))
        
        request_data = cursor.fetchone()
        
        if not request_data:
            return jsonify({'error': 'Mentorship request not found'}), 404
        
        if request_data[1] != user_id:
            return jsonify({'error': 'You can only handle your own mentorship requests'}), 403
        
        if request_data[2] != 'alumni':
            return jsonify({'error': 'Only alumni can handle mentorship requests'}), 403
        
        # Update request status
        new_status = 'accepted' if action == 'accept' else 'declined'
        cursor.execute('''
            UPDATE mentorship_requests 
            SET status = ?
            WHERE id = ?
        ''', (new_status, request_id))
        
        conn.commit()
        return jsonify({'message': f'Mentorship request {action}ed successfully'}), 200
        
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# Get project applications for alumni
@app.route('/api/alumni/project-applications', methods=['GET'])
@jwt_required()
def get_alumni_project_applications():
    user_id = get_user_id_from_jwt()
    
    conn = sqlite3.connect('launchpad.db')
    cursor = conn.cursor()
    
    try:
        # Check if user is an alumni
        cursor.execute('SELECT role FROM users WHERE id = ?', (user_id,))
        user_role = cursor.fetchone()
        
        if not user_role or user_role[0] != 'alumni':
            return jsonify({'error': 'Only alumni can view project applications'}), 403
        
        # Get project applications for alumni's projects
        cursor.execute('''
            SELECT pa.id, pa.message, pa.status, pa.created_at,
                   p.title as project_title, p.id as project_id,
                   pa.student_id, u.name as student_name, u.email as student_email,
                   pa.position_id, pp.title as position_title,
                   pa.is_completed, pa.completed_at, pa.feedback
            FROM project_applications pa
            JOIN projects p ON pa.project_id = p.id
            JOIN users u ON pa.student_id = u.id
            LEFT JOIN project_positions pp ON pa.position_id = pp.id
            WHERE p.created_by = ?
            ORDER BY pa.created_at DESC
        ''', (user_id,))
        
        applications = []
        for row in cursor.fetchall():
            applications.append({
                'id': row[0],
                'message': row[1],
                'status': row[2],
                'created_at': row[3],
                'project_title': row[4],
                'project_id': row[5],
                'student_id': row[6],
                'student_name': row[7],
                'student_email': row[8],
                'position_id': row[9],
                'position_title': row[10],
                'is_completed': bool(row[11]) if row[11] is not None else False,
                'completed_at': row[12],
                'feedback': row[13]
            })
        
        return jsonify(applications), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()
  
# Get applications for a specific project (for alumni)
@app.route('/api/projects/<int:project_id>/applications', methods=['GET'])
@jwt_required()
def get_project_applications(project_id):
    user_id = get_user_id_from_jwt()
    
    conn = sqlite3.connect('launchpad.db')
    cursor = conn.cursor()
    
    try:
        # Check if user is an alumni and owns the project
        cursor.execute('SELECT role FROM users WHERE id = ?', (user_id,))
        user_role = cursor.fetchone()
        
        if not user_role or user_role[0] != 'alumni':
            return jsonify({'error': 'Only alumni can view project applications'}), 403
        
        cursor.execute('SELECT created_by FROM projects WHERE id = ?', (project_id,))
        project = cursor.fetchone()
        
        if not project:
            return jsonify({'error': 'Project not found'}), 404
        
        if project[0] != user_id:
            return jsonify({'error': 'You can only view applications for your own projects'}), 403
        
        # Get applications for this specific project
        cursor.execute('''
            SELECT pa.id, pa.message, pa.status, pa.created_at,
                   pa.student_id, u.name as student_name, u.email as student_email,
                   pa.position_id, pp.title as position_title,
                   pa.is_completed, pa.completed_at, pa.feedback
            FROM project_applications pa
            JOIN users u ON pa.student_id = u.id
            LEFT JOIN project_positions pp ON pa.position_id = pp.id
            WHERE pa.project_id = ?
            ORDER BY pa.created_at DESC
        ''', (project_id,))
        
        applications = []
        for row in cursor.fetchall():
            applications.append({
                'id': row[0],
                'message': row[1],
                'status': row[2],
                'created_at': row[3],
                'student_id': row[4],
                'student_name': row[5],
                'student_email': row[6],
                'position_id': row[7],
                'position_title': row[8],
                'is_completed': bool(row[9]) if row[9] is not None else False,
                'completed_at': row[10],
                'feedback': row[11]
            })
        
        return jsonify(applications), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# Submit feedback and mark project as completed for a student
@app.route('/api/project-applications/<int:application_id>/complete', methods=['POST'])
@jwt_required()
def complete_project_application(application_id):
    user_id = get_user_id_from_jwt()
    data = request.get_json()
    
    feedback = data.get('feedback', '')
    
    conn = sqlite3.connect('launchpad.db')
    cursor = conn.cursor()
    
    try:
        # Check if user is alumni
        cursor.execute('SELECT role FROM users WHERE id = ?', (user_id,))
        user_role = cursor.fetchone()
        
        if not user_role or user_role[0] != 'alumni':
            return jsonify({'error': 'Only alumni can mark projects as completed'}), 403
        
        # Get application details and verify ownership
        cursor.execute('''
            SELECT pa.student_id, pa.project_id, p.created_by, pa.status
            FROM project_applications pa
            JOIN projects p ON pa.project_id = p.id
            WHERE pa.id = ?
        ''', (application_id,))
        
        application = cursor.fetchone()
        
        print(f"DEBUG: Application {application_id} - Found: {application}")
        print(f"DEBUG: User ID: {user_id}, Project Owner: {application[2] if application else 'N/A'}")
        
        if not application:
            return jsonify({'error': 'Application not found'}), 404
        
        if application[2] != user_id:
            return jsonify({'error': 'You can only complete applications for your own projects'}), 403
        
        if application[3] != 'accepted':
            return jsonify({'error': f'Only accepted applications can be marked as completed. Current status: {application[3]}'}), 400
        
        # Update application with feedback and completion status
        try:
            cursor.execute('''
                UPDATE project_applications 
                SET feedback = ?, is_completed = 1, completed_at = CURRENT_TIMESTAMP
                WHERE id = ?
            ''', (feedback, application_id))
        except sqlite3.OperationalError as e:
            # Column might not exist, try to add it
            if 'no such column' in str(e).lower():
                try:
                    cursor.execute('ALTER TABLE project_applications ADD COLUMN feedback TEXT')
                    cursor.execute('ALTER TABLE project_applications ADD COLUMN completed_at TIMESTAMP')
                    cursor.execute('ALTER TABLE project_applications ADD COLUMN is_completed BOOLEAN DEFAULT 0')
                    conn.commit()
                    # Retry the update
                    cursor.execute('''
                        UPDATE project_applications 
                        SET feedback = ?, is_completed = 1, completed_at = CURRENT_TIMESTAMP
                        WHERE id = ?
                    ''', (feedback, application_id))
                except Exception as alter_error:
                    return jsonify({'error': f'Database schema error: {str(alter_error)}'}), 500
            else:
                raise
        
        conn.commit()
        
        return jsonify({
            'message': 'Project marked as completed successfully',
            'application_id': application_id,
            'feedback': feedback
        }), 200
        
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# Get feedback for a student's completed projects
@app.route('/api/students/completed-projects', methods=['GET'])
@jwt_required()
def get_student_completed_projects():
    user_id = get_user_id_from_jwt()
    
    conn = sqlite3.connect('launchpad.db')
    cursor = conn.cursor()
    
    try:
        # Get completed projects with feedback
        cursor.execute('''
            SELECT pa.id, pa.feedback, pa.completed_at, pa.created_at as applied_at,
                   p.id as project_id, p.title, p.description, p.category, p.status,
                   u.name as alumni_name, u.email as alumni_email
            FROM project_applications pa
            JOIN projects p ON pa.project_id = p.id
            JOIN users u ON p.created_by = u.id
            WHERE pa.student_id = ? AND pa.is_completed = 1
            ORDER BY pa.completed_at DESC
        ''', (user_id,))
        
        completed_projects = []
        for row in cursor.fetchall():
            completed_projects.append({
                'application_id': row[0],
                'feedback': row[1],
                'completed_at': row[2],
                'applied_at': row[3],
                'project_id': row[4],
                'title': row[5],
                'description': row[6],
                'category': row[7],
                'status': row[8],
                'alumni_name': row[9],
                'alumni_email': row[10]
            })
        
        return jsonify(completed_projects), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# Check if student has applied to a project
@app.route('/api/projects/<int:project_id>/application-status', methods=['GET'])
@jwt_required()
def check_application_status(project_id):
    user_id = get_user_id_from_jwt()
    
    conn = sqlite3.connect('launchpad.db')
    cursor = conn.cursor()
    
    try:
        # Get all applications for this project by this student (grouped by position)
        cursor.execute('''
            SELECT id, position_id, status, created_at FROM project_applications 
            WHERE project_id = ? AND student_id = ?
        ''', (project_id, user_id))
        applications = cursor.fetchall()
        
        if applications:
            # Return applications grouped by position
            applications_by_position = {}
            
            # Get all positions for this project to handle old applications
            cursor.execute('SELECT id FROM project_positions WHERE project_id = ?', (project_id,))
            position_ids = [str(row[0]) for row in cursor.fetchall()]
            
            for app in applications:
                if app[1]:  # Has position_id
                    position_id = str(app[1])
                else:  # Old application without position_id - assign to all positions
                    # For backward compatibility, add this application to all positions
                    for pos_id in position_ids:
                        applications_by_position[pos_id] = {
                            'application_id': app[0],
                            'status': app[2],
                            'applied_at': app[3],
                            'is_legacy': True  # Flag to indicate this is an old application
                        }
                    continue
                
                applications_by_position[position_id] = {
                    'application_id': app[0],
                    'status': app[2],
                    'applied_at': app[3],
                    'is_legacy': False
                }
            
            return jsonify({
                'has_applied': True,
                'applications': applications_by_position
            }), 200
        else:
            return jsonify({'has_applied': False, 'applications': {}}), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

#Submit application        
@app.route('/api/project-applications', methods=['POST'])
@jwt_required()
def create_project_application():
    user_id = get_user_id_from_jwt()
    data = request.get_json()

    project_id = data.get('project_id')
    position_id = data.get('position_id')
    message = data.get('message', '')

    if not project_id:
        return jsonify({'error': 'Project ID is required'}), 400
    
    # Position ID is strongly recommended but not strictly required for backward compatibility
    if not position_id:
        print(f"WARNING: Application submitted without position_id for project {project_id}")
        # Check if project has positions - if so, require position_id
        cursor = sqlite3.connect('launchpad.db').cursor()
        cursor.execute('SELECT COUNT(*) FROM project_positions WHERE project_id = ? AND is_active = 1', (project_id,))
        active_positions = cursor.fetchone()[0]
        cursor.close()
        
        if active_positions > 0:
            return jsonify({'error': 'Position ID is required. Please select a specific position to apply for.'}), 400

    conn = sqlite3.connect('launchpad.db')
    cursor = conn.cursor()

    try:
        # Check if project exists
        cursor.execute('SELECT id FROM projects WHERE id = ?', (project_id,))
        project = cursor.fetchone()
        if not project:
            return jsonify({'error': 'Project not found'}), 404
        
        # Check if position exists and is active
        cursor.execute('SELECT id, is_active FROM project_positions WHERE id = ? AND project_id = ?', (position_id, project_id))
        position = cursor.fetchone()
        if not position:
            return jsonify({'error': 'Position not found'}), 404
        if not position[1]:
            return jsonify({'error': 'This position is no longer accepting applications'}), 400

        # Check if already applied to this specific position
        cursor.execute('''
            SELECT id FROM project_applications 
            WHERE project_id = ? AND student_id = ? AND position_id = ?
        ''', (project_id, user_id, position_id))
        existing_application = cursor.fetchone()
        if existing_application:
            return jsonify({'error': 'You have already applied to this position'}), 400

        # Insert application
        cursor.execute('''
            INSERT INTO project_applications (project_id, student_id, position_id, message, status, created_at)
            VALUES (?, ?, ?, ?, ?, datetime('now'))
        ''', (project_id, user_id, position_id, message, 'pending'))

        conn.commit()
        return jsonify({'message': 'Application submitted successfully', 'position_id': position_id}), 201

    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# Withdraw application (student)
@app.route('/api/project-applications/<int:project_id>', methods=['DELETE'])
@jwt_required()
def withdraw_application(project_id):
    user_id = get_user_id_from_jwt()
    
    conn = sqlite3.connect('launchpad.db')
    cursor = conn.cursor()
    
    try:
        # Find and delete the application
        cursor.execute('''
            DELETE FROM project_applications 
            WHERE project_id = ? AND student_id = ?
        ''', (project_id, user_id))
        
        if cursor.rowcount == 0:
            return jsonify({'error': 'Application not found'}), 404
        
        conn.commit()
        return jsonify({'message': 'Application withdrawn successfully'}), 200
        
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# Accept/Decline project application
@app.route('/api/project-applications/<int:application_id>/<action>', methods=['POST'])
@jwt_required()
def handle_project_application(application_id, action):
    user_id = get_user_id_from_jwt()
    
    if action not in ['accept', 'decline']:
        return jsonify({'error': 'Invalid action'}), 400
    
    conn = sqlite3.connect('launchpad.db')
    cursor = conn.cursor()
    
    try:
        # Check if user is an alumni and owns the project
        cursor.execute('''
            SELECT pa.id, p.created_by, u.role, pa.position_id, pa.status
            FROM project_applications pa
            JOIN projects p ON pa.project_id = p.id
            JOIN users u ON p.created_by = u.id
            WHERE pa.id = ?
        ''', (application_id,))
        
        application_data = cursor.fetchone()
        
        if not application_data:
            return jsonify({'error': 'Project application not found'}), 404
        
        if application_data[1] != user_id:
            return jsonify({'error': 'You can only handle applications for your own projects'}), 403
        
        if application_data[2] != 'alumni':
            return jsonify({'error': 'Only alumni can handle project applications'}), 403
        
        position_id = application_data[3]
        old_status = application_data[4]
        
        # Update application status
        new_status = 'accepted' if action == 'accept' else 'declined'
        cursor.execute('''
            UPDATE project_applications 
            SET status = ?
            WHERE id = ?
        ''', (new_status, application_id))
        
        # Update position filled_count if position exists
        if position_id:
            if action == 'accept' and old_status != 'accepted':
                # Increment filled_count
                cursor.execute('''
                    UPDATE project_positions 
                    SET filled_count = filled_count + 1
                    WHERE id = ?
                ''', (position_id,))
                
                # Check if position is now full and deactivate if needed
                cursor.execute('''
                    SELECT count, filled_count FROM project_positions WHERE id = ?
                ''', (position_id,))
                pos_data = cursor.fetchone()
                if pos_data and pos_data[1] >= pos_data[0]:
                    cursor.execute('''
                        UPDATE project_positions 
                        SET is_active = 0
                        WHERE id = ?
                    ''', (position_id,))
            
            elif action == 'decline' and old_status == 'accepted':
                # Decrement filled_count if previously accepted
                cursor.execute('''
                    UPDATE project_positions 
                    SET filled_count = filled_count - 1, is_active = 1
                    WHERE id = ?
                ''', (position_id,))
        
        conn.commit()
        return jsonify({'message': f'Project application {action}ed successfully'}), 200
        
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# Get alumni's projects
@app.route('/api/alumni/projects', methods=['GET'])
@jwt_required()
def get_alumni_projects():
    user_id = get_user_id_from_jwt()
    
    conn = sqlite3.connect('launchpad.db')
    cursor = conn.cursor()
    
    try:
        # Check if user is an alumni
        cursor.execute('SELECT role FROM users WHERE id = ?', (user_id,))
        user_role = cursor.fetchone()
        
        if not user_role or user_role[0] != 'alumni':
            return jsonify({'error': 'Only alumni can view their projects'}), 403
        
        # Get alumni's projects
        
        cursor.execute('''
            SELECT p.id, p.title, p.description, p.category, p.status, p.team_members, p.tags, p.created_at,
                   (SELECT COUNT(*) FROM project_applications WHERE project_id = p.id) as application_count
            FROM projects p
            WHERE p.created_by = ?
            ORDER BY p.created_at DESC
        ''', (user_id,))
        
        projects = []
        for row in cursor.fetchall():
            projects.append({
                'id': row[0],
                'title': row[1],
                'description': row[2],
                'category': row[3],
                'status': row[4],
                'team_members': json.loads(row[5]) if row[5] else [],
                'tags': json.loads(row[6]) if row[6] else [],
                'created_at': row[7],
                'application_count': row[8]
            })
        
        return jsonify(projects), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# Get alumni's blog posts
@app.route('/api/alumni/blog-posts', methods=['GET'])
@jwt_required()
def get_alumni_blog_posts():
    user_id = get_user_id_from_jwt()
    
    conn = sqlite3.connect('launchpad.db')
    cursor = conn.cursor()
    
    try:
        # Check if user is an alumni
        cursor.execute('SELECT role FROM users WHERE id = ?', (user_id,))
        user_role = cursor.fetchone()
        
        if not user_role or user_role[0] != 'alumni':
            return jsonify({'error': 'Only alumni can view their blog posts'}), 403
        
        # Get alumni's blog posts
        cursor.execute('''
            SELECT id, title, content, category, created_at, updated_at, images, pdfs
            FROM blog_posts
            WHERE author_id = ?
            ORDER BY created_at DESC
        ''', (user_id,))
        
        posts = []
        for row in cursor.fetchall():
            posts.append({
                'id': row[0],
                'title': row[1],
                'content': row[2],
                'category': row[3],
                'created_at': row[4],
                'updated_at': row[5],
                'images': json.loads(row[6]) if row[6] else [],
                'pdfs': json.loads(row[7]) if row[7] else []
            })
        
        return jsonify(posts), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# Messaging endpoints
@app.route('/api/messages/conversations', methods=['GET'])
@jwt_required()
def get_conversations():
    try:
        user_id = get_user_id_from_jwt()
        conn = sqlite3.connect('launchpad.db')
        cursor = conn.cursor()
        
        # Get all conversations for the user
        cursor.execute('''
            SELECT DISTINCT 
                CASE 
                    WHEN user1_id = ? THEN user2_id 
                    ELSE user1_id 
                END as other_user_id,
                u.name as other_user_name,
                u.email as other_user_email,
                u.role as other_user_role,
                u.avatar as other_user_avatar
            FROM conversations c
            JOIN users u ON u.id = CASE 
                WHEN c.user1_id = ? THEN c.user2_id 
                ELSE c.user1_id 
            END
            WHERE c.user1_id = ? OR c.user2_id = ?
            ORDER BY c.updated_at DESC
        ''', (user_id, user_id, user_id, user_id))
        
        conversations = []
        for row in cursor.fetchall():
            other_user_id = row[0]
            other_user_name = row[1]
            other_user_email = row[2]
            other_user_role = row[3]
            other_user_avatar = row[4]
            
            # Get last message and unread count
            cursor.execute('''
                SELECT content, created_at, is_read
                FROM messages
                WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
                ORDER BY created_at DESC
                LIMIT 1
            ''', (user_id, other_user_id, other_user_id, user_id))
            
            last_message_data = cursor.fetchone()
            last_message = last_message_data[0] if last_message_data else None
            last_message_time = last_message_data[1] if last_message_data else None
            
            # Count unread messages
            cursor.execute('''
                SELECT COUNT(*) FROM messages
                WHERE sender_id = ? AND receiver_id = ? AND is_read = 0
            ''', (other_user_id, user_id))
            unread_count = cursor.fetchone()[0]
            
            # Get the actual conversation ID from database
            cursor.execute('''
                SELECT id FROM conversations
                WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)
            ''', (user_id, other_user_id, other_user_id, user_id))
            conversation_data = cursor.fetchone()
            conversation_id = conversation_data[0] if conversation_data else None
            
            conversations.append({
                'id': conversation_id,
                'other_user_id': other_user_id,
                'other_user_name': other_user_name,
                'other_user_email': other_user_email,
                'other_user_role': other_user_role,
                'other_user_avatar': other_user_avatar,
                'last_message': last_message,
                'last_message_time': last_message_time,
                'unread_count': unread_count,
                'is_online': False  # TODO: Implement online status
            })
        
        return jsonify(conversations), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/messages/conversations', methods=['POST'])
@jwt_required()
def create_conversation():
    try:
        user_id = get_user_id_from_jwt()
        data = request.get_json()
        other_user_id = data.get('other_user_id')
        
        if not other_user_id:
            return jsonify({'error': 'other_user_id is required'}), 400
        
        conn = sqlite3.connect('launchpad.db')
        cursor = conn.cursor()
        
        # Check if conversation already exists
        cursor.execute('''
            SELECT id FROM conversations
            WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)
        ''', (user_id, other_user_id, other_user_id, user_id))
        
        existing = cursor.fetchone()
        if existing:
            return jsonify({'id': existing[0]}), 200
        
        # Create new conversation
        cursor.execute('''
            INSERT INTO conversations (user1_id, user2_id, created_at, updated_at)
            VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ''', (min(user_id, other_user_id), max(user_id, other_user_id)))
        
        conversation_id = cursor.lastrowid
        conn.commit()
        
        return jsonify({'id': conversation_id}), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/messages/conversations/<int:conversation_id>', methods=['GET'])
@jwt_required()
def get_conversation(conversation_id):
    try:
        user_id = get_user_id_from_jwt()
        conn = sqlite3.connect('launchpad.db')
        cursor = conn.cursor()
        
        # Get conversation details
        cursor.execute('''
            SELECT user1_id, user2_id FROM conversations WHERE id = ?
        ''', (conversation_id,))
        
        conversation = cursor.fetchone()
        if not conversation:
            return jsonify({'error': 'Conversation not found'}), 404
        
        # Check if user is part of this conversation
        if user_id not in [conversation[0], conversation[1]]:
            return jsonify({'error': 'Access denied'}), 403
        
        # Get other user details
        other_user_id = conversation[1] if conversation[0] == user_id else conversation[0]
        cursor.execute('''
            SELECT id, name, email, role, department, graduation_year
            FROM users WHERE id = ?
        ''', (other_user_id,))
        
        other_user_data = cursor.fetchone()
        if not other_user_data:
            return jsonify({'error': 'User not found'}), 404
        
        other_user = {
            'id': other_user_data[0],
            'name': other_user_data[1],
            'email': other_user_data[2],
            'role': other_user_data[3],
            'department': other_user_data[4],
            'graduation_year': other_user_data[5],
            'is_online': False  # TODO: Implement online status
        }
        
        return jsonify({'other_user': other_user}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/messages/conversations/<int:conversation_id>/messages', methods=['GET'])
@jwt_required()
def get_messages(conversation_id):
    try:
        user_id = get_user_id_from_jwt()
        conn = sqlite3.connect('launchpad.db')
        cursor = conn.cursor()
        
        # Verify user is part of conversation
        cursor.execute('''
            SELECT user1_id, user2_id FROM conversations WHERE id = ?
        ''', (conversation_id,))
        
        conversation = cursor.fetchone()
        if not conversation or user_id not in [conversation[0], conversation[1]]:
            return jsonify({'error': 'Access denied'}), 403
        
        # Get messages
        cursor.execute('''
            SELECT id, sender_id, receiver_id, content, created_at, is_read
            FROM messages
            WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
            ORDER BY created_at ASC
        ''', (conversation[0], conversation[1], conversation[1], conversation[0]))
        
        messages = []
        for row in cursor.fetchall():
            messages.append({
                'id': row[0],
                'sender_id': row[1],
                'receiver_id': row[2],
                'content': row[3],
                'created_at': row[4],
                'is_read': bool(row[5])
            })
        
        # Mark messages as read
        cursor.execute('''
            UPDATE messages SET is_read = 1
            WHERE receiver_id = ? AND is_read = 0
        ''', (user_id,))
        conn.commit()
        
        return jsonify(messages), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/messages/conversations/<int:conversation_id>/messages', methods=['POST'])
@jwt_required()
def send_message(conversation_id):
    try:
        user_id = get_user_id_from_jwt()
        data = request.get_json()
        content = data.get('content')
        
        if not content:
            return jsonify({'error': 'Message content is required'}), 400
        
        conn = sqlite3.connect('launchpad.db')
        cursor = conn.cursor()
        
        # Verify user is part of conversation
        cursor.execute('''
            SELECT user1_id, user2_id FROM conversations WHERE id = ?
        ''', (conversation_id,))
        
        conversation = cursor.fetchone()
        if not conversation or user_id not in [conversation[0], conversation[1]]:
            return jsonify({'error': 'Access denied'}), 403
        
        # Determine receiver
        receiver_id = conversation[1] if conversation[0] == user_id else conversation[0]
        
        # Insert message
        cursor.execute('''
            INSERT INTO messages (sender_id, receiver_id, content, created_at, is_read)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP, 0)
        ''', (user_id, receiver_id, content))
        
        message_id = cursor.lastrowid
        
        # Update conversation timestamp
        cursor.execute('''
            UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?
        ''', (conversation_id,))
        
        conn.commit()
        
        # Return the new message
        cursor.execute('''
            SELECT id, sender_id, receiver_id, content, created_at, is_read
            FROM messages WHERE id = ?
        ''', (message_id,))
        
        message_data = cursor.fetchone()
        message = {
            'id': message_data[0],
            'sender_id': message_data[1],
            'receiver_id': message_data[2],
            'content': message_data[3],
            'created_at': message_data[4],
            'is_read': bool(message_data[5])
        }
        
        return jsonify(message), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/messages/available-users', methods=['GET'])
@jwt_required()
def get_available_users():
    try:
        user_id = get_user_id_from_jwt()
        conn = sqlite3.connect('launchpad.db')
        cursor = conn.cursor()
        
        # Return all other users regardless of role
        cursor.execute('''
            SELECT id, name, email, role, department, graduation_year, 
                   current_company, current_position, location, bio, 
                   linkedin, github, website, hall, branch, avatar
            FROM users
            WHERE id != ?
            ORDER BY name
        ''', (user_id,))
        
        users = []
        for row in cursor.fetchall():
            users.append({
                'id': row[0],
                'name': row[1],
                'email': row[2],
                'role': row[3],
                'department': row[4],
                'graduation_year': row[5],
                'current_company': row[6],
                'current_position': row[7],
                'location': row[8],
                'bio': row[9],
                'linkedin': row[10],
                'github': row[11],
                'website': row[12],
                'hall': row[13],
                'branch': row[14],
                'avatar': row[15]
            })
        
        return jsonify(users), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# Blog likes endpoints
@app.route('/api/blog/<int:post_id>/like', methods=['POST'])
@jwt_required()
def toggle_blog_like(post_id):
    try:
        user_id = get_user_id_from_jwt()
        conn = sqlite3.connect('launchpad.db')
        cursor = conn.cursor()
        
        # Check if user has already liked this post
        cursor.execute('SELECT id FROM blog_likes WHERE blog_post_id = ? AND user_id = ?', (post_id, user_id))
        existing_like = cursor.fetchone()
        
        if existing_like:
            # Unlike the post
            cursor.execute('DELETE FROM blog_likes WHERE blog_post_id = ? AND user_id = ?', (post_id, user_id))
            action = 'unliked'
        else:
            # Like the post
            cursor.execute('INSERT INTO blog_likes (blog_post_id, user_id) VALUES (?, ?)', (post_id, user_id))
            action = 'liked'
        
        # Get updated likes count
        cursor.execute('SELECT COUNT(*) FROM blog_likes WHERE blog_post_id = ?', (post_id,))
        likes_count = cursor.fetchone()[0]
        
        conn.commit()
        
        return jsonify({
            'action': action,
            'likes_count': likes_count,
            'is_liked': action == 'liked'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# Profile picture upload endpoint
@app.route('/api/profile/upload-picture', methods=['POST'])
@jwt_required()
def upload_profile_picture():
    try:
        user_id = get_user_id_from_jwt()
        
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if file:
            # Generate unique filename
            filename = secure_filename(file.filename)
            file_extension = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
            
            if file_extension not in ['jpg', 'jpeg', 'png', 'gif']:
                return jsonify({'error': 'Invalid file type. Only JPG, PNG, and GIF are allowed.'}), 400
            
            unique_filename = f"{user_id}_{uuid.uuid4().hex}.{file_extension}"
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
            file.save(file_path)
            
            # Update user's avatar in database
            conn = sqlite3.connect('launchpad.db')
            cursor = conn.cursor()
            
            cursor.execute('UPDATE users SET avatar = ? WHERE id = ?', (unique_filename, user_id))
            conn.commit()
            conn.close()
            
            return jsonify({
                'message': 'Profile picture uploaded successfully',
                'filename': unique_filename,
                'url': f'/api/profile/picture/{unique_filename}'
            }), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Serve profile pictures
@app.route('/api/profile/picture/<filename>')
def get_profile_picture(filename):
    try:
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    except Exception as e:
        return jsonify({'error': 'File not found'}), 404

# Upload a blog image (append to images array)
@app.route('/api/blog/<int:post_id>/images', methods=['POST'])
@jwt_required()
def upload_blog_image(post_id):
    user_id = get_user_id_from_jwt()
    try:
        conn = sqlite3.connect('launchpad.db')
        cursor = conn.cursor()
        cursor.execute('SELECT author_id, images FROM blog_posts WHERE id = ?', (post_id,))
        row = cursor.fetchone()
        if not row:
            return jsonify({'error': 'Blog post not found'}), 404
        author_id, current_images = row[0], row[1]
        if author_id != user_id:
            return jsonify({'error': 'Only the author can upload images'}), 403
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        filename = secure_filename(file.filename)
        ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
        if ext not in ['jpg', 'jpeg', 'png', 'gif']:
            return jsonify({'error': 'Invalid file type. Only JPG, PNG, and GIF are allowed.'}), 400
        unique_filename = f"img_{uuid.uuid4().hex}.{ext}"
        folder = os.path.join(app.config['UPLOAD_FOLDER'], 'blogs', str(post_id), 'images')
        os.makedirs(folder, exist_ok=True)
        filepath = os.path.join(folder, unique_filename)
        file.save(filepath)
        images = json.loads(current_images) if current_images else []
        file_url = f"/api/blog/{post_id}/images/{unique_filename}"
        images.append(file_url)
        cursor.execute('UPDATE blog_posts SET images = ? WHERE id = ?', (json.dumps(images), post_id))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Image uploaded', 'url': file_url, 'images': images}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Serve blog images
@app.route('/api/blog/<int:post_id>/images/<filename>')
def get_blog_image(post_id, filename):
    try:
        return send_from_directory(os.path.join(app.config['UPLOAD_FOLDER'], 'blogs', str(post_id), 'images'), filename)
    except Exception:
        return jsonify({'error': 'File not found'}), 404

# Upload a blog PDF (append to pdfs array)
@app.route('/api/blog/<int:post_id>/pdfs', methods=['POST'])
@jwt_required()
def upload_blog_pdf(post_id):
    user_id = get_user_id_from_jwt()
    try:
        conn = sqlite3.connect('launchpad.db')
        cursor = conn.cursor()
        cursor.execute('SELECT author_id, pdfs FROM blog_posts WHERE id = ?', (post_id,))
        row = cursor.fetchone()
        if not row:
            return jsonify({'error': 'Blog post not found'}), 404
        author_id, current_pdfs = row[0], row[1]
        if author_id != user_id:
            return jsonify({'error': 'Only the author can upload PDFs'}), 403
        if 'pdf' not in request.files:
            return jsonify({'error': 'No PDF file provided'}), 400
        file = request.files['pdf']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        if not file.filename.lower().endswith('.pdf'):
            return jsonify({'error': 'Only PDF files are allowed'}), 400
        unique_filename = f"pdf_{uuid.uuid4().hex}.pdf"
        folder = os.path.join(app.config['UPLOAD_FOLDER'], 'blogs', str(post_id), 'pdfs')
        os.makedirs(folder, exist_ok=True)
        filepath = os.path.join(folder, unique_filename)
        file.save(filepath)
        pdfs = json.loads(current_pdfs) if current_pdfs else []
        file_url = f"/api/blog/{post_id}/pdfs/{unique_filename}"
        pdfs.append(file_url)
        cursor.execute('UPDATE blog_posts SET pdfs = ? WHERE id = ?', (json.dumps(pdfs), post_id))
        conn.commit()
        conn.close()
        return jsonify({'message': 'PDF uploaded', 'url': file_url, 'pdfs': pdfs}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Serve blog PDFs
@app.route('/api/blog/<int:post_id>/pdfs/<filename>')
def get_blog_pdf(post_id, filename):
    try:
        return send_from_directory(os.path.join(app.config['UPLOAD_FOLDER'], 'blogs', str(post_id), 'pdfs'), filename)
    except Exception:
        return jsonify({'error': 'File not found'}), 404
# Upload CV endpoint
@app.route('/api/profile/cv', methods=['POST'])
@jwt_required()
def upload_cv():
    user_id = get_user_id_from_jwt()
    
    if 'cv' not in request.files:
        return jsonify({'error': 'No CV file provided'}), 400
    
    file = request.files['cv']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    # Check if file is PDF
    if not file.filename.lower().endswith('.pdf'):
        return jsonify({'error': 'Only PDF files are allowed'}), 400
    
    try:
        # Generate unique filename
        filename = f"cv_{user_id}_{uuid.uuid4().hex}.pdf"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Update user's CV in database
        conn = sqlite3.connect('launchpad.db')
        cursor = conn.cursor()
        
        # Get old CV filename to delete it
        cursor.execute('SELECT cv_pdf FROM users WHERE id = ?', (user_id,))
        result = cursor.fetchone()
        old_cv = result[0] if result else None
        
        # Update with new CV
        cursor.execute('UPDATE users SET cv_pdf = ? WHERE id = ?', (filename, user_id))
        conn.commit()
        conn.close()
        
        # Delete old CV file if it exists
        if old_cv:
            old_filepath = os.path.join(app.config['UPLOAD_FOLDER'], old_cv)
            if os.path.exists(old_filepath):
                os.remove(old_filepath)
        
        return jsonify({
            'message': 'CV uploaded successfully',
            'cv_url': f'/api/profile/cv/{filename}'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Serve CV files
@app.route('/api/profile/cv/<filename>')
def get_cv(filename):
    try:
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    except Exception as e:
        return jsonify({'error': 'File not found'}), 404

# Delete CV endpoint
@app.route('/api/profile/cv', methods=['DELETE'])
@jwt_required()
def delete_cv():
    user_id = get_user_id_from_jwt()
    
    try:
        conn = sqlite3.connect('launchpad.db')
        cursor = conn.cursor()
        
        # Get CV filename
        cursor.execute('SELECT cv_pdf FROM users WHERE id = ?', (user_id,))
        result = cursor.fetchone()
        cv_filename = result[0] if result else None
        
        if cv_filename:
            # Delete file
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], cv_filename)
            if os.path.exists(filepath):
                os.remove(filepath)
            
            # Update database
            cursor.execute('UPDATE users SET cv_pdf = NULL WHERE id = ?', (user_id,))
            conn.commit()
        
        conn.close()
        return jsonify({'message': 'CV deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Upload a project image (append to images array)
@app.route('/api/projects/<int:project_id>/images', methods=['POST'])
@jwt_required()
def upload_project_image(project_id):
    user_id = get_user_id_from_jwt()
    
    try:
        conn = sqlite3.connect('launchpad.db')
        cursor = conn.cursor()
        
        # Check if user is project creator
        cursor.execute('SELECT created_by FROM projects WHERE id = ?', (project_id,))
        row = cursor.fetchone()
        if not row:
            return jsonify({'error': 'Project not found'}), 404
        creator_id = row[0]
        
        if creator_id != user_id:
            return jsonify({'error': 'Only project creator can upload images'}), 403
        
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Validate extension
        filename = secure_filename(file.filename)
        ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
        if ext not in ['jpg', 'jpeg', 'png', 'gif']:
            return jsonify({'error': 'Invalid file type. Only JPG, PNG, and GIF are allowed.'}), 400

        # Save to per-project images folder
        unique_filename = f"img_{uuid.uuid4().hex}.{ext}"
        folder = os.path.join(app.config['UPLOAD_FOLDER'], 'projects', str(project_id), 'images')
        os.makedirs(folder, exist_ok=True)
        filepath = os.path.join(folder, unique_filename)
        file.save(filepath)

        # Append to images array
        cursor.execute('SELECT images FROM projects WHERE id = ?', (project_id,))
        current = cursor.fetchone()[0]
        images = json.loads(current) if current else []
        file_url = f"/api/projects/{project_id}/images/{unique_filename}"
        images.append(file_url)
        cursor.execute('UPDATE projects SET images = ? WHERE id = ?', (json.dumps(images), project_id))
        conn.commit()
        conn.close()

        return jsonify({'message': 'Image uploaded', 'url': file_url, 'images': images}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Serve project images
@app.route('/api/projects/<int:project_id>/images/<filename>')
def get_project_image(project_id, filename):
    try:
        return send_from_directory(os.path.join(app.config['UPLOAD_FOLDER'], 'projects', str(project_id), 'images'), filename)
    except Exception as e:
        return jsonify({'error': 'File not found'}), 404

# Upload project JD PDF (set/replace)
@app.route('/api/projects/<int:project_id>/jd', methods=['POST'])
@jwt_required()
def upload_project_jd(project_id):
    user_id = get_user_id_from_jwt()
    
    try:
        conn = sqlite3.connect('launchpad.db')
        cursor = conn.cursor()
        
        # Check if user is project creator
        cursor.execute('SELECT created_by, jd_pdf FROM projects WHERE id = ?', (project_id,))
        row = cursor.fetchone()
        if not row:
            return jsonify({'error': 'Project not found'}), 404
        creator_id, existing_jd = row[0], row[1]
        
        if creator_id != user_id:
            return jsonify({'error': 'Only project creator can upload JD'}), 403
        
        if 'jd_pdf' not in request.files:
            return jsonify({'error': 'No JD file provided'}), 400
        
        file = request.files['jd_pdf']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Validate PDF
        if not file.filename.lower().endswith('.pdf'):
            return jsonify({'error': 'Only PDF files are allowed'}), 400

        # Save to per-project jd folder
        unique_filename = f"jd_{uuid.uuid4().hex}.pdf"
        folder = os.path.join(app.config['UPLOAD_FOLDER'], 'projects', str(project_id), 'jd')
        os.makedirs(folder, exist_ok=True)
        filepath = os.path.join(folder, unique_filename)
        file.save(filepath)

        # Update jd_pdf URL
        jd_url = f"/api/projects/{project_id}/jd/{unique_filename}"
        cursor.execute('UPDATE projects SET jd_pdf = ? WHERE id = ?', (jd_url, project_id))
        conn.commit()
        conn.close()

        return jsonify({'message': 'JD uploaded', 'jd_pdf': jd_url}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Serve project JD files
@app.route('/api/projects/<int:project_id>/jd/<filename>')
def get_project_jd(project_id, filename):
    try:
        return send_from_directory(os.path.join(app.config['UPLOAD_FOLDER'], 'projects', str(project_id), 'jd'), filename)
    except Exception as e:
        return jsonify({'error': 'File not found'}), 404

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5001)
