import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import DashboardNavbar from "../components/DashboardNavbar";
import {
  Search,
  Users,
  SearchX,
  ArrowRight,
  CheckCircle,
  Clock,
  Bell,
  Shield,
} from "lucide-react";

const CATEGORIES = [
  "All",
  "Tech",
  "Art",
  "Sports",
  "Music",
  "Business",
  "Social",
  "Science",
];

const Explore = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    if (!user && !authLoading) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  // fetch clubs from backend
  useEffect(() => {
    const fetchClubs = async () => {
      setLoading(true);
      try {
        const API_URL = import.meta.env.VITE_API_URL;

        // Build query params
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (category && category !== "All") params.append("category", category);

        const { data } = await axios.get(
          `${API_URL}/api/clubs?${params.toString()}`,
        );
        setClubs(data.data);
      } catch (error) {
        console.error("Failed to fetch clubs:", error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchClubs();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search, category]);

  const getUserStatus = (club) => {
    if (!user) return null;
    const userId = user._id;

    if ((club.admin?._id || club.admin) === userId) return "Admin";
    if (club.members?.some((m) => (m._id || m) === userId)) return "Member";
    if (club.joinRequests?.some((r) => (r._id || r) === userId))
      return "Pending";
    if (club.followers?.some((f) => (f._id || f) === userId))
      return "Following";

    return null;
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-foreground-light dark:text-foreground-dark transition-colors duration-300">
      <DashboardNavbar />

      <main className="flex-1 w-full max-w-[1440px] mx-auto p-6 md:p-8 lg:p-10 flex flex-col gap-8">
        {/*main section */}
        <div className="flex flex-col items-center justify-center gap-6 py-6 md:py-10 max-w-4xl mx-auto w-full text-center">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground-light dark:text-foreground-dark">
              Explore Clubs
            </h1>
            <p className="text-muted-light dark:text-muted-dark text-base max-w-lg mx-auto">
              Find your community, join events, and connect with students who
              share your passions.
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full relative group max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search
                className="text-muted-light group-focus-within:text-primary transition-colors"
                size={20}
              />
            </div>
            <input
              value={search}
              placeholder="Search for clubs"
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-4 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-2xl text-foreground-light dark:text-foreground-dark placeholder-muted-light/70 focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm outline-none transition-all text-base hover:shadow-md"
              type="text"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 w-full">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all transform hover:-translate-y-0.5 border ${
                  category === cat
                    ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                    : "bg-card-light dark:bg-card-dark text-muted-light dark:text-muted-dark border-border-light dark:border-border-dark hover:border-primary hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* clubs grid */}
        {loading ? (
          <div className="text-center py-20 text-muted-light">
            Loading clubs...
          </div>
        ) : clubs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {clubs.map((club) => {
              const status = getUserStatus(club); // Calculate status once

              return (
                <div
                  key={club._id}
                  className="group bg-card-light dark:bg-card-dark rounded-2xl overflow-hidden border border-border-light/60 dark:border-border-dark/60 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
                >
                  {/* card image */}
                  <div
                    className="h-48 bg-cover bg-center relative overflow-hidden bg-gray-200 dark:bg-gray-800"
                    style={{
                      backgroundImage: `url(${
                        club.image || "https://via.placeholder.com/300"
                      })`,
                    }}
                  >
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>

                    {/* Top Right Badges */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                      <span className="bg-white/95 dark:bg-black/80 backdrop-blur-md text-foreground-light dark:text-white text-xs font-bold px-2.5 py-1 rounded-lg border border-white/20 shadow-sm">
                        {club.category}
                      </span>

                      {/* Status Badge */}
                      {status === "Admin" && (
                        <span className="bg-purple-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
                          <Shield size={12} /> Admin
                        </span>
                      )}
                      {status === "Member" && (
                        <span className="bg-green-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
                          <CheckCircle size={12} /> Member
                        </span>
                      )}
                      {status === "Following" && (
                        <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
                          <Bell size={12} /> Following
                        </span>
                      )}
                      {status === "Pending" && (
                        <span className="bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
                          <Clock size={12} /> Pending
                        </span>
                      )}
                    </div>
                  </div>

                  {/* card content */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-bold mb-2 line-clamp-1 text-foreground-light dark:text-foreground-dark group-hover:text-primary transition-colors">
                      {club.name}
                    </h3>
                    <p className="text-muted-light dark:text-muted-dark text-sm line-clamp-2 mb-4 leading-relaxed">
                      {club.description}
                    </p>

                    {/* footer */}
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-border-light dark:border-border-dark">
                      <div className="flex items-center gap-1.5 text-muted-light dark:text-muted-dark text-xs font-semibold">
                        <Users size={16} />
                        <span>{club.members?.length || 0} Members</span>
                      </div>

                      {/* view details of club */}
                      <Link
                        to={`/clubs/${club._id}`}
                        className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold hover:bg-primary hover:text-white transition-all flex items-center gap-1"
                      >
                        View Details <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* empty state */
          <div className="text-center py-16">
            <div className="size-20 bg-muted-light/10 dark:bg-muted-dark/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchX className="text-muted-light" size={40} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground-light dark:text-foreground-dark">
              No clubs found
            </h3>
            <p className="text-muted-light dark:text-muted-dark">
              Try adjusting your search or filters to find what you're looking
              for.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Explore;
