
# NutrienGuide Backend Server

This is the backend server for the NutrienGuide application. It handles authentication, user profiles, and nutritional recommendations using MongoDB Atlas.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (a connection string is already configured)

### Installation

1. Install dependencies:
```
npm install
```

2. Start the server:
```
npm start
```

For development with auto-restart:
```
npm run dev
```

## API Endpoints

### Authentication
- POST /api/auth/signup - Create a new user
- POST /api/auth/login - Log in a user

### Profiles
- GET /api/profiles/:userId - Get a user's profile
- POST /api/profiles - Create a new profile
- PUT /api/profiles/:profileId - Update a profile

### Recommendations
- GET /api/recommendations/:userId - Get nutritional recommendations

## Environment Variables

- PORT - The port for the server to listen on (default: 5000)
- JWT_SECRET - Secret key for JWT token generation (default: 'your-secret-key', but should be changed in production)
- MONGODB_URI - MongoDB connection string (already configured)
