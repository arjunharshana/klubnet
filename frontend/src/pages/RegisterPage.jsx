import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth.js";
import Navbar from "../components/Navbar.jsx";

function RegisterPage() {
  // State for form inputs
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleNextStep = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim().toLowerCase();

    // details
    if (step === 1) {
      const nameRegex = /^[a-zA-Z\s-]+$/;
      if (!nameRegex.test(trimmedName)) {
        setError("Name can only contain letters, spaces, and hyphens.");
        return;
      }

      if (!trimmedName) {
        setError("Please enter your full name.");
        return;
      }

      if (trimmedName.length > 50) {
        setError("Name field cannot exceed 50 characters.");
        return;
      }

      if (trimmedEmail.length > 50) {
        setError("Email is too long (max 50 characters).");
        return;
      }

      const emailDomainRegex = /^[^\s@]+@[^\s@]+\.(edu|ac\.[a-z]{2,})$/i;
      if (!emailDomainRegex.test(trimmedEmail)) {
        setError("Please use a valid university email (.edu or .ac.xx).");
        return;
      }

      const passwordComplexityRegex =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;
      if (!passwordComplexityRegex.test(formData.password)) {
        setError(
          "Password must be 8+ chars, one uppercase letter, one lowercase letter, one number & special character (!@#$)."
        );
        setLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match!");
        setLoading(false);
        return;
      }

      if (error) {
        setLoading(false);
        return;
      }

      try {
        const apiUri = import.meta.env.VITE_API_URI;
        const response = await axios.post(`${apiUri}/api/users/register`, {
          name: trimmedName,
          email: trimmedEmail,
          password: formData.password,
        });
        console.log("Backend Response:", response.data);
        setStep(2);
      } catch (serverError) {
        setError(serverError.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    // verify otp
    else if (step === 2) {
      if (!/^\d{6}$/.test(formData.otp)) {
        setError("OTP must be exactly 6 digits.");
        setLoading(false);
        return;
      }

      try {
        const apiUri = import.meta.env.VITE_API_URI;
        const response = await axios.post(`${apiUri}/api/users/verify-otp`, {
          email: trimmedEmail,
          otp: formData.otp,
        });

        login(response.data);

        // Redirect to Dashboard or Home after successful verification
        Navigate("/");
      } catch (serverError) {
        setError(
          serverError.response?.data?.message ||
            "Invalid OTP. Please try again."
        );
      }
    }
  };

  const { login } = useAuth();

  return (
    <div className="flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-foreground-light dark:text-foreground-dark selection:bg-primary/20">
      {/* HEADER */}

      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto flex max-w-xl flex-col justify-center px-4 py-16 md:py-24">
          {/* Title Section */}
          <div className="flex flex-col items-center gap-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl text-foreground-light dark:text-foreground-dark">
              Create your KlubNet account
            </h1>
            <p className="max-w-md text-lg text-muted-light dark:text-muted-dark">
              Join the #1 digital hub for college students. Your campus life,
              connected.
            </p>
          </div>

          <div className="mt-12 w-full">
            {}
            <div className="mb-8 flex items-center justify-between">
              {/* account details */}
              <div className="flex flex-1 flex-col items-center gap-2 text-center">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30">
                  <span className="material-symbols-outlined text-[20px] font-bold">
                    person_add
                  </span>
                </div>
                <span className="text-sm font-bold text-primary">Details</span>
              </div>

              <div className="h-0.5 flex-1 bg-border-light dark:bg-border-dark"></div>

              {/*verify otp */}
              <div
                className={`flex flex-1 flex-col items-center gap-2 text-center transition-opacity duration-300 ${
                  step >= 2 ? "opacity-100" : "opacity-50"
                }`}
              >
                <div
                  className={`flex size-10 items-center justify-center rounded-full transition-all duration-300 ${
                    step >= 2
                      ? "bg-primary text-white shadow-lg shadow-primary/30"
                      : "bg-card-light border-2 border-border-light dark:bg-card-dark dark:border-border-dark"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      step >= 2
                        ? "text-white"
                        : "text-muted-light dark:text-muted-dark"
                    }`}
                  >
                    password
                  </span>
                </div>

                <span
                  className={`text-sm font-medium transition-colors duration-300 ${
                    step >= 2
                      ? "text-primary font-bold"
                      : "text-muted-light dark:text-muted-dark"
                  }`}
                >
                  Verify OTP
                </span>
              </div>
            </div>

            {/* Form  */}
            <div className="w-full rounded-xl border border-border-light bg-card-light p-8 shadow-lg shadow-primary/5 dark:border-border-dark dark:bg-card-dark">
              <form onSubmit={handleNextStep} className="flex flex-col gap-6">
                {/* error message */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-sm text-red-600 dark:text-red-400 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                    <span className="material-symbols-outlined text-[18px]">
                      error
                    </span>
                    {error}
                  </div>
                )}

                {/* details for signup */}
                {step === 1 && (
                  <div className="flex flex-col gap-6 animate-in slide-in-from-right-8 fade-in">
                    <div className="flex flex-col gap-1.5 text-left">
                      <label
                        className="text-sm font-medium text-foreground-light dark:text-foreground-dark"
                        htmlFor="name"
                      >
                        Full Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-border-light bg-background-light py-3 px-4 text-base text-foreground-light outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-border-dark dark:bg-background-dark dark:text-foreground-dark"
                      />
                    </div>

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
                          placeholder="Your college email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full rounded-lg border border-border-light bg-background-light py-3 pl-10 pr-4 text-base text-foreground-light placeholder:text-muted-light focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-border-dark dark:bg-background-dark dark:text-foreground-dark dark:focus:border-primary outline-none transition-all"
                        />
                      </div>
                      <p className="text-xs text-muted-light dark:text-muted-dark">
                        Please use your official college email to get access.
                      </p>
                    </div>

                    <div className="flex flex-col gap-1.5 text-left">
                      <label
                        className="text-sm font-medium text-foreground-light dark:text-foreground-dark"
                        htmlFor="password"
                      >
                        Create a password
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
                          required
                          className="w-full rounded-lg border border-border-light bg-background-light py-3 pl-10 pr-4 text-base text-foreground-light placeholder:text-muted-light focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-border-dark dark:bg-background-dark dark:text-foreground-dark dark:focus:border-primary outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 text-left">
                      <label
                        className="text-sm font-medium text-foreground-light dark:text-foreground-dark"
                        htmlFor="confirmPassword"
                      >
                        Confirm password
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark text-[20px]">
                          lock
                        </span>
                        <input
                          id="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          className="w-full rounded-lg border border-border-light bg-background-light py-3 pl-10 pr-4 text-base text-foreground-light placeholder:text-muted-light focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-border-dark dark:bg-background-dark dark:text-foreground-dark dark:focus:border-primary outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* verify otp */}
                {step === 2 && (
                  <div className="flex flex-col gap-6 text-center animate-in slide-in-from-right-8 fade-in">
                    <div className="flex flex-col gap-2">
                      <p className="text-sm text-muted-light dark:text-muted-dark">
                        We sent a 6-digit code to{" "}
                        <span className="font-bold text-primary">
                          {formData.email}
                        </span>
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <input
                        id="otp"
                        type="text"
                        placeholder="123456"
                        maxLength="6"
                        value={formData.otp}
                        onChange={handleChange}
                        required
                        className="w-full text-center text-2xl tracking-[0.5em] font-bold rounded-lg border border-border-light bg-background-light py-3 text-foreground-light outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-border-dark dark:bg-background-dark dark:text-foreground-dark"
                      />
                    </div>
                    <button
                      type="button"
                      className="text-xs text-muted-light hover:text-primary dark:text-muted-dark"
                    >
                      Resend Code
                    </button>
                  </div>
                )}

                {/* navigation buttons */}
                <div className="flex gap-3">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="flex-1 rounded-full border border-border-light text-base font-bold text-muted-light transition-colors hover:bg-background-light dark:border-border-dark dark:text-muted-dark dark:hover:bg-background-dark"
                    >
                      Back
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative flex h-12 flex-[2] items-center justify-center rounded-full bg-primary px-6 text-base font-bold text-white shadow-lg shadow-primary/40 transition-transform duration-300 hover:scale-105 active:scale-95"
                  >
                    <span>
                      {loading
                        ? "Processing..."
                        : step === 2
                        ? "Finish"
                        : "Continue"}
                    </span>

                    {/* loading spinner*/}
                    {!loading && (
                      <span className="material-symbols-outlined ml-2 text-[20px] transition-transform duration-300 group-hover:translate-x-1">
                        arrow_forward
                      </span>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center text-xs text-muted-light dark:text-muted-dark">
                By signing up, you agree to our{" "}
                <a
                  className="font-medium text-primary hover:underline"
                  href="#"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  className="font-medium text-primary hover:underline"
                  href="#"
                >
                  Privacy Policy
                </a>
                .
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RegisterPage;
