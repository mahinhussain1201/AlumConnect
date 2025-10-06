import sqlite3
import json

conn = sqlite3.connect('launchpad.db')
cursor = conn.cursor()

# Get all projects
cursor.execute("SELECT id, title FROM projects LIMIT 5")
projects = cursor.fetchall()

print("Projects in database:")
for proj in projects:
    print(f"  Project {proj[0]}: {proj[1]}")
    
    # Check positions for this project
    cursor.execute("SELECT id, title, count, filled_count, is_active FROM project_positions WHERE project_id = ?", (proj[0],))
    positions = cursor.fetchall()
    
    if positions:
        print(f"    Positions:")
        for pos in positions:
            print(f"      - {pos[1]} ({pos[2]} openings, {pos[3]} filled, active: {pos[4]})")
    else:
        print(f"    No positions defined")
    print()

conn.close()
