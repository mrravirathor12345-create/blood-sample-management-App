# Blood Sample Management System - Backend

This is the backend API for the Blood Sample Management System, built with Node.js, Express, and MongoDB.

## Features

- RESTful API architecture
- JWT-based authentication
- MongoDB with Mongoose ODM
- QR code generation
- PDF report generation
- Role-based access control
- Data validation and sanitization
- Error handling and logging

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Samples
- `GET /api/samples` - Get all samples
- `GET /api/samples/:id` - Get sample by ID
- `POST /api/samples` - Create new sample
- `PATCH /api/samples/:id/status` - Update sample status
- `PATCH /api/samples/:id/assign-tests` - Assign tests to sample
- `DELETE /api/samples/:id` - Delete sample

### Tests
- `GET /api/tests` - Get all tests
- `GET /api/tests/:id` - Get test by ID
- `POST /api/tests` - Create new test
- `PUT /api/tests/:id` - Update test
- `DELETE /api/tests/:id` - Delete test (soft delete)

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/reports/:doctorId` - Get reports assigned to doctor
- `PATCH /api/doctors/reports/:reportId/approve` - Approve report
- `GET /api/doctors/:id` - Get doctor by ID

### Reports
- `GET /api/reports` - Get all reports
- `GET /api/reports/:id` - Get report by ID
- `POST /api/reports` - Create new report
- `PATCH /api/reports/:id/results` - Update test results in report
- `GET /api/reports/:id/pdf` - Generate PDF report
- `PATCH /api/reports/:id/viewed` - Mark report as viewed by patient

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard statistics
- `GET /api/analytics/patients/demographics` - Get patient demographics
- `GET /api/analytics/tests/statistics` - Get test statistics
- `GET /api/analytics/reports/abnormalities` - Get abnormal result statistics

## Prerequisites

- Node.js (version 14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the backend directory:
   ```bash
   cd backend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

5. Update the `.env` file with your configuration:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   ```

## Development

To start the development server:

```bash
npm run dev
```

The API will be available at http://localhost:5000

### Testing Database Connection

To test the MongoDB connection:

```bash
npm run test-db
```

## Production

To start the production server:

```bash
npm start
```

## Project Structure

```
backend/
├── models/              # Mongoose models
├── routes/              # API routes
├── controllers/         # Route controllers
├── middleware/          # Custom middleware
├── utils/               # Utility functions
├── config/              # Configuration files
├── server.js            # Entry point
└── .env                 # Environment variables
```

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- Bcrypt.js
- QR Code generator
- PDFKit
- Joi (validation)
- Cors
- Dotenv

## License

This project is proprietary and confidential. All rights reserved.