# TodoApp

A full-stack TodoList application with user authentication and task management features.

## Overview
- **Frontend**: React-based user interface, located in the `FRONTEND` folder.
- **Backend**: Node.js/Express API, located in the `BACKEND` folder, handling authentication, tasks, and forgot password functionality.

## Features
- User registration and login with JWT-based authentication
- Create, read, update, and delete (CRUD) tasks
- Password recovery via email with secure reset token verification
- Secure password hashing using Bcrypt
- Protected API routes with JWT verification
- Task grouping and step management
- User profile management (profile image upload, edit profile)
- Task history and statistics (task count)
- Notifications with read status tracking

## Tech Stack

### Frontend
- React
- Vite
- Axios for API calls

### Backend
- Node.js
- Express.js
- MongoDB (via MongoDB Atlas)
- JWT for authentication
- Bcrypt for password hashing
- Nodemailer for email functionality
- Multer for profile image uploads
- node-cron for the in app notification
- Mongoose for database interaction

## Prerequisites
Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account for database (or local MongoDB)

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/AhmadGhareebDev/todolist-webapp.git
cd todolist-webapp
```

### 2. Backend Setup
```bash
cd BACKEND
npm install
```

Create a `.env` file in the BACKEND folder with the following variables (replace placeholders with your values you can copy the exsiting .env.example):

**Backend Environment Variables**

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `PORT` | Server port number (default: 3500) | `3500` |
| `DATABASE_URL` | MongoDB connection string | `mongodb+srv://<username>:<password>@cluster0.burnnfh.mongodb.net/TODOLIST` |
| `ACCESS_SECRET_TOKEN` | Secret key for access JWT tokens | `<your-access-secret-token>` |
| `REFRESH_SECRET_TOKEN` | Secret key for refresh JWT tokens | `<your-refresh-secret-token>` |
| `EMAIL_HOST` | Email host (e.g., smtp.gmail.com) | `smtp.gmail.com` |
| `EMAIL_PORT` | Email port (e.g., 587) | `587` |
| `EMAIL_USER` | Email address for sending emails | `<your-email@gmail.com>` |
| `EMAIL_PASS` | Email app-specific password | `<your-app-specific-password>` |
| `VERIFICATION_URL` | URL for email verification | `http://localhost:3500/auth/verify-email` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../FRONTEND
npm install
```

Create a `.env` file in the FRONTEND folder with the following variables (replace placeholders with your values):

**Frontend Environment Variables**

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `VITE_BACKEND_URL` | Backend API base URL | `http://localhost:3500` |

Start the frontend development server:
```bash
npm run dev
```

## Usage
1. Open your browser and navigate to `http://localhost:5173`
2. Register a new account or login with existing credentials
3. Start managing your tasks, groups, and profile!

## API Endpoints

### Authentication
- `POST /register` - Register a new user
- `POST /login` - Login user
- `GET /refresh` - Refresh JWT token
- `POST /logout` - Logout user
- `GET /verify-email/:token` - Verify email with token
- `POST /re-verify-email` - Resend verification email

### Password Reset
- `POST /reset/forgot-password` - Request password reset
- `GET /reset/verify-reset-token/:token` - Verify reset token
- `POST /reset/reset-password/:token` - Reset password with token

### User Management
- `GET /user` - Get profile information
- `POST /user/profile-image` - Upload profile image
- `DELETE /user` - Delete account
- `PATCH /user/editProfile` - Edit profile

### Tasks
- `POST /user` - Add a task
- `GET /user/get-tasks` - Get all tasks
- `DELETE /user/:id` - Delete a task
- `PATCH /user/toggleTask/:taskId` - Toggle task completion
- `PATCH /user/editTask/:taskId` - Edit a task
- `GET /user/get-history-tasks` - Get task history
- `GET /user/get-tasks-number` - Get tasks count

### Groups
- `POST /user/groups` - Add a tasks group
- `GET /user/groups` - Get all groups
- `DELETE /user/groups/:groupId` - Delete a group
- `GET /user/groups/:groupId` - Get group tasks
- `POST /user/groups/:groupId/tasks` - Add task to group
- `DELETE /user/groups/:groupId/tasks/:taskId` - Delete a step task
- `PATCH /user/groups/:groupId/tasks/:taskId/toggle` - Toggle step task completion

### Notifications
- `GET /user/notifications` - Get notifications
- `PATCH /user/mark-notification-read/:id` - Mark notification as read

## Environment Variables

### Backend

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `PORT` | Server port number (default: 3500) | `3500` |
| `DATABASE_URL` | MongoDB connection string | `mongodb+srv://<username>:<password>@cluster0.burnnfh.mongodb.net/TODOLIST` |
| `ACCESS_SECRET_TOKEN` | Secret key for access JWT tokens | `<your-access-secret-token>` |
| `REFRESH_SECRET_TOKEN` | Secret key for refresh JWT tokens | `<your-refresh-secret-token>` |
| `EMAIL_HOST` | Email host (e.g., smtp.gmail.com) | `smtp.gmail.com` |
| `EMAIL_PORT` | Email port (e.g., 587) | `587` |
| `EMAIL_USER` | Email address for sending emails | `<your-email@gmail.com>` |
| `EMAIL_PASS` | Email app-specific password | `<your-app-specific-password>` |
| `VERIFICATION_URL` | URL for email verification | `http://localhost:3500/auth/verify-email` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

### Frontend

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `VITE_BACKEND_URL` | Backend API base URL | `http://localhost:3500` |

## Contributing
1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact
Ahmad Ghareeb - ahmad.ghareeb0000@gmail.com

Project Link: [https://github.com/AhmadGhareebDev/todolist-webapp](https://github.com/AhmadGhareebDev/todolist-webapp)
