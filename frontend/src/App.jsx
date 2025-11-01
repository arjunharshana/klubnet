import React from "react";
import { Routes, Route, Link } from "react-router-dom";

function Home() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-blue-600">Home Page</h1>
      <p>Welcome to the Home Page!</p>

      <nav className="mt-4 flex gap-4">
        <Link to="/login" className="text-blue-500 hover:underline">
          Go to Login
        </Link>
        <Link to="/register" className="text-blue-500 hover:underline">
          Go to Register
        </Link>
      </nav>
    </div>
  );
}

function Login() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-green-600">Login Page</h1>
      <p>Please enter your login credentials.</p>

      <nav className="mt-4">
        <Link to="/" className="text-blue-500 hover:underline">
          Back to Home
        </Link>
      </nav>
    </div>
  );
}

function Register() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-purple-600">Register Page</h1>
      <p>Please fill in the registration form.</p>

      <nav className="mt-4">
        <Link to="/" className="text-blue-500 hover:underline">
          Back to Home
        </Link>
      </nav>
    </div>
  );
}

function NotFound() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-red-600">404 - Not Found</h1>
      <p>The page you are looking for does not exist.</p>

      <nav className="mt-4">
        <Link to="/" className="text-blue-500 hover:underline">
          Back to Home
        </Link>
      </nav>
    </div>
  );
}

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
