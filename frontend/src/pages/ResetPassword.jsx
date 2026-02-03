import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  Loader,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import Navbar from "../components/Navbar.jsx";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setStatus("error");
      setErrorMessage("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setStatus("error");
      setErrorMessage("Password must be at least 8 characters");
      return;
    }

    setStatus("loading");

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      // call reset password API
      await axios.post(`${API_URL}/api/users/reset-password`, {
        token,
        password,
        confirmPassword: password,
      });

      setStatus("success");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error.response?.data?.message || "Invalid or Expired Token",
      );
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark font-display text-red-500 font-bold">
        Invalid or missing reset token.
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display overflow-x-hidden selection:bg-primary/30 selection:text-primary transition-colors duration-300">
      {/* background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-300/30 dark:bg-purple-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-200/30 dark:bg-pink-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex h-full grow flex-col">
        {/* Navigation */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex flex-1 items-center justify-center py-12 px-4">
          <div className="w-full max-w-[520px]">
            {/* Glass Card */}
            <div className="bg-white/70 dark:bg-[#1c1022]/70 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] p-8 sm:p-10 transition-all">
              {/* Header Section */}
              <div className="flex flex-col items-center mb-8">
                <div className="size-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary mb-6 shadow-inner ring-1 ring-white/50 dark:ring-white/10">
                  <span className="material-symbols-outlined text-[32px]">
                    lock_reset
                  </span>
                </div>
                <h1 className="text-[#161118] dark:text-white tracking-tight text-[32px] font-bold leading-tight text-center mb-2">
                  Create New Password
                </h1>
                <p className="text-[#161118]/70 dark:text-white/60 text-base font-normal leading-normal text-center max-w-xs">
                  Please enter and confirm your new password below.
                </p>
              </div>

              {/* Success State */}
              {status === "success" ? (
                <div className="w-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-6 rounded-2xl flex flex-col items-center text-center gap-3 animate-in fade-in zoom-in duration-300">
                  <div className="p-3 bg-green-100 dark:bg-green-800/30 rounded-full text-green-600 dark:text-green-400">
                    <CheckCircle size={32} />
                  </div>
                  <div>
                    <p className="text-green-800 dark:text-green-300 font-bold text-lg">
                      Password Updated!
                    </p>
                    <p className="text-green-700 dark:text-green-400 text-sm mt-1">
                      Your account is secure. Redirecting...
                    </p>
                  </div>
                </div>
              ) : (
                /* Form Section */
                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                  {/* Error Message */}
                  {status === "error" && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center gap-2 text-sm font-bold">
                      <AlertTriangle size={18} />
                      {errorMessage}
                    </div>
                  )}

                  {/* New Password Field */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[#161118] dark:text-white text-sm font-semibold leading-normal ml-1">
                      New Password
                    </label>
                    <div className="flex w-full items-center rounded-xl bg-white/60 dark:bg-black/20 border border-[#e2dbe6] dark:border-white/10 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-200 group">
                      <input
                        className="flex-1 bg-transparent border-none text-[#161118] dark:text-white placeholder:text-[#7d6189] dark:placeholder:text-white/30 h-12 px-4 rounded-l-xl focus:ring-0 text-base font-medium outline-none"
                        placeholder="Enter new password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="px-4 text-[#7d6189] dark:text-white/40 hover:text-primary transition-colors flex items-center justify-center h-full rounded-r-xl outline-none"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="flex flex-col gap-2 mt-1">
                    <label className="text-[#161118] dark:text-white text-sm font-semibold leading-normal ml-1">
                      Confirm New Password
                    </label>
                    <div className="flex w-full items-center rounded-xl bg-white/60 dark:bg-black/20 border border-[#e2dbe6] dark:border-white/10 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-200">
                      <input
                        className="flex-1 bg-transparent border-none text-[#161118] dark:text-white placeholder:text-[#7d6189] dark:placeholder:text-white/30 h-12 px-4 rounded-l-xl focus:ring-0 text-base font-medium outline-none"
                        placeholder="Confirm new password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <div className="px-4 text-[#7d6189] dark:text-white/40 flex items-center justify-center h-full rounded-r-xl">
                        <Lock size={20} />
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="mt-6 flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-6 bg-primary hover:bg-primary/90 text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    {status === "loading" ? (
                      <Loader className="animate-spin" />
                    ) : (
                      <span className="truncate">Update Password</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ResetPassword;
