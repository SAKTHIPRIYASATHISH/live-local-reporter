# 🚨 Live Local Problem Reporter

A full-stack civic issue reporting platform where citizens can report local problems like garbage, water leakage, broken street lights and more — with real-time location tracking and admin management.

## 🌍 Live Demo
🔗 https://live-local-reporter.vercel.app

## ✨ Features

- 📍 Report issues with location and image
- 🗺️ Interactive map showing all reported issues
- ▲ Upvote issues to show urgency
- 🔍 Filter issues by category
- 🛡️ Admin dashboard with status tracking
- 🔐 JWT Authentication (Register / Login)
- 📸 Image upload via Cloudinary
- 🗑️ Delete your own issues
- 📊 Status tracking (Pending → In Progress → Resolved)

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router DOM
- Leaflet.js (Interactive Map)
- Axios

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- Bcrypt.js

### Cloud Services
- MongoDB Atlas (Database)
- Cloudinary (Image Storage)
- Vercel (Frontend Deployment)
- Render (Backend Deployment)

## 🚀 Getting Started Locally

### Prerequisites
- Node.js
- MongoDB

### Backend Setup
```bash
cd server
npm install
```

Create `.env` file in server folder:
```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

Run backend:
```bash
node index.js
```

### Frontend Setup
```bash
cd client
npm install
npm start
```

## 📁 Project Structure

```
live-local-reporter/
├── client/                 # React Frontend
│   └── src/
│       ├── api/            # Axios config
│       ├── components/     # Reusable components
│       ├── context/        # Auth context
│       └── pages/          # App pages
└── server/                 # Node.js Backend
    ├── models/             # MongoDB schemas
    ├── routes/             # API routes
    ├── middleware/         # JWT middleware
    └── utils/              # Cloudinary config
```

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/issues | Get all issues |
| POST | /api/issues | Create issue |
| POST | /api/issues/upload | Upload image |
| PATCH | /api/issues/:id/upvote | Upvote issue |
| PATCH | /api/issues/:id/status | Update status (admin) |
| DELETE | /api/issues/:id | Delete issue |

## 🗺️ How It Works

1. **Citizens** register and login to the platform
2. They **report issues** with title, description, category, photo and location
3. Issues appear on the **interactive map** with markers
4. Other citizens can **upvote** issues to show urgency
5. **Admins** can change issue status from Pending → In Progress → Resolved
6. Everyone can **filter** issues by category

## 📊 Admin Dashboard

The admin dashboard shows:
- Total number of issues
- Issues by status (Pending, In Progress, Resolved)
- Full issue table with status management
- Reporter details and upvote counts

## 🔐 Authentication

- Passwords are hashed using **Bcrypt.js**
- Authentication uses **JWT tokens** stored in localStorage
- Protected routes require valid token
- Role-based access — only admins can change issue status

## 👩‍💻 Developer

**Sakthi Priya S**
- GitHub: https://github.com/SAKTHIPRIYASATHISH

## 📄 License
MIT License
