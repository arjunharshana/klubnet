import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const path = location.pathname;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-light/80 dark:border-border-dark/60 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-xl">
      <div className="relative container mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
        {/* logo */}
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex size-10 items-center justify-center rounded-lg bg-primary text-white shadow-lg shadow-primary/30"
          >
            <svg className="size-6" fill="currentColor" viewBox="0 0 48 48">
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

        {/* navigation */}
        <div className="flex items-center gap-4">
          {user ? (
            // when user is logged in
            <>
              <span className="hidden sm:inline text-sm font-medium text-foreground-light dark:text-foreground-dark">
                Hi, {user.name}
              </span>
              <button
                onClick={logout}
                className="flex h-10 items-center justify-center rounded-full border border-border-light bg-card-light px-5 text-sm font-bold text-red-500 transition-colors hover:bg-red-50 dark:border-border-dark dark:bg-card-dark dark:hover:bg-red-900/20"
              >
                Logout
              </button>
            </>
          ) : (
            // when user is not logged in
            <>
              {/* on the home page */}
              {path === "/" && (
                <nav className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-1 rounded-full border border-border-light bg-background-light/50 p-1 backdrop-blur-md dark:border-border-dark dark:bg-card-dark/50">
                  <a
                    className="rounded-full px-4 py-2 text-sm font-medium text-text transition-colors hover:text-primary"
                    href="#"
                  >
                    Home
                  </a>
                  <a
                    className="rounded-full px-4 py-2 text-sm font-medium text-text/60 transition-colors hover:text-primary"
                    href="#features"
                  >
                    Features
                  </a>
                  <a
                    className="rounded-full px-4 py-2 text-sm font-medium text-text/60 transition-colors hover:text-primary"
                    href="#about"
                  >
                    About
                  </a>
                </nav>
              )}

              {path === "/" && (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-bold text-muted-light hover:text-primary dark:text-muted-dark transition-colors"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-bold text-white shadow-lg shadow-primary/30 transition-transform hover:scale-105 active:scale-95"
                  >
                    <span>Sign Up</span>
                  </Link>
                </>
              )}

              {/* on the register page */}
              {path === "/register" && (
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
              )}

              {/* on the login page */}
              {path === "/login" && (
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline text-sm text-muted-light dark:text-muted-dark">
                    Don't have an account?
                  </span>
                  <Link
                    to="/register"
                    className="flex h-11 items-center justify-center rounded-full px-5 text-base font-bold text-primary transition-colors hover:bg-primary/10"
                  >
                    <span>Sign up</span>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
