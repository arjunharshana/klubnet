import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import DashboardNavbar from "../components/DashboardNavbar";
import ProfileSettings from "../components/ProfileSettings";
import {
  Edit,
  MapPin,
  Grid,
  Calendar,
  Search,
  ArrowRight,
  Megaphone,
  Clock,
  Settings,
} from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State
  const [myClubs, setMyClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("My Clubs");
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("Most Active");
  const [myEvents, setMyEvents] = useState([]);

  // fetch joined clubs and events
  useEffect(() => {
    const fetchJoinedClubs = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;

        // Parallel fetching for speed
        const [clubsRes, eventsRes] = await Promise.all([
          axios.get(`${API_URL}/api/clubs`),
          axios.get(`${API_URL}/api/events/myevents`, {
            withCredentials: true,
          }),
        ]);

        if (user) {
          // Filter clubs
          const joined = clubsRes.data.data.filter((club) =>
            club.members.some((member) => member._id === user._id),
          );
          setMyClubs(joined);
          setMyEvents(eventsRes.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch profile data", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchJoinedClubs();
  }, [user]);

  // Helper to determine role
  const getRole = (club) => {
    return club.admin?._id === user?._id ? "Admin" : "Member";
  };

  // sorting function
  const getSortedClubs = () => {
    let filtered = myClubs.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()),
    );

    switch (sortOption) {
      case "A-Z":
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      case "Role":
        // Admins first
        return filtered.sort((a, b) => {
          const roleA = getRole(a);
          const roleB = getRole(b);
          if (roleA === roleB) return 0;
          return roleA === "Admin" ? -1 : 1;
        });
      default: // most active
        return filtered;
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-foreground-light dark:text-foreground-dark transition-colors duration-300">
      <DashboardNavbar />

      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* profile card */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 flex flex-col items-center text-center relative overflow-hidden border border-white/50 dark:border-gray-700 shadow-sm">
              {/* Decorative Header */}
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-primary/10 to-transparent"></div>

              {/* Avatar */}
              <div className="relative z-10 mb-4">
                <div className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 shadow-md bg-gradient-to-br from-purple-400 to-primary flex items-center justify-center text-4xl text-white font-bold overflow-hidden">
                  {/* Show Image if available, else Initial */}
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user?.name?.charAt(0).toUpperCase()
                  )}
                </div>
                <div
                  className="absolute bottom-1 right-1 bg-green-500 border-2 border-white dark:border-gray-800 size-5 rounded-full"
                  title="Online"
                ></div>
              </div>

              {/* user info */}
              <h1 className="text-2xl font-bold mb-1">{user?.name}</h1>
              <p className="text-primary font-medium bg-primary/5 px-3 py-1 rounded-full text-sm mb-6">
                {user?.email}
              </p>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-3 w-full mb-6">
                <div className="flex flex-col items-center p-3 rounded-xl bg-white/50 dark:bg-gray-700/50 border border-white/60 dark:border-gray-600">
                  <span className="text-2xl font-bold">{myClubs.length}</span>
                  <span className="text-xs text-muted-light dark:text-muted-dark uppercase tracking-wide font-semibold">
                    Clubs
                  </span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-xl bg-white/50 dark:bg-gray-700/50 border border-white/60 dark:border-gray-600">
                  <span className="text-2xl font-bold">{myEvents.length}</span>
                  <span className="text-xs text-muted-light dark:text-muted-dark uppercase tracking-wide font-semibold">
                    Events
                  </span>
                </div>
              </div>

              {/* edit button */}
              <button
                onClick={() => setActiveTab("Settings")}
                className="w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 font-bold py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-600 transition-all shadow-sm mb-6"
              >
                <Edit size={18} />
                <span>Edit Profile</span>
              </button>
            </div>

            {/* Mini Calendar Widget */}
            <div className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-5 border border-white/50 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-sm text-muted-light dark:text-muted-dark uppercase tracking-wider mb-4">
                On your calendar
              </h3>

              <div className="space-y-3">
                {myEvents.length > 0 ? (
                  myEvents.slice(0, 3).map((event) => (
                    <div
                      key={event._id}
                      className="flex gap-3 items-start cursor-pointer hover:bg-white/50 dark:hover:bg-gray-700/30 p-2 rounded-lg transition-colors"
                      onClick={() => navigate(`/clubs/${event.club._id}`)}
                    >
                      {/* Date Box */}
                      <div className="bg-primary/10 text-primary rounded-lg p-2 min-w-[50px] flex flex-col items-center justify-center text-xs font-bold leading-tight">
                        <span className="uppercase">
                          {new Date(event.date).toLocaleString("default", {
                            month: "short",
                          })}
                        </span>
                        <span className="text-lg">
                          {new Date(event.date).getDate()}
                        </span>
                      </div>
                      {/* Info */}
                      <div>
                        <p className="text-foreground-light dark:text-foreground-dark font-bold text-sm line-clamp-1">
                          {event.title}
                        </p>
                        <p className="text-muted-light dark:text-muted-dark text-xs mt-1">
                          {new Date(event.date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex gap-3 items-start opacity-60">
                    <p className="text-sm italic text-muted-light dark:text-muted-dark">
                      No upcoming events.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* tabs and content */}
          <section className="lg:col-span-8 flex flex-col h-full">
            {/* Tab Navigation */}
            <div className="mb-6 space-y-4">
              <div className="flex items-center gap-8 border-b border-gray-200 dark:border-gray-700 px-2">
                {["My Clubs", "Events", "Settings"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-base font-medium transition-colors relative ${
                      activeTab === tab
                        ? "text-primary font-bold"
                        : "text-muted-light dark:text-muted-dark hover:text-foreground-light dark:hover:text-foreground-dark"
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <span className="absolute bottom-0 left-0 w-full h-[3px] bg-primary rounded-t-full"></span>
                    )}
                  </button>
                ))}
              </div>

              {/* search & sort */}
              {activeTab === "My Clubs" && (
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="relative w-full sm:w-auto flex-grow max-w-md">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search your clubs..."
                      className="w-full pl-10 pr-4 py-2.5 bg-white/60 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium placeholder:text-gray-400 shadow-sm backdrop-blur-sm dark:text-white"
                    />
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-sm font-medium text-muted-light dark:text-muted-dark whitespace-nowrap">
                      Sort by:
                    </span>
                    <div className="relative w-full sm:w-40">
                      <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="w-full appearance-none bg-white/60 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-sm font-bold py-2.5 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer shadow-sm dark:text-white"
                      >
                        <option value="Most Active">Most Active</option>
                        <option value="Role">Role (Admin First)</option>
                        <option value="A-Z">A-Z</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* tab content */}

            {/* my clubs */}
            {activeTab === "My Clubs" && (
              <div className="flex flex-col gap-4">
                {loading ? (
                  <p className="text-center py-10 opacity-60">
                    Loading clubs...
                  </p>
                ) : getSortedClubs().length > 0 ? (
                  getSortedClubs().map((club) => (
                    <article
                      key={club._id}
                      className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl p-5 flex flex-col md:flex-row gap-5 items-start border border-white/50 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
                    >
                      {/* Logo */}
                      <div className="flex-shrink-0">
                        <div
                          className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-700 bg-center bg-cover shadow-inner"
                          style={{
                            backgroundImage: `url(${club.image || "https://via.placeholder.com/150"})`,
                          }}
                        ></div>
                      </div>

                      {/* Info */}
                      <div className="flex-grow min-w-0 w-full">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-bold">{club.name}</h3>
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide ${
                                getRole(club) === "Admin"
                                  ? "bg-primary/10 text-primary"
                                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {getRole(club)}
                            </span>
                          </div>
                        </div>

                        <p className="text-muted-light dark:text-muted-dark text-sm mb-3 line-clamp-1">
                          {club.description}
                        </p>

                        {/* Action */}
                        <div className="flex-shrink-0 self-end md:self-center mt-2 md:mt-0 w-full md:w-auto">
                          <button
                            onClick={() => navigate(`/clubs/${club._id}`)}
                            className="w-full md:w-auto bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 font-bold py-2 px-4 rounded-lg text-sm border border-gray-200 dark:border-gray-600 transition-colors flex items-center justify-center gap-2"
                          >
                            View Club <ArrowRight size={16} />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="text-center py-10 opacity-60">
                    <Grid size={48} className="mx-auto mb-2" />
                    <p>You haven't joined any clubs yet.</p>
                    <Link
                      to="/explore"
                      className="text-primary font-bold hover:underline"
                    >
                      Explore Clubs
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* events */}
            {activeTab === "Events" && (
              <div className="flex flex-col gap-4">
                {myEvents.length > 0 ? (
                  myEvents.map((event) => (
                    <div
                      key={event._id}
                      className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl p-5 flex flex-col md:flex-row gap-5 items-center border border-white/50 dark:border-gray-700 shadow-sm hover:shadow-md transition-all cursor-pointer"
                      onClick={() => navigate(`/clubs/${event.club._id}`)}
                    >
                      {/* Date Badge */}
                      <div className="flex-shrink-0 w-full md:w-20 h-20 rounded-xl bg-primary/5 flex flex-col items-center justify-center text-primary border border-primary/10">
                        <span className="text-sm font-bold uppercase">
                          {new Date(event.date).toLocaleString("default", {
                            month: "short",
                          })}
                        </span>
                        <span className="text-3xl font-bold">
                          {new Date(event.date).getDate()}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-grow min-w-0 text-center md:text-left">
                        <h3 className="text-lg font-bold text-foreground-light dark:text-foreground-dark">
                          {event.title}
                        </h3>
                        <p className="text-sm text-muted-light dark:text-muted-dark mb-1 flex items-center justify-center md:justify-start gap-2">
                          <span className="flex items-center gap-1">
                            <Clock size={14} />{" "}
                            {new Date(event.date).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin size={14} /> {event.location}
                          </span>
                        </p>
                        <p className="text-sm text-primary font-medium flex items-center justify-center md:justify-start gap-1">
                          Hosted by {event.club?.name}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 opacity-50">
                    <Calendar size={48} className="mx-auto mb-4" />
                    <p className="font-bold">
                      You haven't joined any events yet.
                    </p>
                    <button
                      onClick={() => navigate("/explore")}
                      className="text-primary hover:underline text-sm mt-2"
                    >
                      Find events to join
                    </button>
                  </div>
                )}
              </div>
            )}

            {/*settings tab */}
            {activeTab === "Settings" && (
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl p-8 border border-white/50 dark:border-gray-700 shadow-sm text-just">
                {/* Settings Icon */}
                <ProfileSettings />
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Profile;
