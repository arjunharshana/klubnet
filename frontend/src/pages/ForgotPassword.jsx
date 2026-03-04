import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Mail,
  ArrowLeft,
  Loader,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import Navbar from "../components/Navbar.jsx";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const API_URL = import.meta.env.VITE_API_URI;
      await axios.post(`${API_URL}/api/users/forgot-password`, { email });
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to send email. Please check the email address.",
      );
    }
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display overflow-x-hidden transition-colors duration-300">
      {/* Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center px-4 py-20 relative">
        {/* Background Decorative Elements */}
        <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="flex flex-col w-full max-w-[480px]">
          {/* Centered Glass Card */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/60 dark:border-gray-700 rounded-2xl p-8 sm:p-12 w-full flex flex-col items-center shadow-xl">
            {/* Icon Header */}
            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary shadow-sm">
              <span className="material-symbols-outlined text-[32px]">
                vpn_key
              </span>
            </div>

            {/* Text Content */}
            <h1 className="text-[#161118] dark:text-white tracking-tight text-[28px] font-bold leading-tight text-center mb-3">
              Reset Your Password
            </h1>
            <p className="text-[#4e4453] dark:text-gray-400 text-base font-normal leading-relaxed text-center mb-8 max-w-[320px]">
              Enter your university email to receive a password reset link.
            </p>

            {/* Success State */}
            {status === "success" ? (
              <div className="w-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 p-4 rounded-xl flex flex-col items-center text-center gap-2">
                <CheckCircle
                  className="text-green-600 dark:text-green-400"
                  size={32}
                />
                <p className="text-green-800 dark:text-green-300 font-bold">
                  Email Sent!
                </p>
                <p className="text-green-700 dark:text-green-400 text-sm">
                  Check your inbox for the link.
                </p>
              </div>
            ) : (
              /* Form */
              <form
                onSubmit={handleSubmit}
                className="w-full flex flex-col gap-5"
              >
                {status === "error" && (
                  <div className="bg-red-100 dark:bg-red-900/30 text-red-600 p-3 rounded-xl flex items-center gap-2 text-sm font-bold">
                    <AlertTriangle size={18} />
                    {errorMessage}
                  </div>
                )}

                <label className="flex flex-col w-full gap-2">
                  <span className="text-[#161118] dark:text-white text-sm font-medium leading-normal ml-1">
                    Email Address
                  </span>
                  <div className="relative">
                    <input
                      className="flex w-full rounded-xl text-[#161118] dark:text-white dark:bg-gray-900/50 border border-[#e2dbe6] dark:border-gray-600 bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 h-12 placeholder:text-[#9ca3af] pl-4 pr-10 text-base font-normal leading-normal transition-all outline-none"
                      placeholder="student@university.edu"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af]">
                      <span className="material-symbols-outlined text-[20px]">
                        mail
                      </span>
                    </div>
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl text-base tracking-wide transition-colors shadow-lg shadow-primary/20 mt-2 flex items-center justify-center gap-2 group disabled:opacity-70"
                >
                  {status === "loading" ? (
                    <Loader className="animate-spin" />
                  ) : (
                    "Send Reset Link"
                  )}
                  {!status === "loading" && (
                    <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  )}
                </button>
              </form>
            )}

            {/* Back Link */}
            <Link
              to="/login"
              className="mt-8 flex items-center gap-2 text-sm font-semibold text-[#4e4453] dark:text-gray-400 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-lg">
                arrow_back
              </span>
              Back to Login
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-[#7d6189] dark:text-gray-500">
              Need help?{" "}
              <a className="font-medium text-primary hover:underline" href="#">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
