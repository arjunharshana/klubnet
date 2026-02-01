import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { Sun, Moon, LogOut, User, Settings, Bell } from "lucide-react";

const DashboardNavbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Local state for dropdowns
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${API_URL}/api/notifications`, {
          withCredentials: true,
        });
        setNotifications(response.data.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Helper to close menus
  const closeAll = () => {
    setShowProfileMenu(false);
    setShowNotifications(false);
  };

  const location = useLocation(); // <--- Add this hook

  const getLinkClass = (path) => {
    return location.pathname === path
      ? "text-primary font-bold transition-colors"
      : "text-muted-light dark:text-muted-dark font-medium hover:text-primary transition-colors";
  };

  const handleNotificationClick = async (notification) => {
    setShowNotifications(false);

    if (notification.link) navigate(notification.link);

    // If already read, do nothing
    if (notification.isRead) return;

    // mark as read in backend
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      await axios.put(
        `${API_URL}/api/notifications/${notification._id}/read`,
        {},
        { withCredentials: true },
      );

      // update local state
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notification._id ? { ...n, isRead: true } : n,
        ),
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };
  return (
    <>
      {/* */}
      {(showProfileMenu || showNotifications) && (
        <div className="fixed inset-0 z-40" onClick={closeAll}></div>
      )}

      {/*Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border-light/80 dark:border-border-dark/60 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-xl">
        <div className="px-6 md:px-10 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group z-50">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-white shadow-lg shadow-primary/30 transition-transform group-hover:scale-105">
              <svg className="size-6" fill="currentColor" viewBox="0 0 48 48">
                <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight text-foreground-light dark:text-foreground-dark">
              KlubNet
            </h2>
          </Link>

          {/* Center: Search (Hidden on mobile) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 z-50">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-light">
                search
              </span>
              <input
                type="text"
                placeholder="Search clubs, events..."
                className="w-full h-10 pl-10 pr-4 rounded-full bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm text-foreground-light dark:text-foreground-dark"
              />
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-sm mr-auto ml-6 z-50">
            <Link to="/dashboard" className={getLinkClass("/dashboard")}>
              Home
            </Link>
            <Link to="/explore" className={getLinkClass("/explore")}>
              Explore
            </Link>
            <Link to="/messages" className={getLinkClass("/messages")}>
              Messages
            </Link>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 sm:gap-5 z-50">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-muted-light/10 dark:hover:bg-muted-dark/10 transition-colors text-muted-light dark:text-muted-dark"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full hover:bg-muted-light/10 dark:hover:bg-muted-dark/10 transition-colors text-muted-light dark:text-muted-dark"
              >
                <Bell size={20} />
                {/* Dynamic Red Dot */}
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full border-2 border-background-light dark:border-background-dark"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 rounded-xl bg-white dark:bg-gray-800 border border-border-light dark:border-gray-700 shadow-xl overflow-hidden z-50">
                  <div className="p-4 border-b border-border-light dark:border-gray-700 flex justify-between items-center">
                    <h3 className="font-bold text-sm text-foreground-light dark:text-foreground-dark">
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                        {unreadCount} New
                      </span>
                    )}
                  </div>

                  <div className="max-h-64 overflow-y-auto p-0">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div
                          key={n._id}
                          className={`p-3 border-b border-border-light/50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer flex gap-3 items-start ${
                            !n.isRead ? "bg-primary/5" : ""
                          }`}
                          onClick={() => {
                            handleNotificationClick(n);
                          }}
                        >
                          <div
                            className={`size-2 mt-2 rounded-full shrink-0 ${!n.isRead ? "bg-primary" : "bg-gray-300"}`}
                          ></div>
                          <div>
                            <p
                              className={`text-sm leading-tight text-foreground-light dark:text-foreground-dark ${!n.isRead ? "font-bold" : "font-medium"}`}
                            >
                              {n.message}
                            </p>
                            <p className="text-xs text-muted-light dark:text-muted-dark mt-1">
                              {new Date(n.createdAt).toLocaleDateString()} •{" "}
                              {new Date(n.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-muted-light dark:text-muted-dark text-sm">
                        No notifications yet.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Create Club Button */}
            <Link
              to="/create-club"
              className="hidden sm:flex h-9 items-center px-4 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-full shadow-lg shadow-primary/25 transition-transform hover:scale-105 active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px] mr-2">
                add
              </span>
              Create Club
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="size-9 rounded-full bg-gradient-to-br from-primary to-purple-600 p-[2px] cursor-pointer shadow-md transition-transform hover:scale-105"
              >
                <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                  <span className="font-bold text-primary text-sm">
                    {(user?.name?.charAt(0) || "U").toUpperCase()}
                  </span>
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-white dark:bg-gray-800 border border-border-light dark:border-gray-700 shadow-xl overflow-hidden">
                  <div className="p-4 border-b border-border-light dark:border-gray-700">
                    <p className="font-bold text-sm truncate text-foreground-light dark:text-foreground-dark">
                      {user?.name}
                    </p>
                    <p className="text-xs text-muted-light dark:text-muted-dark truncate">
                      {user?.email}
                    </p>
                  </div>
                  <div className="p-2">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-foreground-light dark:text-foreground-dark"
                    >
                      <User size={16} /> Profile
                    </Link>
                    {user?.role === "superadmin" && (
                      <Link
                        to="/super-admin"
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-600 dark:text-purple-400 transition-colors"
                      >
                        <Shield size={16} /> Admin Console
                      </Link>
                    )}
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left text-foreground-light dark:text-foreground-dark">
                      <Settings size={16} /> Settings
                    </button>
                  </div>
                  <div className="p-2 border-t border-border-light dark:border-gray-700">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-left"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default DashboardNavbar;
