import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import RegisterPage from "./pages/RegisterPage";

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
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
