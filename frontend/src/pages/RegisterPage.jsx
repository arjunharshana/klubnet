import React, { useState } from "react";
import { Link } from "react-router-dom";

function RegisterPage() {
  // State for form inputs

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
    firstName: "",
    lastName: "",
    year: "",
    branch: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1) {
      // For otp
      setStep(2);
    } else if (step === 2) {
      //for profile
      setStep(3);
    } else if (step === 3) {
      // Final api call to register
      console.log("Final Registration:", formData);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-foreground-light dark:text-foreground-dark selection:bg-primary/20">
      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full border-b border-border-light/80 dark:border-border-dark/60 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="flex size-10 items-center justify-center rounded-lg bg-primary text-white shadow-lg shadow-primary/30"
            >
              <svg
                className="size-6"
                fill="currentColor"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z"></path>
              </svg>
            </Link>
            <Link
              to="/"
              className="text-2xl font-extrabold tracking-tight text-foreground-light dark:text-foreground-dark"
            >
              KlubNet
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-sm text-muted-light dark:text-muted-dark">
              Already have an account?
            </span>
            <Link
              to="/login"
              className="flex h-11 items-center justify-center rounded-full px-5 text-base font-bold text-primary transition-colors hover:bg-primary/10"
            >
              <span>Login</span>
            </Link>
          </div>
        </div>
      </header>

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
            {/* Progress steps */}
            <div className="mb-8 flex items-center justify-between">
              {/* Step 1: Active */}
              <div className="flex flex-1 flex-col items-center gap-2 text-center">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30">
                  <span className="material-symbols-outlined text-[20px] font-bold">
                    mail
                  </span>
                </div>
                <span className="text-sm font-bold text-primary">
                  Signup Email
                </span>
              </div>

              <div className="h-0.5 flex-1 bg-border-light dark:bg-border-dark"></div>

              {/* Step 2: Inactive or Active based on step */}
              <div
                className={`flex flex-1 flex-col items-center gap-2 text-center transition-opacity duration-300 ${
                  step >= 2 ? "opacity-100" : "opacity-50"
                }`}
              >
                {}
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

              <div className="h-0.5 flex-1 bg-border-light dark:bg-border-dark opacity-50"></div>

              {/* Step 3: Active or Inactive based on step */}
              <div
                className={`flex flex-1 flex-col items-center gap-2 text-center transition-opacity duration-300 ${
                  step >= 3 ? "opacity-100" : "opacity-50"
                }`}
              >
                <div
                  className={`flex size-10 items-center justify-center rounded-full transition-all duration-300 ${
                    step >= 3
                      ? "bg-primary text-white shadow-lg shadow-primary/30"
                      : "bg-card-light border-2 border-border-light dark:bg-card-dark dark:border-border-dark"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      step >= 3
                        ? "text-white"
                        : "text-muted-light dark:text-muted-dark"
                    }`}
                  >
                    person
                  </span>
                </div>
                <span
                  className={`text-sm font-medium transition-colors duration-300 ${
                    step >= 3
                      ? "text-primary font-bold"
                      : "text-muted-light dark:text-muted-dark"
                  }`}
                >
                  Setup Profile
                </span>
              </div>
            </div>

            {/* Form Card */}
            <div className="w-full rounded-xl border border-border-light bg-card-light p-8 shadow-lg shadow-primary/5 dark:border-border-dark dark:bg-card-dark">
              <form onSubmit={handleNextStep} className="flex flex-col gap-6">
                {/* step 1, email & password */}
                {step === 1 && (
                  <div className="flex flex-col gap-6 animate-in slide-in-from-right-8 fade-in">
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

                {/* step 2, otp verification */}
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

                {/* step 3, profile setup*/}
                {step === 3 && (
                  <div className="flex flex-col gap-6 animate-in slide-in-from-right-8 fade-in">
                    <div className="flex gap-4">
                      <div className="flex-1 flex flex-col gap-1.5 text-left">
                        <label
                          className="text-sm font-medium text-foreground-light dark:text-foreground-dark"
                          htmlFor="firstName"
                        >
                          First Name
                        </label>
                        <input
                          id="firstName"
                          type="text"
                          placeholder="Alex"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          className="w-full rounded-lg border border-border-light bg-background-light py-3 px-4 text-base text-foreground-light outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-border-dark dark:bg-background-dark dark:text-foreground-dark"
                        />
                      </div>
                      <div className="flex-1 flex flex-col gap-1.5 text-left">
                        <label
                          className="text-sm font-medium text-foreground-light dark:text-foreground-dark"
                          htmlFor="lastName"
                        >
                          Last Name
                        </label>
                        <input
                          id="lastName"
                          type="text"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          className="w-full rounded-lg border border-border-light bg-background-light py-3 px-4 text-base text-foreground-light outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-border-dark dark:bg-background-dark dark:text-foreground-dark"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 text-left">
                      <label
                        className="text-sm font-medium text-foreground-light dark:text-foreground-dark"
                        htmlFor="major"
                      >
                        Major / Field of Study
                      </label>
                      <input
                        id="major"
                        type="text"
                        placeholder="Computer Science"
                        value={formData.major}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-border-light bg-background-light py-3 px-4 text-base text-foreground-light outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-border-dark dark:bg-background-dark dark:text-foreground-dark"
                      />
                    </div>
                  </div>
                )}

                {/* nav buttons*/}
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
                    className="group relative flex h-12 flex-[2] items-center justify-center rounded-full bg-primary px-6 text-base font-bold text-white shadow-lg shadow-primary/40 transition-transform duration-300 hover:scale-105 active:scale-95"
                  >
                    <span>{step === 3 ? "Finish" : "Continue"}</span>
                    <span className="material-symbols-outlined ml-2 text-[20px] transition-transform duration-300 group-hover:translate-x-1">
                      arrow_forward
                    </span>
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
