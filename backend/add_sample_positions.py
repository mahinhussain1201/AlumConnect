import sqlite3
import json

conn = sqlite3.connect('launchpad.db')
cursor = conn.cursor()

# Get first project
cursor.execute("SELECT id, title FROM projects LIMIT 1")
project = cursor.fetchone()

if project:
    project_id = project[0]
    print(f"Adding sample positions to project: {project[1]}")
    
    # Add sample positions
    positions = [
        {
            'title': 'Frontend Developer',
            'description': 'Build responsive UI components using React and TypeScript',
            'required_skills': ['React', 'TypeScript', 'CSS', 'HTML'],
            'count': 2
        },
        {
            'title': 'Backend Developer',
            'description': 'Develop REST APIs and database architecture',
            'required_skills': ['Python', 'Flask', 'SQL', 'REST API'],
            'count': 1
        },
        {
            'title': 'UI/UX Designer',
            'description': 'Design user interfaces and create mockups',
            'required_skills': ['Figma', 'Adobe XD', 'UI Design', 'Prototyping'],
            'count': 1
        }
    ]
    
    for pos in positions:
        cursor.execute('''
            INSERT INTO project_positions (project_id, title, description, required_skills, count, filled_count, is_active)
            VALUES (?, ?, ?, ?, ?, 0, 1)
        ''', (
            project_id,
            pos['title'],
            pos['description'],
            json.dumps(pos['required_skills']),
            pos['count']
        ))
        print(f"  ✓ Added position: {pos['title']} ({pos['count']} openings)")
    
    conn.commit()
    print(f"\n✓ Successfully added {len(positions)} positions to project {project_id}")
else:
    print("No projects found in database")

conn.close()
