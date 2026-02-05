import { React, StrictMode } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Explore from "./pages/Explore.jsx";
import CreateClub from "./pages/CreateClub.jsx";
import ClubDetails from "./pages/ClubDetails.jsx";
import Profile from "./pages/Profile.jsx";
import SuperAdminDashboard from "./pages/SuperAdminDashboard.jsx";
import SuperAdminRoute from "./components/SuperAdminRoute.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/create-club" element={<CreateClub />} />
        <Route path="/clubs/:id" element={<ClubDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route element={<SuperAdminRoute />}>
          <Route path="/super-admin" element={<SuperAdminDashboard />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
