# KlubNet - University Club Management System

KlubNet is a comprehensive web application designed to bridge the gap between students and university communities. It provides a seamless platform for discovering clubs, managing memberships, organizing events, and fostering campus engagement.

## Features

### User Features

- Authentication: Secure Login/Register with Email Verification (OTP) and Password Reset.

- Explore: Discover clubs with categories, search, and dynamic filtering.

- Membership: Follow clubs for updates or request to join as a full member.

- Events: View upcoming events, RSVP, and track your schedule via a personal calendar.

- Profile: Customizable profile with Avatar, Bio, Academic details, and Social links.

- Notifications: Real-time updates for event creations and membership approvals.

### Club Admin Features

- Management: Update club details and cover images.

- Events: Create, Edit, and Delete club events.

- Roster: Accept or Reject membership requests; Manage current members.

### Superadmin Features

- Moderation: Review and Approve/Reject new club creation requests.

- Dashboard: View platform-wide statistics (Total Users, Active Clubs, Pending Reviews).

- Access: Exclusive access to the Admin Console via protected routes.

## Tech Stack

### Frontend

- Framework: React (Vite)

- Styling: Tailwind CSS

- Icons: Lucide React

- State/Routing: React Router DOM, Context API

- HTTP Client: Axios

### Backend

- Runtime: Node.js

- Framework: Express.js

- Database: MongoDB

- Authentication: JWT (JSON Web Tokens) with HTTP-Only Cookies

- Email: Gmail SMTP

- Storage: Cloudinary (Image Uploads)

## Environment Variables

To run this project yourself, you will need to add the following environment variables to your .env files.

### Backend (/backend/.env)

```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Cloudinary (Image Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (SMTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Frontend (/frontend/.env)

```bash
VITE_API_URI=http://localhost:5000
```

## Installation & Setup

1. Clone the Repository

```bash
git clone https://github.com/arjunharshana/klubnet.git)
cd klubnet
```

2. Backend Setup

Navigate to the backend folder and install dependencies.

```bash
cd backend
npm install
```

Start the server:

```bash
# Development Mode (Nodemon)
npm run dev
# OR Standard Start
npm start
```

Server runs on http://localhost:5000

3. Frontend Setup

Open a new terminal, navigate to the frontend folder.

```bash
cd frontend
npm install
```

Start the React app:

```bash
npm run dev
```

App runs on http://localhost:5173

## Project Structure

```bash
klubnet/
├── backend/
│   ├── config/         # DB & Cloudinary config
│   ├── controllers/    # Route logic (User, Club, Event)
│   ├── middleware/     # Auth, Upload, RateLimiters
│   ├── models/         # Mongoose Schemas
│   ├── routes/         # API Routes
│   └── server.js       # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/ # Reusable UI components
    │   ├── context/    # Auth Context
    │   ├── pages/      # Full pages (Dashboard, Profile, etc.)
    │   └── App.jsx     # Route definitions
    └── package.json
```

## Security Measures

- Rate Limiting: Prevents brute-force attacks on Auth endpoints.

- Data Sanitization: NoSQL Injection prevention in search queries.

- Secure Cookies: JWTs are stored in HTTP-Only cookies to prevent XSS.

- Role-Based Access Control (RBAC): Middleware to protect Admin/Superadmin routes.

## Upcoming Features

- Real-Time Chat: Club-specific group chats and direct messaging between members using Socket.io.

- Advanced Scheduling: Recurring events and integration with Google Calendar / Outlook.

- Club Gallery: A gallery for clubs to showcase their past events to the users

## Contributing

Contributions are welcome! Please fork the repository and create a pull request for any feature updates.
