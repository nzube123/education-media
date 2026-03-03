# Database Seeding & User Authentication Setup Guide

## Overview
Your application now has automatic database seeding on signup. When users sign up, their information is stored in the database with password hashing for security.

## What Was Changed

### 1. **Database Schema** (`prisma/schema.prisma`)
- Added `password: String` field to the `User` model for secure password storage

### 2. **Seed Functions** (`prisma/seed.ts`)
- `seedNewUser()` - Creates new users with hashed passwords (called on signup)
- `findUser()` - Authenticates users by email and password
- `getUserById()` - Retrieves user data with all relations (posts, comments, messages)
- Added `bcrypt` for secure password hashing

### 3. **API Endpoint** (`api/user/route.ts`)
- Handlers for signup, login, and user retrieval
- Validates input and manages errors

### 4. **Server Setup** (`api/server.ts`)
- Express server with routes:
  - `POST /signup` - Handles user registration
  - `POST /api/login` - Handles user login
  - `GET /api/user/:id` - Retrieves user data by ID
  - Serves static HTML, CSS, and JS files

### 5. **Signup Form** (`html/signup.html`)
- Updated with JavaScript form handler
- Shows success/error messages
- Automatically redirects after successful signup

### 6. **Dependencies** (`package.json`)
- Added: `bcrypt`, `express`, and TypeScript types

## Setup Instructions

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Environment
Create a `.env` file in the project root:
```
DATABASE_URL="postgresql://user:password@localhost:5432/education_media"
PORT=3000
```

Replace with your PostgreSQL connection string.

### Step 3: Create Database Migration
```bash
npx prisma migrate dev --name init
```

This will:
- Create the tables in your database
- Add the password field to the User model
- Run the seed script to populate initial data

### Step 4: Start the Server
```bash
npm start
# or for development with auto-reload:
npx tsx api/server.ts
```

Server runs on `http://localhost:3000`

## How It Works

### Signup Flow
1. User fills out signup form (username, email, password)
2. Form submits to `POST /signup`
3. Server receives data and calls `seedNewUser()`
4. Password is hashed using bcrypt (10 salt rounds)
5. User is created in database
6. Success message is shown, then user is redirected

### Login Flow
1. User submits email and password
2. Server calls `findUser()` to authenticate
3. Password is verified against stored hash
4. User data (without password) is returned

### Retrieve User Data
- Access `GET /api/user/:id` with user ID
- Returns user with all posts, comments, and messages
- Password is never returned to frontend

## Security features
✅ Passwords are hashed with bcrypt (10 rounds)
✅ Passwords are never logged or returned to client
✅ Duplicate email prevention
✅ Input validation on all endpoints
✅ Error messages don't reveal if user exists

## API Response Examples

### Successful Signup
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Signup Error
```json
{
  "success": false,
  "error": "User with this email already exists"
}
```

### Get User Data
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "createdAt": "2024-03-03T10:30:00Z",
    "posts": [...],
    "comments": [...],
    "messages": [...]
  }
}
```

## Testing

### Test Signup
```bash
curl -X POST http://localhost:3000/signup \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=JohnDoe&email=john@example.com&password=securePassword123"
```

### Test Login
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"securePassword123"}'
```

### Test Retrieve User
```bash
curl http://localhost:3000/api/user/1
```

## Next Steps

1. **Sessions/JWT**: Add session management or JWT tokens for authenticated requests
2. **Email Verification**: Implement email verification on signup
3. **Password Reset**: Add forgot password functionality
4. **User Profile Page**: Connect profile.html to retrieve and display user data
5. **Rate Limiting**: Add rate limiting to prevent abuse

## Troubleshooting

**Issue**: "ECONNREFUSED" when starting server
- Check DATABASE_URL in .env
- Ensure PostgreSQL is running

**Issue**: "User with this email already exists"
- The email is already registered
- Reset database with: `npx prisma migrate reset`

**Issue**: "User not found" on login
- Check email spelling
- Ensure user was created during signup

