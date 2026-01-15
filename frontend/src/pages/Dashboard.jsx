import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { Sun, Moon, LogOut, User, Settings, Bell, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [myClubs, setMyClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeDropdowns = () => {
    setShowProfileMenu(false);
    setShowNotifications(false);
  };

  // useEffect(() => {
  //   // If auth check is done and there is no user
  //   if (!authLoading && !user) {
  //     navigate("/login"); // redirect to login
  //   }
  // }, [user, authLoading, navigate]);

  const { theme, toggleTheme } = useTheme();
  // fetch user's clubs
  useEffect(() => {
    const fetchMyClubs = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const { data } = await axios.get(`${API_URL}/api/clubs`);

        // Filter clubs where the current user is a member
        const joined = data.data.filter((club) =>
          club.members.some((member) => member._id === user?._id)
        );
        setMyClubs(joined);
      } catch (err) {
        console.error("Failed to fetch clubs", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchMyClubs();
    else setLoading(false);
  }, [user]);

  // if (authLoading) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark">
  //       Loading...
  //     </div>
  //   );
  // }

  // Helper for Greetings
  const today = new Date();
  const dateString = today.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className="flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-foreground-light dark:text-foreground-dark transition-colors duration-300"
      onClick={closeDropdowns}
    >
      {/* navbar */}

      <header className="sticky top-0 z-50 w-full border-b border-border-light/80 dark:border-border-dark/60 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-xl">
        <div className="px-6 md:px-10 py-3 flex items-center justify-between gap-4">
          {}
          <div className="flex items-center gap-8 w-full md:w-auto">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 shrink-0 group">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-white shadow-lg shadow-primary/30 transition-transform group-hover:scale-105">
                <svg className="size-6" fill="currentColor" viewBox="0 0 48 48">
                  <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z"></path>
                </svg>
              </div>
              <h2 className="text-xl font-extrabold tracking-tight text-foreground-light dark:text-foreground-dark">
                KlubNet
              </h2>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md w-64">
              <label className="flex items-center w-full h-10 bg-card-light dark:bg-card-dark rounded-full border border-border-light dark:border-border-dark focus-within:border-primary/50 transition-all shadow-sm px-3">
                <span className="material-symbols-outlined text-muted-light dark:text-muted-dark">
                  search
                </span>
                <input
                  className="w-full bg-transparent border-none text-sm text-foreground-light dark:text-foreground-dark placeholder-muted-light/60 focus:ring-0 px-2 outline-none"
                  placeholder="Search clubs, events..."
                  type="text"
                />
              </label>
            </div>
          </div>

          {/* Right: Nav Actions */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="flex size-9 items-center justify-center rounded-full border border-border-light bg-card-light text-muted-light transition-colors hover:bg-muted-light/10 hover:text-primary dark:border-border-dark dark:bg-card-dark dark:text-muted-dark dark:hover:text-primary"
            >
              {theme === "light" ? (
                <Moon className="size-4" />
              ) : (
                <Sun className="size-4" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full hover:bg-muted-light/10 dark:hover:bg-muted-dark/10 transition-colors text-muted-light dark:text-muted-dark"
              >
                <Bell size={20} />
                {/* Red Dot Badge */}
                <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full border-2 border-background-light dark:border-background-dark"></span>
              </button>

              {/* Dropdown popup */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 rounded-xl bg-white dark:bg-gray-800 border border-border-light dark:border-gray-700 shadow-xl z-50 overflow-hidden">
                  <div className="p-4 border-b border-border-light dark:border-gray-700">
                    <h3 className="font-bold text-sm">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto p-2">
                    {/* Dummy Notification Item */}
                    <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg cursor-pointer flex gap-3 items-start">
                      <div className="size-2 mt-2 rounded-full bg-primary shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium leading-tight">
                          New Event in Coding Club
                        </p>
                        <p className="text-xs text-muted-light dark:text-muted-dark mt-1">
                          2 hours ago
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Create Club Button */}
            <Link
              to="/create-club"
              className="hidden sm:flex h-9 items-center px-4 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-full transition-transform hover:scale-105 shadow-lg shadow-primary/25"
            >
              <span className="material-symbols-outlined text-[18px] mr-2">
                add
              </span>
              Create Club
            </Link>

            {/* User Avatar */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="size-9 rounded-full bg-gradient-to-br from-primary to-purple-600 p-[2px] cursor-pointer shadow-md transition-transform hover:scale-105"
              >
                <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                  {/* Shows user's initial */}
                  <span className="font-bold text-primary text-sm">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
              </button>

              {/* The Profile Popup */}
              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-white dark:bg-gray-800 border border-border-light dark:border-gray-700 shadow-xl z-50 overflow-hidden">
                  {/* User Info */}
                  <div className="p-4 border-b border-border-light dark:border-gray-700">
                    <p className="font-bold text-sm truncate">{user?.name}</p>
                    <p className="text-xs text-muted-light dark:text-muted-dark truncate">
                      {user?.email}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <User size={16} /> Profile
                    </Link>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left">
                      <Settings size={16} /> Settings
                    </button>
                  </div>

                  {/* LOGOUT BUTTON */}
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

      {/* main dashboard content */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto p-6 md:p-8 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          {/* left column (4 cols): profile & my clubs */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-1">
                Welcome back, {user?.name?.split(" ")[0]}
              </h1>
              <p className="text-muted-light dark:text-muted-dark text-base font-medium">
                Today is {dateString}
              </p>
            </div>

            {/* My Clubs Panel */}
            <div className="rounded-2xl border border-border-light dark:border-border-dark bg-card-light/50 dark:bg-card-dark/50 backdrop-blur-sm p-1 flex-1 flex flex-col min-h-[400px]">
              <div className="p-5 pb-2 flex items-center justify-between">
                <h2 className="text-lg font-bold">Your Clubs</h2>
                <button className="text-primary text-xs font-bold hover:text-primary-hover uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full transition-colors">
                  View All
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {loading ? (
                  <p className="text-center text-sm text-muted-light py-10">
                    Loading clubs...
                  </p>
                ) : myClubs.length > 0 ? (
                  myClubs.map((club) => (
                    <div
                      key={club._id}
                      className="group flex items-center gap-4 p-3 rounded-xl hover:bg-white/60 dark:hover:bg-gray-800/60 border border-transparent hover:border-border-light dark:hover:border-border-dark transition-all cursor-pointer"
                    >
                      {/* Club Icon Placeholder */}
                      <div className="size-12 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-xl shrink-0 border border-border-light dark:border-border-dark shadow-sm">
                        {club.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold truncate group-hover:text-primary transition-colors">
                          {club.name}
                        </h3>
                        <p className="text-muted-light dark:text-muted-dark text-xs font-medium">
                          {club.category}
                        </p>
                      </div>
                      <span className="material-symbols-outlined text-muted-light/50 group-hover:text-primary transition-colors text-xl">
                        chevron_right
                      </span>
                    </div>
                  ))
                ) : (
                  // Empty State
                  <div className="text-center py-10 px-4">
                    <div className="size-12 bg-muted-light/10 dark:bg-muted-dark/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="material-symbols-outlined text-muted-light">
                        groups
                      </span>
                    </div>
                    <p className="text-sm font-medium mb-2">
                      No clubs joined yet
                    </p>
                    <Link
                      to="/explore"
                      className="text-xs text-primary font-bold hover:underline"
                    >
                      Explore Communities
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* right column */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Calendar Widget */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-border-light dark:border-border-dark bg-card-light/50 dark:bg-card-dark/50 backdrop-blur-sm p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold">January 2026</h2>
                  <div className="flex gap-2">
                    <button className="size-8 flex items-center justify-center rounded-full hover:bg-muted-light/20 dark:hover:bg-muted-dark/20 transition-colors">
                      <span className="material-symbols-outlined text-lg">
                        chevron_left
                      </span>
                    </button>
                    <button className="size-8 flex items-center justify-center rounded-full hover:bg-muted-light/20 dark:hover:bg-muted-dark/20 transition-colors">
                      <span className="material-symbols-outlined text-lg">
                        chevron_right
                      </span>
                    </button>
                  </div>
                </div>
                {/* Visual Grid representing Calendar */}
                <div className="grid grid-cols-7 gap-y-4 text-center text-sm">
                  {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                    <div
                      key={d}
                      className="text-muted-light/60 font-bold text-xs"
                    >
                      {d}
                    </div>
                  ))}
                  {/* Dummy Days */}
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <div
                      key={day}
                      className={`py-2 text-sm ${
                        day === 24
                          ? "bg-primary text-white rounded-full shadow-lg font-bold"
                          : "text-foreground-light dark:text-foreground-dark opacity-80"
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-border-light dark:border-border-dark">
                  <div className="flex items-center gap-3 bg-background-light/50 dark:bg-background-dark/50 p-3 rounded-xl border border-border-light dark:border-border-dark">
                    <div className="size-2 rounded-full bg-green-500 shadow-md shadow-green-500/20"></div>
                    <span className="text-sm font-medium">3 events today</span>
                  </div>
                </div>
              </div>

              {/* Upcoming Events List */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Upcoming Events</h2>
                  <button className="size-8 flex items-center justify-center rounded-lg border border-border-light dark:border-border-dark hover:bg-card-light dark:hover:bg-card-dark transition-colors">
                    <span className="material-symbols-outlined text-lg text-muted-light">
                      filter_list
                    </span>
                  </button>
                </div>

                <div className="flex flex-col gap-3 flex-1">
                  {/* Event Card 1 */}
                  <div className="rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-4 flex gap-4 items-start group hover:border-primary/40 hover:shadow-md transition-all cursor-pointer">
                    <div className="flex flex-col items-center justify-center bg-muted-light/20 dark:bg-muted-dark/20 rounded-lg w-16 h-16 border border-border-light dark:border-border-dark shrink-0 group-hover:bg-primary/10 transition-colors">
                      <span className="text-primary text-xs font-bold uppercase">
                        Oct
                      </span>
                      <span className="text-xl font-bold">25</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold leading-tight mb-1 group-hover:text-primary transition-colors">
                          Hackathon Kickoff
                        </h3>
                        <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wide border border-primary/20">
                          Tech
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-muted-light dark:text-muted-dark text-xs font-medium">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm">
                            schedule
                          </span>{" "}
                          6:00 PM
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm">
                            location_on
                          </span>{" "}
                          Student Center
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Event Card 2 */}
                  <div className="rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-4 flex gap-4 items-start group hover:border-primary/40 hover:shadow-md transition-all cursor-pointer">
                    <div className="flex flex-col items-center justify-center bg-muted-light/20 dark:bg-muted-dark/20 rounded-lg w-16 h-16 border border-border-light dark:border-border-dark shrink-0 group-hover:bg-primary/10 transition-colors">
                      <span className="text-primary text-xs font-bold uppercase">
                        Oct
                      </span>
                      <span className="text-xl font-bold">27</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold leading-tight mb-1 group-hover:text-primary transition-colors">
                          Guest Speaker
                        </h3>
                        <span className="bg-blue-500/10 text-blue-500 text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wide border border-blue-500/20">
                          Debate
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-muted-light dark:text-muted-dark text-xs font-medium">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm">
                            schedule
                          </span>{" "}
                          2:00 PM
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm">
                            location_on
                          </span>{" "}
                          Aud B
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations Row */}
            <div className="mt-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Discover New Communities</h2>
                <a
                  href="#"
                  className="text-sm font-bold text-primary hover:underline"
                >
                  See Recommendations
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Rec Card 1 */}
                <div className="rounded-2xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark overflow-hidden group hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="h-32 bg-gray-200 dark:bg-gray-800 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-3 left-4">
                      <h3 className="text-white font-bold text-lg drop-shadow-md">
                        Photography Club
                      </h3>
                      <p className="text-white/90 text-xs font-medium">
                        128 Members
                      </p>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="size-8 rounded-full border-2 border-white dark:border-gray-700 bg-gray-300 dark:bg-gray-600"
                        ></div>
                      ))}
                    </div>
                    <button className="px-4 py-1.5 rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-white text-xs font-bold transition-all">
                      Join
                    </button>
                  </div>
                </div>

                {/* Rec Card 2 */}
                <div className="rounded-2xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark overflow-hidden group hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="h-32 bg-gray-200 dark:bg-gray-800 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-3 left-4">
                      <h3 className="text-white font-bold text-lg drop-shadow-md">
                        eSports League
                      </h3>
                      <p className="text-white/90 text-xs font-medium">
                        342 Members
                      </p>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="size-8 rounded-full border-2 border-white dark:border-gray-700 bg-gray-300 dark:bg-gray-600"
                        ></div>
                      ))}
                    </div>
                    <button className="px-4 py-1.5 rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-white text-xs font-bold transition-all">
                      Join
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
