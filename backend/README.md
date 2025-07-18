# Chick-fil-A Employee Portal Backend

A Node.js/Express backend API for the Chick-fil-A Kernersville Employee Portal, powered by Neon PostgreSQL.

## Features

- 🔐 **Authentication & Authorization** - JWT-based auth with role-based access control
- 👥 **User Management** - Team members, managers, and admin roles
- 🏠 **Home Content** - Welcome messages, quick links, and announcements
- ℹ️ **About Section** - Company mission, vision, and values
- 👨‍💼 **Team Management** - Team member profiles and organizational structure
- 📚 **Development** - Training materials and development content
- 💼 **Benefits** - Employee benefits by category (full-time, part-time, manager)
- 📄 **Document Management** - File upload and categorization
- 📸 **Photo Gallery** - Image upload with category organization
- 📅 **Calendar Events** - Event management with multiple calendar views
- 🛠️ **Admin Dashboard** - System administration and analytics

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (Neon)
- **Authentication**: JWT with bcrypt
- **File Upload**: Multer
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Setup

Copy the example environment file:
```bash
copy .env.example .env
```

Update `.env` with your actual values:
```env
# Neon PostgreSQL Database
DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require

# JWT Secret (generate a strong secret)
JWT_SECRET=your-super-secure-jwt-secret-key-here

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000
```

### 3. Database Setup

Run migrations to create tables:
```bash
npm run migrate
```

Seed the database with initial data:
```bash
npm run seed
```

### 4. Start the Server

Development mode (with nodemon):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The API will be available at `http://localhost:5000/api`

## Neon Database Setup

### 1. Create a Neon Account
1. Visit [Neon.tech](https://neon.tech)
2. Sign up for a free account
3. Create a new project

### 2. Get Connection String
1. In your Neon dashboard, go to your project
2. Navigate to the "Connection" tab
3. Copy the connection string
4. Update your `.env` file with the `DATABASE_URL`

### 3. Database Configuration
The connection string should look like:
```
postgresql://username:password@hostname/database?sslmode=require
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify JWT token
- `PUT /api/auth/change-password` - Change user password

### Home Content
- `GET /api/home` - Get home page content
- `POST /api/home/welcome` - Update welcome content (Admin)
- `POST /api/home/quick-link` - Add quick link (Admin)
- `POST /api/home/announcement` - Add announcement (Admin)

### About
- `GET /api/about` - Get about content
- `POST /api/about` - Add about content (Admin)
- `PUT /api/about/:id` - Update about content (Admin)
- `DELETE /api/about/:id` - Delete about content (Admin)

### Team
- `GET /api/team` - Get team members
- `POST /api/team` - Add team member (Admin)
- `PUT /api/team/:id` - Update team member (Admin)
- `DELETE /api/team/:id` - Delete team member (Admin)

### Development
- `GET /api/development` - Get development content
- `POST /api/development` - Add development content (Admin)
- `PUT /api/development/:id` - Update development content (Admin)
- `DELETE /api/development/:id` - Delete development content (Admin)

### Benefits
- `GET /api/benefits` - Get benefits by category
- `POST /api/benefits` - Add benefit (Admin)
- `PUT /api/benefits/:id` - Update benefit (Admin)
- `DELETE /api/benefits/:id` - Delete benefit (Admin)

### Documents
- `GET /api/documents` - Get documents by category
- `POST /api/documents/upload` - Upload document (Admin)
- `PUT /api/documents/:id` - Update document metadata (Admin)
- `DELETE /api/documents/:id` - Delete document (Admin)
- `GET /api/documents/download/:id` - Download document

### Photos
- `GET /api/photos` - Get photos by category
- `POST /api/photos/upload` - Upload photos (Admin)
- `PUT /api/photos/:id` - Update photo metadata (Admin)
- `DELETE /api/photos/:id` - Delete photo (Admin)
- `GET /api/photos/:id` - Get specific photo

### Calendar
- `GET /api/calendar` - Get calendar events
- `POST /api/calendar` - Add calendar event (Admin)
- `PUT /api/calendar/:id` - Update calendar event (Admin)
- `DELETE /api/calendar/:id` - Delete calendar event (Admin)
- `GET /api/calendar/range` - Get events in date range

### Admin
- `GET /api/admin/dashboard` - Get admin dashboard stats (Admin)
- `GET /api/admin/users` - Get all users (Admin)
- `PUT /api/admin/users/:id/status` - Update user status (Admin)
- `PUT /api/admin/users/:id/role` - Update user role (Admin)

## Default Users

The system comes with these default users:

| Username | Password | Role |
|----------|----------|------|
| Kvillecfa | 1248 or 4772 | team |
| Kvillecfamgr | 1248mgr or 4772mgr | manager |
| Admin | AdminCFA | admin |

*Note: Usernames are case-insensitive*

## Role-Based Access

- **Team Members**: Can view all content, no editing capabilities
- **Managers**: Same as team members plus access to manager-only sections
- **Admins**: Full access including content creation, editing, and user management

## File Upload

The system supports file uploads for:
- **Documents**: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT
- **Photos**: JPG, JPEG, PNG, GIF, WEBP
- **Avatars**: JPG, JPEG, PNG, GIF, WEBP

Files are organized in the `/uploads` directory by type.

## Security Features

- JWT-based authentication with HTTP-only cookies
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS protection
- Helmet security headers
- Input validation and sanitization
- SQL injection prevention with parameterized queries

## Database Schema

### Key Tables

- `users` - User accounts and authentication
- `home_content` - Home page content (welcome, quick links, announcements)
- `about_content` - About section content
- `team_members` - Team member profiles
- `development_content` - Training and development materials
- `benefits` - Employee benefits by category
- `documents` - Document management
- `photos` - Photo gallery
- `calendar_events` - Calendar events and scheduling

## Development

### Project Structure
```
backend/
├── config/
│   └── database.js          # Database connection
├── middleware/
│   ├── auth.js              # Authentication middleware
│   └── upload.js            # File upload middleware
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── home.js              # Home content routes
│   ├── about.js             # About routes
│   ├── team.js              # Team routes
│   ├── development.js       # Development routes
│   ├── benefits.js          # Benefits routes
│   ├── documents.js         # Document routes
│   ├── photos.js            # Photo routes
│   ├── calendar.js          # Calendar routes
│   └── admin.js             # Admin routes
├── scripts/
│   ├── migrate.js           # Database migrations
│   └── seed.js              # Database seeding
├── uploads/                 # File upload directory
├── .env.example             # Environment variables example
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies and scripts
└── server.js               # Main server file
```

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with initial data

## Deployment

### Environment Variables for Production

```env
NODE_ENV=production
DATABASE_URL=your-neon-production-url
JWT_SECRET=your-production-jwt-secret
FRONTEND_URL=https://your-frontend-domain.com
PORT=5000
```

### Recommended Production Setup

1. Use a process manager like PM2
2. Set up proper logging
3. Configure environment-specific variables
4. Enable HTTPS
5. Set up monitoring and health checks

## Support

For issues or questions about the backend implementation, please refer to the documentation or create an issue in the project repository.
