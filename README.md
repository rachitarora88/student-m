# Student Management System (SMS)

A full-stack Student Management System built with React + Vite on the frontend and Express + MongoDB-compatible backend on the server side.

## Features

- Role-based authentication for admin, teacher, student, and parent
- Dashboard with analytics, enrollment trends, fee collection, and attendance metrics
- Student and teacher management modules
- Attendance tracking and reporting
- Department, course, and academic structure management
- Secure JWT authentication and password hashing
- Demo seed data for immediate testing when MongoDB is unavailable

## Tech stack

- Frontend: React, Vite, Tailwind CSS, Recharts
- Backend: Node.js, Express.js, JWT, bcryptjs, Mongoose
- Database: MongoDB (demo mode supported without an active database)

## Quick start

1. Install dependencies at the root and in each app folder:
   npm install
   npm --prefix server install
   npm --prefix client install

2. Start both services:
   npm run dev

3. Open the frontend in the browser:
   http://localhost:5173

4. Use the demo credentials:
   - Admin: admin@college.edu / admin123
   - Teacher: meera.nair@college.edu / teacher123
   - Student: aarav.sharma@student.edu / student123
   - Parent: rajesh.sharma@parent.edu / parent123

## Backend environment

The server reads `server/.env` if present. For MongoDB, set:

```env
PORT=5000
JWT_SECRET=student-management-system-secret
MONGODB_URI=mongodb://127.0.0.1:27017/student_management_system
```

If MongoDB is not running, the application automatically falls back to demo mode with seeded data.
