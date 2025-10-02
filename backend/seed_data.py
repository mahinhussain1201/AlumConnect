import sqlite3
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta
import json
import random

def seed_database():
    conn = sqlite3.connect('launchpad.db')
    cursor = conn.cursor()
    
    # Clear existing data
    cursor.execute('DELETE FROM project_applications')
    cursor.execute('DELETE FROM conversations')
    cursor.execute('DELETE FROM messages')
    cursor.execute('DELETE FROM blog_likes')
    cursor.execute('DELETE FROM user_skills')
    cursor.execute('DELETE FROM user_achievements')
    cursor.execute('DELETE FROM user_languages')
    cursor.execute('DELETE FROM mentorship_requests')
    cursor.execute('DELETE FROM blog_posts')
    cursor.execute('DELETE FROM projects')
    cursor.execute('DELETE FROM users')
    
    # ----------------- Users -----------------
    users = [
        {'name': 'Dr. Rajesh Kumar', 'email': 'rajesh.kumar@iitkgp.ac.in', 'password': 'password123', 'role': 'alumni', 'graduation_year': 2010, 'department': 'Computer Science and Engineering'},
        {'name': 'Priya Sharma', 'email': 'priya.sharma@iitkgp.ac.in', 'password': 'password123', 'role': 'alumni', 'graduation_year': 2012, 'department': 'Electrical Engineering'},
        {'name': 'Amit Singh', 'email': 'amit.singh@iitkgp.ac.in', 'password': 'password123', 'role': 'alumni', 'graduation_year': 2015, 'department': 'Mechanical Engineering'},
        {'name': 'Sneha Reddy', 'email': 'sneha.reddy@iitkgp.ac.in', 'password': 'password123', 'role': 'student', 'graduation_year': None, 'department': 'Computer Science and Engineering'},
        {'name': 'Karan Malhotra', 'email': 'karan.malhotra@iitkgp.ac.in', 'password': 'password123', 'role': 'student', 'graduation_year': None, 'department': 'Electrical Engineering'},
        {'name': 'Neha Gupta', 'email': 'neha.gupta@iitkgp.ac.in', 'password': 'password123', 'role': 'student', 'graduation_year': None, 'department': 'Biotechnology'}
    ]
    
    user_ids = {}
    for user in users:
        password_hash = generate_password_hash(user['password'])
        cursor.execute('''
            INSERT INTO users (name, email, password_hash, role, graduation_year, department)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (user['name'], user['email'], password_hash, user['role'], user['graduation_year'], user['department']))
        user_ids[user['email']] = cursor.lastrowid

    # ----------------- Projects -----------------
    projects = [
        {'title': 'AI-Powered Healthcare Diagnostics', 'description': 'ML platform for early disease detection using medical imaging.', 'category': 'Healthcare AI', 'status': 'active', 'team_members': json.dumps(['Dr. Rajesh Kumar','Priya Sharma','Amit Singh']), 'tags': json.dumps(['AI/ML','Healthcare','Computer Vision','Deep Learning']), 'created_by': user_ids['rajesh.kumar@iitkgp.ac.in']},
        {'title': 'Sustainable Energy Management System', 'description': 'Smart grid optimization for renewable energy.', 'category': 'Clean Tech', 'status': 'active', 'team_members': json.dumps(['Priya Sharma','Amit Singh']), 'tags': json.dumps(['IoT','Sustainability','Energy','Smart Grid']), 'created_by': user_ids['priya.sharma@iitkgp.ac.in']},
        {'title': 'EdTech Learning Platform', 'description': 'Adaptive AI learning paths for K-12 education.', 'category': 'Education', 'status': 'completed', 'team_members': json.dumps(['Amit Singh','Sneha Reddy']), 'tags': json.dumps(['EdTech','AI','Education','Personalization']), 'created_by': user_ids['amit.singh@iitkgp.ac.in']},
        {'title': 'Blockchain Supply Chain Tracker', 'description': 'Blockchain-based secure supply chain.', 'category': 'FinTech', 'status': 'active', 'team_members': json.dumps(['Dr. Rajesh Kumar','Karan Malhotra']), 'tags': json.dumps(['Blockchain','Supply Chain','Transparency','Security']), 'created_by': user_ids['rajesh.kumar@iitkgp.ac.in']},
        {'title': 'Smart Agriculture Monitoring', 'description': 'IoT-based monitoring for crop and soil health.', 'category': 'AgriTech', 'status': 'active', 'team_members': json.dumps(['Neha Gupta','Sneha Reddy']), 'tags': json.dumps(['IoT','Agriculture','Monitoring','Data Analytics']), 'created_by': user_ids['neha.gupta@iitkgp.ac.in']}
    ]
    
    project_ids = {}
    for project in projects:
        cursor.execute('''
            INSERT INTO projects (title, description, category, status, team_members, tags, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (project['title'], project['description'], project['category'], project['status'], project['team_members'], project['tags'], project['created_by']))
        project_ids[project['title']] = cursor.lastrowid

    # ----------------- Blog Posts -----------------
    blog_posts = [
        {'title': 'From IIT KGP to Building a $50M Startup', 'content': 'Story of student project to startup journey...', 'category': 'Career', 'author_id': user_ids['rajesh.kumar@iitkgp.ac.in']},
        {'title': 'How IIT KGP Shaped My Vision for Sustainable Technology', 'content': 'Experience shaping sustainable tech...', 'category': 'Startup', 'author_id': user_ids['priya.sharma@iitkgp.ac.in']},
        {'title': 'Transforming Healthcare with AI', 'content': 'ML project evolving to global healthcare AI platform...', 'category': 'Technology', 'author_id': user_ids['amit.singh@iitkgp.ac.in']},
        {'title': 'The Future of Work: How AI is Changing the Job Market', 'content': 'AI impact on job market and skills...', 'category': 'Career', 'author_id': user_ids['rajesh.kumar@iitkgp.ac.in']}
    ]
    
    for post in blog_posts:
        cursor.execute('''
            INSERT INTO blog_posts (title, content, category, author_id)
            VALUES (?, ?, ?, ?)
        ''', (post['title'], post['content'], post['category'], post['author_id']))

    # ----------------- Mentorship Requests -----------------
    mentorship_requests = [
        {'student_id': user_ids['sneha.reddy@iitkgp.ac.in'], 'alumni_id': user_ids['rajesh.kumar@iitkgp.ac.in'], 'message': 'Interested in AI healthcare mentorship', 'status': 'pending'},
        {'student_id': user_ids['karan.malhotra@iitkgp.ac.in'], 'alumni_id': user_ids['priya.sharma@iitkgp.ac.in'], 'message': 'Need guidance on renewable energy projects', 'status': 'accepted'},
        {'student_id': user_ids['neha.gupta@iitkgp.ac.in'], 'alumni_id': user_ids['amit.singh@iitkgp.ac.in'], 'message': 'Interested in entrepreneurship guidance', 'status': 'pending'}
    ]
    
    for req in mentorship_requests:
        cursor.execute('''
            INSERT INTO mentorship_requests (student_id, alumni_id, message, status)
            VALUES (?, ?, ?, ?)
        ''', (req['student_id'], req['alumni_id'], req['message'], req['status']))

    # ----------------- Project Applications -----------------
    for project in project_ids.values():
        for student_email in ['sneha.reddy@iitkgp.ac.in','karan.malhotra@iitkgp.ac.in','neha.gupta@iitkgp.ac.in']:
            cursor.execute('''
                INSERT INTO project_applications (student_id, project_id, message, status)
                VALUES (?, ?, ?, ?)
            ''', (user_ids[student_email], project, f'Interested in joining project {project}', random.choice(['pending','accepted','declined'])))

    # ----------------- Conversations & Messages -----------------
    pairs = [('sneha.reddy@iitkgp.ac.in','rajesh.kumar@iitkgp.ac.in'), ('karan.malhotra@iitkgp.ac.in','priya.sharma@iitkgp.ac.in')]
    for u1, u2 in pairs:
        cursor.execute('''
            INSERT INTO conversations (user1_id, user2_id)
            VALUES (?, ?)
        ''', (user_ids[u1], user_ids[u2]))
        conv_id = cursor.lastrowid
        # Add messages
        for i in range(3):
            sender, receiver = (user_ids[u1], user_ids[u2]) if i%2==0 else (user_ids[u2], user_ids[u1])
            cursor.execute('''
                INSERT INTO messages (sender_id, receiver_id, content)
                VALUES (?, ?, ?)
            ''', (sender, receiver, f"Sample message {i+1} in conversation {conv_id}"))

    # ----------------- Blog Likes -----------------
    for post in blog_posts:
        for student_email in ['sneha.reddy@iitkgp.ac.in','karan.malhotra@iitkgp.ac.in']:
            cursor.execute('''
                INSERT OR IGNORE INTO blog_likes (blog_post_id, user_id)
                VALUES (?, ?)
            ''', (cursor.lastrowid, user_ids[student_email]))

    # ----------------- User Skills -----------------
    skills = ['Python','Machine Learning','Data Analysis','Leadership','Communication']
    for user_email in user_ids:
        for skill in random.sample(skills, 3):
            cursor.execute('''
                INSERT INTO user_skills (user_id, skill_name, skill_type, proficiency_level)
                VALUES (?, ?, ?, ?)
            ''', (user_ids[user_email], skill, 'technical', random.choice(['beginner','intermediate','advanced','expert'])))

    # ----------------- User Achievements -----------------
    achievements = ['Award','Certification','Project','Publication','Other']
    for user_email in user_ids:
        for ach in random.sample(achievements, 2):
            cursor.execute('''
                INSERT INTO user_achievements (user_id, title, achievement_type, date_earned, issuer)
                VALUES (?, ?, ?, ?, ?)
            ''', (user_ids[user_email], f'{ach} Title', ach.lower(), datetime.now().date(), 'IIT KGP'))

    # ----------------- User Languages -----------------
    languages = ['English','Hindi','Spanish','French']
    for user_email in user_ids:
        for lang in random.sample(languages, 2):
            cursor.execute('''
                INSERT INTO user_languages (user_id, language_name, proficiency_level)
                VALUES (?, ?, ?)
            ''', (user_ids[user_email], lang, random.choice(['beginner','intermediate','advanced','native'])))
    
    conn.commit()
    conn.close()
    print("Database seeded successfully!")

if __name__ == '__main__':
    seed_database()
