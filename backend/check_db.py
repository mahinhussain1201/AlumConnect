import sqlite3

conn = sqlite3.connect('launchpad.db')
cursor = conn.cursor()

# Check if project_positions table exists
cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='project_positions'")
result = cursor.fetchone()

if result:
    print("✓ project_positions table exists")
    
    # Check if position_id column exists in project_applications
    cursor.execute("PRAGMA table_info(project_applications)")
    columns = cursor.fetchall()
    column_names = [col[1] for col in columns]
    
    if 'position_id' in column_names:
        print("✓ position_id column exists in project_applications")
    else:
        print("✗ position_id column missing in project_applications")
        print("Adding position_id column...")
        cursor.execute('ALTER TABLE project_applications ADD COLUMN position_id INTEGER REFERENCES project_positions(id)')
        conn.commit()
        print("✓ position_id column added")
else:
    print("✗ project_positions table does not exist")
    print("Creating project_positions table...")
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
    conn.commit()
    print("✓ project_positions table created")

# Show sample data
cursor.execute("SELECT COUNT(*) FROM project_positions")
count = cursor.fetchone()[0]
print(f"\nTotal positions in database: {count}")

conn.close()
print("\nDatabase check complete!")
