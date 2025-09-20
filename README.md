de th# IIT KGP Launchpad

A comprehensive digital platform designed to showcase ongoing and completed startup projects from IIT Kharagpur, strengthen alumni-student collaboration, and provide knowledge-sharing opportunities.

## 🚀 Features

### Public Features
- **Landing Page**: Beautiful hero section with featured projects and alumni success stories
- **About Page**: Comprehensive information about the platform and its mission
- **Project Showcase**: Browse and discover innovative projects from students and alumni
- **Alumni Connect**: Connect with successful alumni for mentorship and opportunities
- **Blog & Insights**: Access knowledge and experiences from the alumni community

### Authentication
- **Secure Login/Register**: JWT-based authentication system
- **Role-based Access**: Separate experiences for students and alumni
- **Profile Management**: Comprehensive user profiles with skills and interests

### Student Features
- **Student Dashboard**: Personalized dashboard with applications and opportunities
- **Project Applications**: Apply for internships and mentorship opportunities
- **Mentorship Matching**: Connect with alumni based on interests and skills

### Alumni Features
- **Alumni Dashboard**: Manage projects, mentorship, and community engagement
- **Project Management**: Showcase and manage your projects
- **Mentorship System**: Offer guidance and opportunities to students
- **Blog Publishing**: Share insights and experiences with the community

## 🛠️ Technology Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for beautiful, accessible components
- **React Router** for navigation
- **Lucide React** for icons

### Backend
- **Flask** (Python) for the API server
- **SQLite** for database
- **JWT** for authentication
- **Flask-CORS** for cross-origin requests

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- Python (v3.8 or higher)
- npm or yarn

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

## 🎨 Design Features

- **Modern UI/UX**: Clean, minimal design with beautiful hover animations
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Accessibility**: Built with accessibility in mind using shadcn/ui components
- **Dark Mode Ready**: Prepared for dark mode implementation
- **Component Library**: Consistent design system with reusable components

## 🏗️ Project Structure

```
AlumnConect/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/           # shadcn/ui components
│   │   │   └── layout/       # Layout components
│   │   ├── pages/            # Page components
│   │   ├── contexts/         # React contexts
│   │   └── lib/              # Utility functions
│   └── package.json
├── backend/
│   ├── app.py               # Flask application
│   ├── requirements.txt     # Python dependencies
│   └── launchpad.db        # SQLite database (created on first run)
└── README.md
```

## 🔧 Development

### Running the Development Server

1. **Start the Backend**:
   ```bash
   cd backend
   source venv/bin/activate
   python app.py
   ```
   The backend will run on `http://localhost:5000`

2. **Start the Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

### API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/projects` - Get all projects
- `GET /api/blog` - Get all blog posts
- `GET /api/profile` - Get user profile (protected)

## 🎯 Key Features Implemented

### ✅ Completed
- [x] Modern React frontend with TypeScript
- [x] Beautiful landing page with hero section
- [x] Responsive navigation with mobile menu
- [x] Authentication system (login/register)
- [x] User dashboards for students and alumni
- [x] Project showcase pages
- [x] Blog system
- [x] Alumni connect system
- [x] Flask backend with JWT authentication
- [x] SQLite database with proper schema
- [x] CORS configuration for frontend-backend communication

### 🚧 In Progress
- [ ] Enhanced project management features
- [ ] Real-time messaging system
- [ ] File upload for CVs and project images
- [ ] Advanced search and filtering
- [ ] Email notifications
- [ ] Analytics dashboard

## 🎨 UI/UX Highlights

- **Hover Animations**: Smooth transitions and hover effects throughout the interface
- **Card-based Design**: Clean, modern card layouts for content organization
- **Gradient Backgrounds**: Beautiful gradient overlays for visual appeal
- **Icon Integration**: Consistent iconography using Lucide React
- **Typography**: Clear hierarchy with proper font weights and sizes
- **Color Scheme**: Professional color palette with primary and secondary colors

## 🔐 Security Features

- JWT-based authentication
- Password hashing with Werkzeug
- CORS configuration for secure API access
- Input validation and sanitization
- Protected routes for authenticated users

## 📱 Responsive Design

The platform is fully responsive and works seamlessly across:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎓 About IIT KGP

The Indian Institute of Technology Kharagpur is one of India's premier engineering institutions, known for its excellence in education, research, and innovation. The Launchpad platform aims to strengthen the connection between current students and alumni while showcasing the innovative spirit of the IIT KGP community.

---

Built with ❤️ for the IIT KGP community
