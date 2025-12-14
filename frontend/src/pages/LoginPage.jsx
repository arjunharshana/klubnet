import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth.js";
import Navbar from "../components/Navbar.jsx";

function LoginPage() {
  const navigate = useNavigate();

  // State for form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // State for error messages
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const trimmedEmail = formData.email.trim().toLowerCase();

    if (!trimmedEmail || !formData.password) {
      setError("Please enter both email and password.");
      return;
    }

    const emailDomainRegex = /^[^\s@]+@[^\s@]+\.(edu|ac\.[a-z]{2,})$/i;
    if (!emailDomainRegex.test(trimmedEmail)) {
      setError("Please use a valid university email (.edu or .ac.xx).");
      return;
    }

    try {
      const apiUri = import.meta.env.VITE_API_URI;
      const response = await axios.post(
        `${apiUri}/api/users/login`,
        {
          email: trimmedEmail,
          password: formData.password,
        },
        { withCredentials: true }
      );

      login(response.data);

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const { login } = useAuth();
  return (
    <div className="flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-foreground-light dark:text-foreground-dark selection:bg-primary/20">
      {/* header */}

      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto flex max-w-md flex-col justify-center px-4 py-16 md:py-24">
          {}
          <div className="flex flex-col items-center gap-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl text-foreground-light dark:text-foreground-dark">
              Welcome back
            </h1>
            <p className="max-w-md text-lg text-muted-light dark:text-muted-dark">
              Log in to your KlubNet account to access your digital campus hub.
            </p>
          </div>

          <div className="mt-12 w-full">
            <div className="w-full rounded-xl border border-border-light bg-card-light p-8 shadow-lg shadow-primary/5 dark:border-border-dark dark:bg-card-dark">
              <form onSubmit={handleLogin} className="flex flex-col gap-6">
                {/*error message */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-sm text-red-600 dark:text-red-400 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                    <span className="material-symbols-outlined text-[18px]">
                      error
                    </span>
                    {error}
                  </div>
                )}

                {/* Email Input */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label
                    className="text-sm font-medium text-foreground-light dark:text-foreground-dark"
                    htmlFor="email"
                  >
                    University Email
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark text-[20px]">
                      mail
                    </span>
                    <input
                      id="email"
                      type="email"
                      placeholder="name@university.edu"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-border-light bg-background-light py-3 pl-10 pr-4 text-base text-foreground-light placeholder:text-muted-light outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-border-dark dark:bg-background-dark dark:text-foreground-dark dark:focus:border-primary transition-all"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label
                    className="text-sm font-medium text-foreground-light dark:text-foreground-dark"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark text-[20px]">
                      lock
                    </span>
                    <input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-border-light bg-background-light py-3 pl-10 pr-4 text-base text-foreground-light placeholder:text-muted-light outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-border-dark dark:bg-background-dark dark:text-foreground-dark dark:focus:border-primary transition-all"
                    />
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="flex items-center justify-end">
                  <Link
                    to="#"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex h-12 w-full items-center justify-center rounded-full bg-primary px-6 text-base font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span>{loading ? "Logging in..." : "Login"}</span>
                  {!loading && (
                    <span className="material-symbols-outlined ml-2 transition-transform group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
