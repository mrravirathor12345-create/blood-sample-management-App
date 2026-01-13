# Blood Sample Management System

A comprehensive digital solution for managing blood samples in hospitals, pathology labs, and diagnostic centers.

## Overview

The Blood Sample Management System is a full-stack web application designed to digitize and streamline the entire lifecycle of blood sample management. From patient registration to report generation, this system provides a modern, responsive interface with advanced features tailored for healthcare environments.

## Key Features

### Core Functionalities
- ✅ Patient Registration & Medical Profile Management
- ✅ Smart Blood Sample Collection
- ✅ Auto-generated Sample ID
- ✅ QR / Barcode / RFID Tracking
- ✅ Sample Lifecycle Management
- ✅ Lab Test Assignment & Results Entry
- ✅ Doctor Review & Approval
- ✅ Secure Report Generation (PDF)
- ✅ Patient Report Access Portal

### Advanced Features
- ✅ AI-based abnormal report detection
- ✅ Live sample tracking timeline
- ✅ Multi-factor authentication
- ✅ Advanced analytics & heatmaps
- ✅ Audit logs (who, when, what)
- ✅ Multi-language support (Hindi + English)
- ✅ Dark / Light mode
- ✅ Cloud storage for reports
- ✅ Smart notification engine
- ✅ Test reference range auto-compare

### UI/UX Excellence
- ✅ Glassmorphism / Neumorphism cards
- ✅ Animated status timelines
- ✅ Color-coded sample status
- ✅ Medical-themed icons & charts
- ✅ Mobile-first layout
- ✅ Smooth transitions (Framer Motion)
- ✅ Accessibility-friendly fonts

## Technology Stack

### Frontend
- React.js with Vite
- Material-UI (MUI) with custom glassmorphism components
- Framer Motion for animations
- Chart.js for data visualization
- @react-pdf/renderer for report generation
- React Router for navigation

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- QR Code generation
- RESTful API architecture

## Project Structure

```
blood-sample-management/
├── backend/                 # Backend API (Node.js + Express)
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   ├── server.js           # Entry point
│   └── README.md           # Backend documentation
│
├── frontend/               # Frontend application (React + Vite)
│   ├── blood-sample-management/
│   │   ├── src/
│   │   │   ├── components/ # React components
│   │   │   ├── assets/     # Static assets
│   │   │   ├── App.jsx     # Main App component
│   │   │   └── main.jsx    # Entry point
│   │   ├── vite.config.js  # Vite configuration
│   │   └── README.md       # Frontend documentation
│   └── README.md           # Frontend root documentation
│
└── README.md               # Main project documentation
```

## Prerequisites

- Node.js (version 14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend/blood-sample-management
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Development

### Starting the Backend Server

```bash
cd backend
npm run dev
```

The backend API will be available at http://localhost:5000

### Starting the Frontend Server

```bash
cd frontend/blood-sample-management
npm run dev
```

The frontend application will be available at http://localhost:3000

## Building for Production

### Backend

The backend is ready to run in production with the standard `npm start` command.

### Frontend

To create a production build of the frontend:

```bash
cd frontend/blood-sample-management
npm run build
```

## Deployment

The application can be deployed to any platform that supports Node.js applications. For the frontend, the build files can be served statically.

## API Documentation

Detailed API documentation can be found in the [backend README](backend/README.md).

## Contributing

This is a proprietary project. All rights reserved.

## License

This project is proprietary and confidential. All rights reserved.