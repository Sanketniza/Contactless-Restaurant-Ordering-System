# Backend - Contactless Restaurant Ordering System

This is the backend API for the Contactless Restaurant Ordering System built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT
- Role-based authorization (Customer, Staff, Admin)
- Menu management
- Order processing
- File uploads
- Email notifications
- REST API endpoints

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- Bcrypt for password hashing
- Multer for file uploads
- Nodemailer for sending emails
- Express-validator for input validation

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB (local or Atlas)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/restaurant-ordering-system
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
CORS_ORIGIN=http://localhost:5173

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-email-app-password
EMAIL_FROM=noreply@restaurant-ordering.com

# Admin User
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

### Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgotpassword` - Request password reset
- `PUT /api/auth/resetpassword/:resettoken` - Reset password
- `PUT /api/auth/updatepassword` - Update password (authenticated)

### Users
- `GET /api/users` - Get all users (admin)
- `GET /api/users/:id` - Get single user (admin)
- `POST /api/users` - Create user (admin)
- `PUT /api/users/:id` - Update user (admin)
- `DELETE /api/users/:id` - Delete user (admin)
- `PUT /api/users/:id/role` - Update user role (admin)

### Menu
- `GET /api/menu` - Get all menu items
- `GET /api/menu/:id` - Get single menu item
- `POST /api/menu` - Create menu item (admin, staff)
- `PUT /api/menu/:id` - Update menu item (admin, staff)
- `DELETE /api/menu/:id` - Delete menu item (admin)
- `POST /api/menu/:id/rate` - Rate menu item (authenticated)

### Orders
- `GET /api/orders` - Get all orders (admin, staff)
- `GET /api/orders/:id` - Get single order (owner, admin, staff)
- `POST /api/orders` - Create order (authenticated)
- `PUT /api/orders/:id` - Update order (owner, admin, staff)
- `DELETE /api/orders/:id` - Delete order (admin)
- `PUT /api/orders/:id/status` - Update order status (admin, staff)
- `GET /api/orders/myorders` - Get user's orders (authenticated)

## Folder Structure

```
.
├── config/             # Configuration files
├── controllers/        # Request controllers
├── middleware/         # Custom middleware
├── models/             # Mongoose models
├── routes/             # API routes
├── utils/              # Utility functions
├── uploads/            # Uploaded files storage
├── .env                # Environment variables
├── .gitignore          # Git ignore file
├── package.json        # Dependencies
├── server.js           # Entry point
└── README.md           # Documentation
```
