# Chick-fil-A Employee Portal

A modern, full-stack employee portal application for Chick-fil-A Kernersville, featuring a React frontend and Node.js/Express backend powered by Neon PostgreSQL.

## 🏗️ Architecture

### Frontend (React)
- **Framework**: React 19.1.0 with React Router
- **State Management**: Zustand
- **Styling**: Custom CSS with responsive design
- **HTTP Client**: Axios
- **Build Tool**: Create React App

### Backend (Node.js/Express)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (Neon)
- **Authentication**: JWT with bcrypt
- **File Upload**: Multer
- **Security**: Helmet, CORS, Rate Limiting

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- Neon PostgreSQL database account

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd CF
```

### 2. Run Setup Script
**Windows:**
```cmd
setup.bat
```

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

### 3. Configure Database
1. Create a [Neon](https://neon.tech) account and project
2. Copy your connection string
3. Update `backend/.env`:
```env
DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require
JWT_SECRET=your-super-secure-jwt-secret
```

### 4. Initialize Database
```bash
cd backend
npm run migrate
npm run seed
```

### 5. Start Development Servers

**Backend (Terminal 1):**
```bash
cd backend
npm run dev
```

**Frontend (Terminal 2):**
```bash
npm start
```

The app will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## 👥 Default Users

| Username | Password | Role |
|----------|----------|------|
| Kvillecfa | 1248 or 4772 | Team Member |
| Kvillecfamgr | 1248mgr or 4772mgr | Manager |
| Admin | AdminCFA | Admin |

*Note: Usernames are case-insensitive*

## 🔐 Features

### Authentication & Authorization
- JWT-based authentication with HTTP-only cookies
- Role-based access control (Team, Manager, Admin)
- Secure password hashing with bcrypt
- Session management and token verification

### Content Management
- **Home Page**: Welcome messages, quick links, announcements
- **About Section**: Company mission, vision, and values
- **Team Management**: Employee profiles and organizational chart
- **Development**: Training materials and career development resources
- **Benefits**: Employee benefits categorized by employment type
- **Documents**: Secure file upload and document management
- **Photos**: Image gallery with category organization
- **Calendar**: Event management with multiple calendar views

### Admin Features
- User management and role assignment
- Content creation and editing
- File upload and management
- System dashboard and analytics
- Activity logs and monitoring

## 🗂️ Project Structure

```
CF/
├── public/                    # Static assets
├── src/                       # React frontend source
│   ├── components/           # React components
│   ├── styles/               # CSS stylesheets
│   ├── utils/                # Utilities and API client
│   ├── App.js                # Main App component
│   ├── store.js              # Zustand state management
│   └── index.js              # React entry point
├── backend/                   # Node.js backend
│   ├── config/               # Database configuration
│   ├── middleware/           # Express middleware
│   ├── routes/               # API route handlers
│   ├── scripts/              # Database scripts
│   ├── uploads/              # File upload directory
│   └── server.js             # Express server entry point
├── .env                      # Frontend environment variables
├── package.json              # Frontend dependencies
├── setup.bat                 # Windows setup script
└── setup.sh                  # Linux/Mac setup script
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify JWT token

### Content Management
- `GET /api/home` - Get home content
- `GET /api/about` - Get about content
- `GET /api/team` - Get team members
- `GET /api/development` - Get development content
- `GET /api/benefits` - Get benefits
- `GET /api/documents` - Get documents
- `GET /api/photos` - Get photos
- `GET /api/calendar` - Get calendar events

### Admin Operations
- `GET /api/admin/dashboard` - Admin dashboard
- `GET /api/admin/users` - User management
- `POST /api/*/upload` - File uploads
- `PUT /api/*/:id` - Update content
- `DELETE /api/*/:id` - Delete content

## 🎨 Frontend Components

### Main Components
- `LoginScreen` - Authentication interface
- `Header` - Navigation and user info
- `HomeSection` - Welcome page and quick access
- `AboutSection` - Company information
- `TeamSection` - Team member profiles
- `DevelopmentSection` - Training resources
- `BenefitsSection` - Employee benefits
- `DocumentsSection` - Document management
- `PhotosSection` - Photo gallery
- `CalendarSection` - Event calendar

### Modal Components
- Content editing modals
- File upload modals
- Confirmation dialogs
- Image viewers

## 🗄️ Database Schema

### Key Tables
- `users` - User accounts and authentication
- `home_content` - Home page content
- `about_content` - About section content
- `team_members` - Team member profiles
- `development_content` - Training materials
- `benefits` - Employee benefits
- `documents` - Document management
- `photos` - Photo gallery
- `calendar_events` - Calendar events

## 🔒 Security Features

- JWT authentication with HTTP-only cookies
- Password hashing with bcrypt (12 rounds)
- Rate limiting on API endpoints
- CORS protection with credential support
- Helmet security headers
- Input validation and sanitization
- SQL injection prevention
- File upload restrictions and validation
- Role-based access control

## 📁 File Upload Support

### Document Types
- PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT
- Maximum size: 5MB per file
- Organized by category in `/uploads/documents/`

### Image Types
- JPG, JPEG, PNG, GIF, WEBP
- Maximum size: 5MB per file
- Organized by category in `/uploads/photos/`

## 🌍 Environment Variables

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_NAME=Chick-fil-A Employee Portal
```

### Backend (backend/.env)
```env
DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require
JWT_SECRET=your-super-secure-jwt-secret
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 🚀 Deployment

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy the `build/` folder to a static hosting service
3. Update `REACT_APP_API_URL` for production

### Backend Deployment
1. Set production environment variables
2. Deploy to a Node.js hosting service
3. Ensure Neon database is accessible
4. Configure CORS for production domain

### Recommended Services
- **Frontend**: Vercel, Netlify, GitHub Pages
- **Backend**: Railway, Heroku, DigitalOcean
- **Database**: Neon PostgreSQL (already configured)

## 🔧 Development

### Adding New Features
1. Define API endpoints in backend routes
2. Create database migrations if needed
3. Update the API client in `src/utils/api.js`
4. Create/update React components
5. Add styling in appropriate CSS files

### Database Changes
1. Create migration script in `backend/scripts/`
2. Update seed data if necessary
3. Run `npm run migrate` to apply changes

## 📝 Scripts

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with initial data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary software for Chick-fil-A Kernersville.

## 🆘 Support

For technical support or questions:
1. Check the backend README.md for detailed API documentation
2. Review the database schema in migration scripts
3. Check environment variable configuration
4. Verify Neon database connectivity

---

**Built with ❤️ for Chick-fil-A Kernersville Team**
