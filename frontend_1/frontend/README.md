# Blood Sample Management System - Frontend

This is the frontend application for the Blood Sample Management System, built with React and Vite.

## Features

- Modern React with hooks and functional components
- Responsive design with mobile-first approach
- Glassmorphism UI design
- Animated transitions with Framer Motion
- Material-UI components
- Chart.js for data visualization
- React Router for navigation
- PDF generation capabilities

## Pages

1. **Dashboard** - Overview of system metrics and recent activities
2. **Patient Registration** - Comprehensive patient onboarding
3. **Sample Collection** - Blood sample collection with QR code generation
4. **Sample Tracking** - Real-time sample tracking with QR scanner
5. **Test Assignment** - Test assignment to samples and technicians
6. **Test Results Entry** - Data entry for test results
7. **Doctor Review** - Verification and approval of test results
8. **Report Generation** - PDF report creation and management
9. **Analytics Dashboard** - Advanced data visualization and insights
10. **Admin Control Center** - System administration and monitoring
11. **User Profile** - Personal settings and preferences
12. **Login/Register** - Authentication pages

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the frontend directory:
   ```bash
   cd frontend/blood-sample-management
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Development

To start the development server:

```bash
npm run dev
```

The application will be available at http://localhost:3000

## Building for Production

To create a production build:

```bash
npm run build
```

The build files will be generated in the `dist` directory.

## Deployment

To preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
├── assets/             # Static assets (images, icons, etc.)
├── App.jsx             # Main App component
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## Technologies Used

- React 18
- Vite
- React Router v6
- Material-UI
- Framer Motion
- Chart.js
- Axios
- @react-pdf/renderer

## License

This project is proprietary and confidential. All rights reserved.