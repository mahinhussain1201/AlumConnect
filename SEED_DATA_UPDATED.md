# Seed Data Updated - Summary

## ✅ Changes Made to seed_data.py

### 1. **Added Project Positions Data**
Created **18 positions** across 7 active projects:

#### AI-Powered Healthcare Diagnostics (3 positions)
- **ML Engineer** (2 openings, 1 filled) - Active
- **Backend Developer** (1 opening, 0 filled) - Active  
- **UI/UX Designer** (1 opening, 0 filled) - Active

#### Sustainable Energy Management System (2 positions)
- **IoT Developer** (2 openings, 0 filled) - Active
- **Data Analyst** (1 opening, 0 filled) - Active

#### Blockchain Supply Chain Tracker (2 positions)
- **Blockchain Developer** (2 openings, 0 filled) - Active
- **Frontend Developer** (1 opening, 0 filled) - Active

#### Smart Agriculture Monitoring (2 positions)
- **IoT Engineer** (1 opening, 1 filled) - **FILLED** ✓
- **Full Stack Developer** (1 opening, 0 filled) - Active

#### Urban Infrastructure Planning Tool (2 positions)
- **GIS Specialist** (1 opening, 0 filled) - Active
- **3D Visualization Developer** (1 opening, 0 filled) - Active

#### Chemical Process Optimization Platform (2 positions)
- **Process Engineer** (1 opening, 1 filled) - **FILLED** ✓
- **ML Engineer** (1 opening, 0 filled) - Active

#### Robotics for Manufacturing Automation (2 positions)
- **Robotics Engineer** (2 openings, 0 filled) - Active
- **Computer Vision Engineer** (1 opening, 0 filled) - Active

### 2. **Updated Project Applications**
All **11 applications** now link to specific positions:
- Applications include `position_id` field
- Each application targets a specific role
- 2 accepted applications (filled positions)
- 1 declined application
- 8 pending applications

### 3. **Database Cleanup**
Added deletion of `project_positions` table during seed reset

## 📊 Seed Data Statistics

- **Users**: 12 (6 alumni/founders, 6 students)
- **Projects**: 8 (7 active, 1 completed)
- **Positions**: 18 (16 active, 2 filled)
- **Applications**: 11 (2 accepted, 1 declined, 8 pending)
- **Blog Posts**: 8
- **Mentorship Requests**: 6
- **Conversations**: 2 with sample messages

## 🎯 Key Features Demonstrated

1. **Multi-position projects**: Each project has 2-3 different roles
2. **Position capacity**: Some positions have multiple openings (e.g., 2 ML Engineers)
3. **Filled positions**: 2 positions are marked as filled and inactive
4. **Diverse roles**: ML Engineer, Backend Dev, IoT Engineer, GIS Specialist, etc.
5. **Realistic skills**: Each position has relevant required skills
6. **Position-specific applications**: Students apply for specific roles

## 🚀 How to Use

```bash
cd backend
python seed_data.py
```

This will:
1. Clear all existing data
2. Create fresh users (alumni/founders and students)
3. Create projects with multiple positions
4. Link applications to specific positions
5. Set up conversations, blog posts, and mentorship requests

## ✅ Verification

After running seed_data.py, you can verify:

```bash
python verify_system.py
```

This will show:
- Total positions: 18
- Positions per project
- Applications linked to positions
- Filled vs active positions

## 📝 Notes

- Password for all users: `password123`
- 2 positions are pre-filled to demonstrate the filled/inactive state
- Applications show realistic messages for each position type
- Skills are relevant to each position (e.g., Solidity for Blockchain Developer)
