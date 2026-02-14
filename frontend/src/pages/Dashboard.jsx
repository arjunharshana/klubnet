import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import DashboardNavbar from "../components/DashboardNavbar.jsx";
import {
  ChevronRight,
  Users,
  Calendar,
  Clock,
  MapPin,
  Filter,
  ArrowRight,
  Shield,
  SearchX,
} from "lucide-react";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // State
  const [myClubs, setMyClubs] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  //auth check
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const API_URL = import.meta.env.VITE_API_URL;

        const [clubsRes, eventsRes] = await Promise.all([
          axios.get(`${API_URL}/api/clubs`),
          axios.get(`${API_URL}/api/events/myevents`, {
            withCredentials: true,
          }),
        ]);

        // filter my clubs
        const allClubs = clubsRes.data.data;
        const joinedClubs = allClubs.filter(
          (club) =>
            club.members.some(
              (member) => (member._id || member) === user._id,
            ) || (club.admin?._id || club.admin) === user._id,
        );
        setMyClubs(joinedClubs);

        //set events
        const sortedEvents = eventsRes.data.data
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .filter((e) => new Date(e.date) >= new Date());
        setUpcomingEvents(sortedEvents);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (authLoading || (!user && loading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark">
        Loading...
      </div>
    );
  }

  const today = new Date();
  const dateString = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Calculate events today
  const eventsToday = upcomingEvents.filter(
    (e) => new Date(e.date).toDateString() === today.toDateString(),
  ).length;

  return (
    <div className="flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-foreground-light dark:text-foreground-dark transition-colors duration-300">
      {/* Navbar */}
      <DashboardNavbar />

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto p-6 md:p-8 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          {/* left column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-1">
                Welcome back, {user?.name?.split(" ")[0]}
              </h1>
              <p className="text-muted-light dark:text-muted-dark text-base font-medium">
                Today is {dateString}
              </p>
            </div>

            {/* my clubs */}
            <div className="rounded-2xl border border-border-light dark:border-border-dark bg-card-light/50 dark:bg-card-dark/50 backdrop-blur-sm p-1 flex-1 flex flex-col min-h-[400px]">
              <div className="p-5 pb-2 flex items-center justify-between">
                <h2 className="text-lg font-bold">Your Clubs</h2>
                <Link
                  to="/profile"
                  className="text-primary text-xs font-bold hover:text-primary-hover uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full transition-colors"
                >
                  View All
                </Link>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                {loading ? (
                  <p className="text-center text-sm text-muted-light py-10">
                    Loading clubs...
                  </p>
                ) : myClubs.length > 0 ? (
                  myClubs.map((club) => {
                    const isAdmin =
                      (club.admin?._id || club.admin) === user._id;
                    return (
                      <div
                        key={club._id}
                        onClick={() => navigate(`/clubs/${club._id}`)}
                        className="group flex items-center gap-4 p-3 rounded-xl hover:bg-white/60 dark:hover:bg-gray-800/60 border border-transparent hover:border-border-light dark:hover:border-border-dark transition-all cursor-pointer"
                      >
                        {/* Club Icon */}
                        <div
                          className="size-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl shrink-0 border border-border-light dark:border-border-dark shadow-sm bg-cover bg-center"
                          style={{
                            backgroundImage: club.image
                              ? `url(${club.image})`
                              : undefined,
                          }}
                        >
                          {!club.image && club.name.charAt(0)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold truncate group-hover:text-primary transition-colors">
                              {club.name}
                            </h3>
                            {isAdmin && (
                              <Shield
                                size={12}
                                className="text-primary fill-primary/20"
                              />
                            )}
                          </div>
                          <p className="text-muted-light dark:text-muted-dark text-xs font-medium">
                            {club.category}
                          </p>
                        </div>
                        <ChevronRight
                          className="text-muted-light/50 group-hover:text-primary transition-colors"
                          size={20}
                        />
                      </div>
                    );
                  })
                ) : (
                  // Empty State
                  <div className="text-center py-10 px-4">
                    <div className="size-12 bg-muted-light/10 dark:bg-muted-dark/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="text-muted-light" size={24} />
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

          {/* Right Column (8 Cols): Calendar & Events */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Calendar Widget */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-border-light dark:border-border-dark bg-card-light/50 dark:bg-card-dark/50 backdrop-blur-sm p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold">
                    {today.toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    })}
                  </h2>
                  <div className="flex gap-2">
                    <button className="size-8 flex items-center justify-center rounded-full hover:bg-muted-light/20 dark:hover:bg-muted-dark/20 transition-colors">
                      <ChevronRight className="rotate-180" size={18} />
                    </button>
                    <button className="size-8 flex items-center justify-center rounded-full hover:bg-muted-light/20 dark:hover:bg-muted-dark/20 transition-colors">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>

                {/* calendaar */}
                <div className="grid grid-cols-7 gap-y-4 text-center text-sm">
                  {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                    <div
                      key={d}
                      className="text-muted-light/60 font-bold text-xs"
                    >
                      {d}
                    </div>
                  ))}
                  {/* highlight today */}
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <div
                      key={day}
                      className={`py-2 text-sm rounded-full w-8 h-8 mx-auto flex items-center justify-center ${
                        day === today.getDate()
                          ? "bg-primary text-white shadow-lg font-bold"
                          : "text-foreground-light dark:text-foreground-dark opacity-80"
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-border-light dark:border-border-dark">
                  <div className="flex items-center gap-3 bg-background-light/50 dark:bg-background-dark/50 p-3 rounded-xl border border-border-light dark:border-border-dark">
                    <div
                      className={`size-2 rounded-full shadow-md ${eventsToday > 0 ? "bg-green-500 shadow-green-500/20" : "bg-gray-400"}`}
                    ></div>
                    <span className="text-sm font-medium">
                      {eventsToday > 0
                        ? `${eventsToday} events today`
                        : "No events today"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Upcoming Events List */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Upcoming Events</h2>
                  <button className="size-8 flex items-center justify-center rounded-lg border border-border-light dark:border-border-dark hover:bg-card-light dark:hover:bg-card-dark transition-colors">
                    <Filter size={16} className="text-muted-light" />
                  </button>
                </div>

                <div className="flex flex-col gap-3 flex-1 overflow-y-auto max-h-[400px] custom-scrollbar">
                  {upcomingEvents.length > 0 ? (
                    upcomingEvents.map((event) => (
                      <div
                        key={event._id}
                        onClick={() => navigate(`/clubs/${event.club._id}`)}
                        className="rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-4 flex gap-4 items-start group hover:border-primary/40 hover:shadow-md transition-all cursor-pointer"
                      >
                        {/* Date Box */}
                        <div className="flex flex-col items-center justify-center bg-muted-light/20 dark:bg-muted-dark/20 rounded-lg w-16 h-16 border border-border-light dark:border-border-dark shrink-0 group-hover:bg-primary/10 transition-colors">
                          <span className="text-primary text-xs font-bold uppercase">
                            {new Date(event.date).toLocaleString("default", {
                              month: "short",
                            })}
                          </span>
                          <span className="text-xl font-bold">
                            {new Date(event.date).getDate()}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="text-lg font-bold leading-tight mb-1 group-hover:text-primary transition-colors truncate">
                              {event.title}
                            </h3>
                            {event.club && (
                              <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wide border border-primary/20 whitespace-nowrap">
                                {event.club.category || "Event"}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-4 mt-2 text-muted-light dark:text-muted-dark text-xs font-medium">
                            <div className="flex items-center gap-1.5">
                              <Clock size={14} />
                              {new Date(event.date).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                            <div className="flex items-center gap-1.5 truncate">
                              <MapPin size={14} />
                              <span className="truncate max-w-[100px]">
                                {event.location}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    // Empty Events State
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-border-light dark:border-border-dark rounded-xl bg-card-light/30 dark:bg-card-dark/30">
                      <Calendar className="text-muted-light mb-2" size={32} />
                      <p className="text-sm font-medium">No upcoming events</p>
                      <Link
                        to="/explore"
                        className="text-xs text-primary font-bold hover:underline mt-1"
                      >
                        Browse Events
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* additional sections will go here latr*/}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
