import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import DashboardNavbar from "../components/DashboardNavbar";
import {
  Users,
  Calendar,
  MapPin,
  Clock,
  Mail,
  Info,
  ChevronRight,
  Code,
  ArrowRight,
  Image as ImageIcon,
  CheckCircle,
  LogOut,
  Edit,
  Plus,
  Trash2,
} from "lucide-react";
import CreateEvent from "../components/CreateEvent";

const ClubDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [showEvents, setShowEvents] = useState(false);
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);

  // Helper: Check if current user is a member
  const isMember = club?.members?.some((member) => member._id === user?._id);
  const isAdmin = club?.admin?._id === user?._id;

  // fetch data
  useEffect(() => {
    const fetchClub = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const { data } = await axios.get(`${API_URL}/api/clubs/${id}`);
        setClub(data.data);
        const eventsRes = await axios.get(`${API_URL}/api/events/club/${id}`);
        setEvents(eventsRes.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load club details.");
      } finally {
        setLoading(false);
      }
    };
    fetchClub();
  }, [id]);

  // handle join/leave
  const handleJoinToggle = async () => {
    if (!user) return navigate("/login");
    setActionLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const endpoint = isMember ? "leave" : "join";

      const { data } = await axios.put(
        `${API_URL}/api/clubs/${id}/${endpoint}`,
        {},
        { withCredentials: true },
      );

      // Update local state with fresh data from backend
      setClub(data.data);
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  // refresh events after creating new one
  const refreshEvents = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await axios.get(`${API_URL}/api/events/club/${id}`);
      setEvents(res.data.data);
    } catch (err) {
      console.error("Failed to refresh events", err);
    }
  };

  //handle rsvp to event
  const handleRSVP = async (eventId) => {
    if (!user) return navigate("/login");

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      await axios.put(
        `${API_URL}/api/events/${eventId}/join`,
        {},
        { withCredentials: true },
      );
      refreshEvents();
    } catch (error) {
      console.error("Failed to RSVP to event", error);
    }
  };

  //handle delete event
  const handleDeleteEvent = async (eventId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this event? This cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      await axios.delete(`${API_URL}/api/events/${eventId}`, {
        withCredentials: true,
      });
      refreshEvents();
    } catch (err) {
      console.error(err);
      alert("Failed to delete event");
    }
  };

  //handle edit event
  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowEvents(true);
  };

  const openCreateModal = () => {
    setShowEvents(true);
    setEditingEvent(null);
  };

  // check if user has joined event
  const hasJoinedEvent = (event) => {
    return event.attendees.some((att) => (att._id || att) === user?._id);
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  if (error || !club)
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        {error || "Club not found"}
      </div>
    );

  return (
    <div className="flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-foreground-light dark:text-foreground-dark transition-colors duration-300">
      {/* navbar */}
      <DashboardNavbar />

      <main className="flex-grow pb-12 relative">
        {/* Background Blobs (Optional Visual Flair) */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-50">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[100px]"></div>
          <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-400/5 blur-[100px]"></div>
        </div>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/*breadcrumbs */}
          <div className="py-6 flex items-center gap-2 text-sm text-muted-light dark:text-muted-dark">
            <span
              className="hover:text-primary cursor-pointer"
              onClick={() => navigate("/dashboard")}
            >
              Home
            </span>
            <ChevronRight size={14} />
            <span
              className="hover:text-primary cursor-pointer"
              onClick={() => navigate("/explore")}
            >
              Explore
            </span>
            <ChevronRight size={14} />
            <span className="font-medium text-primary truncate max-w-[200px]">
              {club.name}
            </span>
          </div>

          {/* hero section */}
          <div className="relative w-full overflow-hidden rounded-2xl shadow-lg group mb-8 h-[300px] md:h-[350px]">
            {/* Cover Image */}
            <div
              className="absolute inset-0 bg-gray-200 dark:bg-gray-800 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage: `url(${club.image || "https://via.placeholder.com/1200x600"})`,
              }}
            ></div>
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

            {/* Hero Content */}
            <div className="relative flex h-full flex-col justify-end p-6 md:p-10">
              <div className="mb-4 flex items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-bold text-white border border-white/30 uppercase tracking-wide">
                  {club.category}
                </span>
                <span className="inline-flex items-center rounded-full bg-green-500/80 backdrop-blur-sm px-3 py-1 text-xs font-bold text-white shadow-sm">
                  Active Now
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-md mb-2">
                {club.name}
              </h1>
              <p className="text-white/90 font-medium max-w-2xl text-lg drop-shadow-sm line-clamp-2">
                Join the community building the future.
              </p>
            </div>
          </div>

          {/* main grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* left column*/}
            <div className="lg:col-span-8 flex flex-col gap-8">
              {/* about section */}
              <section className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/50 dark:border-gray-700 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Info size={20} />
                  </div>
                  <h3 className="text-xl font-bold">About Us</h3>
                </div>
                <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-muted-light dark:text-muted-dark leading-relaxed whitespace-pre-line">
                  {club.description}
                </div>
              </section>

              {/*gallery bento*/}
              <section>
                <div className="flex items-center justify-between mb-4 px-1">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <ImageIcon size={20} />
                    </div>
                    <h3 className="text-xl font-bold">Moments & Activities</h3>
                  </div>
                  <button className="text-sm font-bold text-primary hover:text-primary-hover flex items-center gap-1 transition-colors">
                    View Gallery <ArrowRight size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px]">
                  {/* large left image */}
                  <div className="relative w-full h-full rounded-2xl overflow-hidden group shadow-sm">
                    <img
                      src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800"
                      alt="Gallery Main"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="font-bold">Hackathon 2025</p>
                    </div>
                  </div>

                  {/* right column stack */}
                  <div className="flex flex-col gap-4 h-full">
                    <div className="relative flex-1 w-full rounded-2xl overflow-hidden group shadow-sm">
                      <img
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600"
                        alt="Gallery Top"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="relative flex-1 w-full rounded-2xl overflow-hidden group shadow-sm">
                      <img
                        src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=600"
                        alt="Gallery Bottom"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* upcoming events */}
              <section className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/50 dark:border-gray-700 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Calendar size={20} />
                    </div>
                    <h3 className="text-xl font-bold">Upcoming Events</h3>
                  </div>

                  {/* Only show this button if user is Admin */}
                  {isAdmin && (
                    <button
                      onClick={openCreateModal}
                      className="flex items-center gap-1 text-sm font-bold text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Plus size={16} /> Create Event
                    </button>
                  )}
                </div>

                {/* dynamic events list */}
                <div className="space-y-4">
                  {events.length > 0 ? (
                    events.map((event) => (
                      <div
                        key={event._id}
                        className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl hover:bg-white/40 dark:hover:bg-gray-700/50 border border-transparent hover:border-border-light dark:hover:border-gray-600 transition-all cursor-pointer group"
                      >
                        {/* Date Box */}
                        <div className="flex-shrink-0 w-full sm:w-24 h-24 sm:h-24 rounded-lg bg-primary/10 dark:bg-primary/20 flex flex-col items-center justify-center text-primary border border-primary/20">
                          <span className="text-xs font-bold uppercase tracking-wider">
                            {new Date(event.date).toLocaleString("default", {
                              month: "short",
                            })}
                          </span>
                          <span className="text-2xl font-bold">
                            {new Date(event.date).getDate()}
                          </span>
                        </div>

                        {/* Event Content */}
                        <div className="flex-1 flex flex-col justify-center">
                          <h4 className="text-lg font-bold group-hover:text-primary transition-colors">
                            {event.title}
                          </h4>
                          {isAdmin && (
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditEvent(event);
                                }}
                                className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit Event"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteEvent(event._id);
                                }}
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Event"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )}
                          <p className="text-sm text-muted-light dark:text-muted-dark mb-2 flex items-center gap-2">
                            <span className="flex items-center gap-1">
                              <Clock size={14} />
                              {new Date(event.date).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            <span className="hidden sm:inline">•</span>
                            <span className="flex items-center gap-1">
                              <MapPin size={14} /> {event.location}
                            </span>
                          </p>
                          <p className="text-sm text-muted-light dark:text-muted-dark line-clamp-1">
                            {event.description}
                          </p>
                        </div>

                        {/* Register Button */}
                        <div className="flex items-center sm:justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent clicking the card container
                              handleRSVP(event._id);
                            }}
                            className={`px-4 py-2 rounded-lg border text-sm font-bold transition-all shadow-sm ${
                              hasJoinedEvent(event)
                                ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200" // Joined State
                                : "bg-white dark:bg-gray-800 border-border-light dark:border-gray-600 hover:bg-primary/5 hover:text-primary hover:border-primary/30" // Default State
                            }`}
                          >
                            {hasJoinedEvent(event) ? (
                              <span className="flex items-center gap-1">
                                <CheckCircle size={14} /> Registered
                              </span>
                            ) : (
                              "Register"
                            )}
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    /* Empty State */
                    <div className="text-center py-8 text-gray-500">
                      <p>No upcoming events scheduled.</p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* sidebar */}
            <div className="lg:col-span-4 relative">
              <div className="sticky top-24 space-y-6">
                {/* action card */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl shadow-primary/5 border border-white/50 dark:border-gray-700">
                  {/* Join/Leave Button */}
                  <button
                    onClick={handleJoinToggle}
                    disabled={actionLoading}
                    className={`w-full py-3.5 px-4 rounded-xl font-bold text-lg shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 mb-6 ${
                      isAdmin
                        ? "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-default"
                        : isMember
                          ? "bg-red-50 dark:bg-red-900/20 text-red-600 border border-red-200 dark:border-red-900 hover:bg-red-100"
                          : "bg-primary hover:bg-primary-hover text-white shadow-primary/25"
                    }`}
                  >
                    {actionLoading ? (
                      "Processing..."
                    ) : isAdmin ? (
                      <>
                        {" "}
                        <Edit size={20} /> Edit Club{" "}
                      </>
                    ) : isMember ? (
                      <>
                        {" "}
                        <LogOut size={20} /> Leave Club{" "}
                      </>
                    ) : (
                      <>
                        {" "}
                        Join Club <ArrowRight size={20} />{" "}
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-muted-light dark:text-muted-dark">
                      Active Members
                    </span>
                    <span className="text-sm font-bold">
                      {club.members?.length || 0}
                    </span>
                  </div>

                  {/* avatar stack */}
                  <div className="flex -space-x-3 mb-6 overflow-hidden py-1 pl-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-300 dark:bg-gray-600"
                      ></div>
                    ))}
                    <div className="flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-100 dark:bg-gray-700 text-[10px] font-bold text-gray-500">
                      +{club.members?.length || 0}
                    </div>
                  </div>

                  <hr className="border-border-light dark:border-gray-700 mb-6" />

                  {/* Admin Profile */}
                  <div className="mb-2">
                    <h4 className="text-xs font-bold text-muted-light dark:text-muted-dark uppercase tracking-wider mb-3">
                      Club Admin
                    </h4>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-purple-400 flex items-center justify-center text-white font-bold text-lg">
                          {club.admin?.name?.charAt(0) || "A"}
                        </div>
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-800"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">
                          {club.admin?.name || "Admin"}
                        </p>
                        <p className="text-xs text-muted-light dark:text-muted-dark truncate">
                          {club.admin?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button className="w-full mt-4 py-2 px-4 bg-transparent border border-border-light dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2">
                    <Mail size={16} /> Contact Admin
                  </button>
                </div>

                {/* info card */}
                <div className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-5 border border-white/50 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-2 rounded-xl bg-purple-50 dark:bg-primary/10">
                      <div className="text-2xl font-bold text-primary">3</div>
                      <div className="text-xs text-muted-light dark:text-muted-dark font-medium">
                        Events/Mo
                      </div>
                    </div>
                    <div className="text-center p-2 rounded-xl bg-blue-50 dark:bg-blue-900/10">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        24
                      </div>
                      <div className="text-xs text-muted-light dark:text-muted-dark font-medium">
                        Projects
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* create event modal */}
      {showEvents && (
        <CreateEvent
          clubId={club._id} // Pass the club ID so backend knows where to put event
          onClose={() => setShowEvents(false)}
          eventToEdit={editingEvent}
          onEventCreated={() => {
            refreshEvents();
            setShowEvents(false);
            alert("Event Created Successfully!");
          }}
        />
      )}
    </div>
  );
};

export default ClubDetails;
