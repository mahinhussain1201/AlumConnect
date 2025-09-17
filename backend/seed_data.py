import sqlite3
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta
import json

def seed_database():
    conn = sqlite3.connect('launchpad.db')
    cursor = conn.cursor()
    
    # Clear existing data
    cursor.execute('DELETE FROM mentorship_requests')
    cursor.execute('DELETE FROM blog_posts')
    cursor.execute('DELETE FROM projects')
    cursor.execute('DELETE FROM users')
    
    # Insert sample users
    users = [
        {
            'name': 'Dr. Rajesh Kumar',
            'email': 'rajesh.kumar@iitkgp.ac.in',
            'password': 'password123',
            'role': 'alumni',
            'graduation_year': 2010,
            'department': 'Computer Science and Engineering'
        },
        {
            'name': 'Priya Sharma',
            'email': 'priya.sharma@iitkgp.ac.in',
            'password': 'password123',
            'role': 'alumni',
            'graduation_year': 2012,
            'department': 'Electrical Engineering'
        },
        {
            'name': 'Amit Singh',
            'email': 'amit.singh@iitkgp.ac.in',
            'password': 'password123',
            'role': 'alumni',
            'graduation_year': 2015,
            'department': 'Mechanical Engineering'
        },
        {
            'name': 'Sneha Reddy',
            'email': 'sneha.reddy@iitkgp.ac.in',
            'password': 'password123',
            'role': 'student',
            'graduation_year': None,
            'department': 'Computer Science and Engineering'
        },
        {
            'name': 'Karan Malhotra',
            'email': 'karan.malhotra@iitkgp.ac.in',
            'password': 'password123',
            'role': 'student',
            'graduation_year': None,
            'department': 'Electrical Engineering'
        },
        {
            'name': 'Neha Gupta',
            'email': 'neha.gupta@iitkgp.ac.in',
            'password': 'password123',
            'role': 'student',
            'graduation_year': None,
            'department': 'Biotechnology'
        }
    ]
    
    user_ids = {}
    for user in users:
        password_hash = generate_password_hash(user['password'])
        cursor.execute('''
            INSERT INTO users (name, email, password_hash, role, graduation_year, department)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            user['name'],
            user['email'],
            password_hash,
            user['role'],
            user['graduation_year'],
            user['department']
        ))
        user_ids[user['email']] = cursor.lastrowid
    
    # Insert sample projects
    projects = [
        {
            'title': 'AI-Powered Healthcare Diagnostics',
            'description': 'Revolutionary machine learning platform for early disease detection using medical imaging. This project combines computer vision with deep learning to analyze X-rays, CT scans, and MRIs to identify potential health issues before they become critical.',
            'category': 'Healthcare AI',
            'status': 'active',
            'team_members': json.dumps(['Dr. Rajesh Kumar', 'Priya Sharma', 'Amit Singh']),
            'tags': json.dumps(['AI/ML', 'Healthcare', 'Computer Vision', 'Deep Learning']),
            'created_by': user_ids['rajesh.kumar@iitkgp.ac.in']
        },
        {
            'title': 'Sustainable Energy Management System',
            'description': 'Smart grid optimization system for renewable energy distribution in rural areas. The system uses IoT sensors and machine learning algorithms to optimize energy distribution and reduce waste.',
            'category': 'Clean Tech',
            'status': 'active',
            'team_members': json.dumps(['Priya Sharma', 'Amit Singh']),
            'tags': json.dumps(['IoT', 'Sustainability', 'Energy', 'Smart Grid']),
            'created_by': user_ids['priya.sharma@iitkgp.ac.in']
        },
        {
            'title': 'EdTech Learning Platform',
            'description': 'Personalized learning experience with adaptive algorithms for K-12 education. The platform uses AI to create customized learning paths for each student based on their learning style and pace.',
            'category': 'Education',
            'status': 'completed',
            'team_members': json.dumps(['Amit Singh', 'Sneha Reddy']),
            'tags': json.dumps(['EdTech', 'AI', 'Education', 'Personalization']),
            'created_by': user_ids['amit.singh@iitkgp.ac.in']
        },
        {
            'title': 'Blockchain Supply Chain Tracker',
            'description': 'Transparent and secure supply chain tracking system using blockchain technology. This system ensures product authenticity and provides complete traceability from manufacturer to consumer.',
            'category': 'FinTech',
            'status': 'active',
            'team_members': json.dumps(['Dr. Rajesh Kumar', 'Karan Malhotra']),
            'tags': json.dumps(['Blockchain', 'Supply Chain', 'Transparency', 'Security']),
            'created_by': user_ids['rajesh.kumar@iitkgp.ac.in']
        },
        {
            'title': 'Smart Agriculture Monitoring',
            'description': 'IoT-based system for monitoring soil conditions, weather patterns, and crop health. The system provides real-time data to farmers for optimal crop management and yield optimization.',
            'category': 'AgriTech',
            'status': 'active',
            'team_members': json.dumps(['Neha Gupta', 'Sneha Reddy']),
            'tags': json.dumps(['IoT', 'Agriculture', 'Monitoring', 'Data Analytics']),
            'created_by': user_ids['neha.gupta@iitkgp.ac.in']
        }
    ]
    
    project_ids = {}
    for project in projects:
        cursor.execute('''
            INSERT INTO projects (title, description, category, status, team_members, tags, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            project['title'],
            project['description'],
            project['category'],
            project['status'],
            project['team_members'],
            project['tags'],
            project['created_by']
        ))
        project_ids[project['title']] = cursor.lastrowid
    
    # Insert sample blog posts
    blog_posts = [
        {
            'title': 'From IIT KGP to Building a $50M Startup: My Journey in Tech',
            'content': '''When I graduated from IIT KGP in 2010, I never imagined that my student project would become the foundation for a multi-million dollar startup. Here's my story of how the lessons learned at IIT KGP shaped my entrepreneurial journey.

## The Beginning

My final year project was focused on machine learning applications in healthcare. What started as an academic exercise became a passion that drove me to pursue a career in AI and healthcare technology.

## Key Lessons from IIT KGP

1. **Problem-Solving Approach**: The rigorous curriculum taught me to break down complex problems into manageable components.
2. **Collaboration**: Working with diverse teams prepared me for the collaborative nature of startup environments.
3. **Innovation**: The culture of innovation at IIT KGP encouraged me to think beyond conventional solutions.

## Building the Startup

After graduation, I worked for a few years in the industry before starting my own company. The technical foundation from IIT KGP, combined with real-world experience, gave me the confidence to tackle complex healthcare challenges.

## Advice for Current Students

- Focus on solving real problems, not just academic exercises
- Build a strong network of peers and mentors
- Don't be afraid to fail - every failure is a learning opportunity
- Stay curious and keep learning new technologies

The journey from student to entrepreneur is challenging but incredibly rewarding. IIT KGP provided the foundation, but the real learning happens when you apply that knowledge to solve real-world problems.''',
            'category': 'Career',
            'author_id': user_ids['rajesh.kumar@iitkgp.ac.in']
        },
        {
            'title': 'How IIT KGP Shaped My Vision for Sustainable Technology',
            'content': '''Sustainability wasn't just a buzzword during my time at IIT KGP - it was a way of thinking that influenced every project I worked on. Today, as the CEO of GreenTech Innovations, I can see how those early experiences shaped my career path.

## The Sustainability Mindset

At IIT KGP, I was part of several projects focused on renewable energy and environmental conservation. These experiences taught me that technology should serve a greater purpose - improving lives while protecting our planet.

## Key Projects That Shaped My Career

1. **Solar Energy Optimization**: My final year project on optimizing solar panel efficiency led to my first patent
2. **Water Conservation System**: A side project that became the foundation for our current water management solutions
3. **Smart Grid Research**: Early work on smart grid technology that's now central to our business

## Building GreenTech Innovations

The technical skills I gained at IIT KGP, combined with the sustainability mindset, led me to start GreenTech Innovations. We focus on creating technology solutions that address environmental challenges while being commercially viable.

## Current Projects

- Smart grid optimization for rural areas
- IoT-based water management systems
- Renewable energy storage solutions
- Carbon footprint tracking applications

## Advice for Aspiring Green Entrepreneurs

- Start with small, local problems
- Focus on solutions that are both sustainable and profitable
- Build partnerships with local communities
- Stay updated with the latest environmental regulations and technologies

The future belongs to sustainable technology, and IIT KGP gave me the foundation to be part of that future.''',
            'category': 'Startup',
            'author_id': user_ids['priya.sharma@iitkgp.ac.in']
        },
        {
            'title': 'Transforming Healthcare with AI: From Student Project to Global Impact',
            'content': '''What started as a simple machine learning project in my final year at IIT KGP has evolved into a global healthcare AI platform that's helping doctors make better decisions and saving lives worldwide.

## The Student Project That Started It All

My final year project was focused on using machine learning to analyze medical images. The goal was simple: help doctors identify potential health issues more accurately and quickly.

## The Journey from Student to Entrepreneur

After graduation, I worked in the healthcare industry for a few years, gaining valuable experience in both technology and healthcare. This experience showed me the real-world challenges that my student project could address.

## Building HealthAI Systems

In 2018, I founded HealthAI Systems with the mission to democratize access to advanced medical diagnostics. Our platform now serves hospitals and clinics in over 20 countries.

## Key Achievements

- Processed over 1 million medical images
- Improved diagnostic accuracy by 30%
- Reduced diagnosis time by 50%
- Partnered with leading medical institutions worldwide

## Technology Stack

Our platform uses:
- Deep learning for image analysis
- Cloud computing for scalability
- Real-time processing for immediate results
- Secure APIs for integration with existing systems

## Challenges and Solutions

Building a healthcare AI company comes with unique challenges:
- Regulatory compliance across different countries
- Ensuring data privacy and security
- Building trust with medical professionals
- Maintaining high accuracy standards

## Advice for Students Interested in Healthcare AI

- Understand both the technology and the healthcare domain
- Focus on solving real clinical problems
- Build strong partnerships with medical professionals
- Stay updated with healthcare regulations
- Prioritize patient safety and data security

The intersection of AI and healthcare is one of the most exciting areas of technology today. IIT KGP gave me the technical foundation, but the real learning comes from understanding the problems you're trying to solve.''',
            'category': 'Technology',
            'author_id': user_ids['amit.singh@iitkgp.ac.in']
        },
        {
            'title': 'The Future of Work: How AI is Changing the Job Market',
            'content': '''As someone who has been in the tech industry for over a decade, I've witnessed firsthand how AI is transforming the job market. Here's my perspective on what this means for current students and recent graduates.

## The AI Revolution

AI is not just changing how we work - it's changing what work looks like. Jobs that didn't exist 10 years ago are now in high demand, while some traditional roles are being automated.

## Emerging Job Roles

1. **AI Ethics Specialist**: Ensuring AI systems are fair and unbiased
2. **Machine Learning Engineer**: Building and deploying AI models
3. **Data Scientist**: Extracting insights from large datasets
4. **AI Product Manager**: Managing AI-powered products
5. **Robotics Engineer**: Building intelligent machines

## Skills That Will Remain Valuable

- Critical thinking and problem-solving
- Creativity and innovation
- Emotional intelligence
- Communication skills
- Continuous learning ability

## How to Prepare for the AI Future

1. **Learn the Basics**: Understand how AI works, even if you're not building it
2. **Develop Soft Skills**: Focus on skills that complement AI
3. **Stay Curious**: The field is evolving rapidly
4. **Build a Network**: Connect with people in AI-related fields
5. **Gain Practical Experience**: Work on projects that involve AI

## The Role of Education

Institutions like IIT KGP are adapting their curricula to include AI and machine learning. This is crucial for preparing students for the future job market.

## My Advice

Don't fear AI - embrace it. The future belongs to those who can work alongside AI, not those who try to compete with it. Focus on developing skills that complement AI capabilities, and you'll be well-positioned for the future of work.''',
            'category': 'Career',
            'author_id': user_ids['rajesh.kumar@iitkgp.ac.in']
        }
    ]
    
    for post in blog_posts:
        cursor.execute('''
            INSERT INTO blog_posts (title, content, category, author_id)
            VALUES (?, ?, ?, ?)
        ''', (
            post['title'],
            post['content'],
            post['category'],
            post['author_id']
        ))
    
    # Insert sample mentorship requests
    mentorship_requests = [
        {
            'student_id': user_ids['sneha.reddy@iitkgp.ac.in'],
            'alumni_id': user_ids['rajesh.kumar@iitkgp.ac.in'],
            'message': 'I am interested in pursuing a career in AI and healthcare. Would you be willing to mentor me and provide guidance on how to get started in this field?',
            'status': 'pending'
        },
        {
            'student_id': user_ids['karan.malhotra@iitkgp.ac.in'],
            'alumni_id': user_ids['priya.sharma@iitkgp.ac.in'],
            'message': 'I am working on a project related to renewable energy and would love to get your insights on the industry and potential career opportunities.',
            'status': 'accepted'
        },
        {
            'student_id': user_ids['neha.gupta@iitkgp.ac.in'],
            'alumni_id': user_ids['amit.singh@iitkgp.ac.in'],
            'message': 'I am interested in learning more about entrepreneurship and would appreciate your guidance on starting a tech company.',
            'status': 'pending'
        }
    ]
    
    for request in mentorship_requests:
        cursor.execute('''
            INSERT INTO mentorship_requests (student_id, alumni_id, message, status)
            VALUES (?, ?, ?, ?)
        ''', (
            request['student_id'],
            request['alumni_id'],
            request['message'],
            request['status']
        ))
    
    conn.commit()
    conn.close()
    print("Database seeded successfully!")

if __name__ == '__main__':
    seed_database()
