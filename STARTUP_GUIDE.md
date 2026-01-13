# Blood Sample Management System - Startup Guide

This guide will help you get the Blood Sample Management System up and running on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 14 or higher)
- MongoDB (local installation or cloud instance)
- npm or yarn package manager

## Initial Setup

### 1. Install Dependencies

Run the following command to install all dependencies for both frontend and backend:

```bash
npm run install:all
```

This will install dependencies for:
- Root project
- Backend API
- Frontend application

### 2. Configure Environment Variables

#### Backend Configuration

Navigate to the `backend` directory and create a `.env` file:

```bash
cd backend
cp .env.example .env
```

Update the `.env` file with your configuration:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret_key
JWT_EXPIRE=30d
```

If you're using a local MongoDB instance, you can use:
```
MONGODB_URI=mongodb://localhost:27017/bloodsampledb
```

### 3. Initialize the Database (Optional)

To populate the database with sample data:

```bash
cd backend
npm run init-db
```

### 4. Test Database Connection (Recommended)

To verify that your MongoDB connection is working properly:

```bash
cd backend
npm run test-db
```

Or from the root directory:

```bash
npm run test-db
```

This will create:
- Sample users (admin, doctor, lab technician)
- Sample patients
- Sample tests

Default admin credentials:
- Email: admin@lab.com
- Password: password123

### 5. Start the Development Servers

#### Option 1: Start Both Servers Concurrently

From the root directory:

```bash
npm run dev
```

This will start both:
- Backend API on http://localhost:5000
- Frontend application on http://localhost:3000

#### Option 2: Start Servers Separately

##### Start Backend Server

```bash
cd backend
npm run dev
```

##### Start Frontend Server

In a new terminal:

```bash
cd frontend/blood-sample-management
npm run dev
```

### 6. Access the Application

Once both servers are running:

1. Open your browser and navigate to http://localhost:3000
2. Login with the default admin credentials:
   - Email: admin@lab.com
   - Password: password123

## Project Structure

```
blood-sample-management/
├── backend/                    # Backend API (Node.js + Express)
│   ├── models/                # Database models
│   ├── routes/                # API endpoints
│   ├── middleware/            # Custom middleware
│   ├── utils/                 # Utility functions
│   ├── scripts/               # Helper scripts
│   ├── assets/                # Backend assets
│   ├── server.js              # Main server file
│   └── .env                   # Environment variables
│
├── frontend/                  # Frontend application (React + Vite)
│   └── blood-sample-management/
│       ├── src/
│       │   ├── components/    # React components
│       │   ├── assets/        # Frontend assets
│       │   ├── App.jsx        # Main App component
│       │   └── main.jsx       # Entry point
│       ├── vite.config.js     # Vite configuration
│       └── package.json       # Frontend dependencies
│
├── package.json               # Root package.json with convenience scripts
└── STARTUP_GUIDE.md          # This file
```

## Available Scripts

From the root directory:
- `npm run dev` - Start both frontend and backend in development mode
- `npm run install:all` - Install all dependencies
- `npm run build` - Build the frontend for production
- `npm run test-db` - Test MongoDB connection

From the backend directory:
- `npm run dev` - Start backend server with nodemon
- `npm run start` - Start backend server
- `npm run init-db` - Initialize database with sample data
- `npm run test-db` - Test MongoDB connection

From the frontend directory:
- `npm run dev` - Start frontend development server
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build locally

## Troubleshooting

### Common Issues

1. **Port already in use**
   - Change the PORT in `.env` file
   - Or stop the process using the port

2. **MongoDB connection error**
   - Ensure MongoDB is running
   - Check your `MONGODB_URI` in `.env`
   - Verify network connectivity if using cloud MongoDB

3. **Dependency installation issues**
   - Clear npm cache: `npm cache clean --force`
   - Delete `node_modules` and `package-lock.json` and reinstall

4. **Frontend not connecting to backend**
   - Check the proxy settings in `vite.config.js`
   - Ensure backend server is running on port 5000

### Need Help?

For issues not covered in this guide, please check:
- Individual README files in backend and frontend directories
- Console logs in your terminal
- Browser developer tools for frontend issues

## Next Steps

After successfully running the application:
1. Explore the different modules (Patient Registration, Sample Collection, etc.)
2. Try creating new patients and samples
3. Assign tests and generate reports
4. Review analytics dashboard
5. Customize the system according to your requirements

Enjoy using the Blood Sample Management System!