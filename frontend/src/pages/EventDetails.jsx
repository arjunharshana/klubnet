import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import DashboardNavbar from "../components/DashboardNavbar";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Hourglass,
  Ticket,
  Share2,
  Mic,
  Coffee,
  Edit,
  Image as ImageIcon,
  Paperclip,
  ShieldAlert,
  Download,
  FileText,
  CheckCircle,
} from "lucide-react";

const EventDetails = () => {
  const params = useParams();
  const eventId = params.eventId || params.id;

  const { user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [announcementText, setAnnouncementText] = useState("");
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  // Fetch Event Data from Backend
  const fetchEventData = useCallback(async () => {
    if (!eventId || eventId === "undefined") {
      setLoading(false);
      return;
    }

    try {
      const API_URL =
        import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URI;
      const res = await axios.get(`${API_URL}/api/events/${eventId}`, {
        withCredentials: true,
      });

      const eventData = res.data.data;
      setEvent(eventData);

      // Verify Admin Status securely
      if (user && eventData.club) {
        const clubAdmins = eventData.club.admins || [];
        const isUserAdmin =
          clubAdmins.some(
            (adminId) =>
              (adminId._id || adminId).toString() === user._id.toString(),
          ) || user.roles?.includes("superadmin");

        setIsAdmin(isUserAdmin);
      }
    } catch (err) {
      console.error("Error fetching event details:", err);
    } finally {
      setLoading(false);
    }
  }, [eventId, user]);

  useEffect(() => {
    fetchEventData();
  }, [fetchEventData]);

  // Live Countdown Timer logic
  useEffect(() => {
    if (!event?.date) return;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(event.date).getTime() - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [event?.date]);

  const handleRSVP = async () => {
    if (!user) return navigate("/login");
    if (!eventId || eventId === "undefined") {
      console.error("Invalid Event ID");
      return;
    }

    setActionLoading(true);
    try {
      const API_URL =
        import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URI;
      await axios.put(
        `${API_URL}/api/events/${eventId}/join`,
        {},
        { withCredentials: true },
      );
      fetchEventData(); // Refresh the event to update the attendee list live
    } catch (error) {
      console.error("Error updating RSVP:", error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!event || !eventId || eventId === "undefined") {
    return (
      <div className="flex flex-col h-screen items-center justify-center text-red-500 bg-background-light dark:bg-background-dark">
        <ShieldAlert size={48} className="mb-4 opacity-50" />
        <h2 className="text-xl font-bold mb-2">Event not found</h2>
        <p className="text-muted-light dark:text-muted-dark">
          The event ID is invalid or the event no longer exists.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 px-6 py-2 bg-primary text-white rounded-full font-bold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const hasJoinedEvent = event.attendees?.some(
    (att) => (att._id || att).toString() === user?._id?.toString(),
  );
  const isPastEvent = new Date(event.date) < new Date();

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark font-sans transition-colors duration-300">
      <DashboardNavbar />

      <main className="max-w-[1440px] mx-auto px-6 py-8">
        {/* Top Controls & Back Button */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate(`/clubs/${event.club?._id}`)}
            className="flex items-center gap-2 text-muted-light dark:text-muted-dark hover:text-primary transition-colors font-bold text-sm bg-card-light dark:bg-card-dark px-4 py-2 rounded-full shadow-sm border border-border-light dark:border-border-dark"
          >
            <ArrowLeft size={16} /> Back to {event.club?.name || "Club"}
          </button>

          <button className="flex items-center gap-2 text-muted-light dark:text-muted-dark hover:text-primary transition-colors font-bold text-sm bg-card-light dark:bg-card-dark px-4 py-2 rounded-full shadow-sm border border-border-light dark:border-border-dark">
            <Share2 size={16} /> Share
          </button>
        </div>

        {/* Clean Hero Title Area */}
        <section className="mb-12">
          {isPastEvent ? (
            <span className="bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4 inline-block">
              Past Event
            </span>
          ) : (
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4 inline-block">
              Upcoming Event
            </span>
          )}

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            {event.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-muted-light dark:text-muted-dark">
            <div className="flex items-center gap-2 bg-card-light dark:bg-card-dark px-4 py-2 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
              <Calendar className="text-primary" size={20} />
              <span className="font-bold">
                {new Date(event.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            {/* Live Countdown Timer */}
            {!isPastEvent && (
              <div className="bg-primary/5 dark:bg-primary/10 px-4 py-2 rounded-xl flex gap-4 items-center border border-primary/20 text-primary shadow-sm">
                <div className="text-center">
                  <span className="block text-xl font-black">
                    {String(timeLeft.days).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] uppercase tracking-tighter opacity-70 font-bold">
                    Days
                  </span>
                </div>
                <span className="opacity-30">|</span>
                <div className="text-center">
                  <span className="block text-xl font-black">
                    {String(timeLeft.hours).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] uppercase tracking-tighter opacity-70 font-bold">
                    Hrs
                  </span>
                </div>
                <span className="opacity-30">|</span>
                <div className="text-center">
                  <span className="block text-xl font-black">
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] uppercase tracking-tighter opacity-70 font-bold">
                    Min
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Main Layout Grid (70/30) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-12">
          {/* Left Column: Content */}
          <div className="space-y-12">
            {/* Key Details Bento Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card-light dark:bg-card-dark p-5 rounded-2xl flex flex-col justify-between shadow-sm border border-border-light dark:border-border-dark">
                <Clock className="text-primary mb-4" size={24} />
                <div>
                  <p className="text-muted-light dark:text-muted-dark text-[10px] font-bold uppercase tracking-widest mb-1">
                    Time
                  </p>
                  <p className="font-bold text-sm">
                    {new Date(event.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              <div className="bg-card-light dark:bg-card-dark p-5 rounded-2xl flex flex-col justify-between shadow-sm border border-border-light dark:border-border-dark">
                <MapPin className="text-primary mb-4" size={24} />
                <div>
                  <p className="text-muted-light dark:text-muted-dark text-[10px] font-bold uppercase tracking-widest mb-1">
                    Location
                  </p>
                  <p className="font-bold text-sm truncate">{event.location}</p>
                </div>
              </div>
              <div className="bg-card-light dark:bg-card-dark p-5 rounded-2xl flex flex-col justify-between shadow-sm border border-border-light dark:border-border-dark">
                <Hourglass className="text-primary mb-4" size={24} />
                <div>
                  <p className="text-muted-light dark:text-muted-dark text-[10px] font-bold uppercase tracking-widest mb-1">
                    Status
                  </p>
                  <p className="font-bold text-sm">
                    {isPastEvent ? "Completed" : "Upcoming"}
                  </p>
                </div>
              </div>
              <div className="bg-card-light dark:bg-card-dark p-5 rounded-2xl flex flex-col justify-between shadow-sm border border-border-light dark:border-border-dark">
                <Ticket className="text-primary mb-4" size={24} />
                <div>
                  <p className="text-muted-light dark:text-muted-dark text-[10px] font-bold uppercase tracking-widest mb-1">
                    Entry
                  </p>
                  <p className="font-bold text-sm">RSVP Required</p>
                </div>
              </div>
            </div>

            {/* About Section */}
            <section>
              <h2 className="text-2xl font-extrabold tracking-tight mb-6">
                About the Event
              </h2>
              <div className="bg-card-light dark:bg-card-dark p-6 md:p-8 rounded-3xl shadow-sm border border-border-light dark:border-border-dark">
                <p className="text-muted-light dark:text-muted-dark text-base md:text-lg leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>
            </section>

            {/* Announcements Feed */}
            <section>
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl font-extrabold tracking-tight">
                  Announcements
                </h2>
                <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
                  0 Updates
                </span>
              </div>

              {/* Admin Post Card */}
              {isAdmin && !isPastEvent && (
                <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 p-6 rounded-3xl mb-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow-md">
                      <Edit size={18} />
                    </div>
                    <div className="flex-grow">
                      <textarea
                        value={announcementText}
                        onChange={(e) => setAnnouncementText(e.target.value)}
                        className="w-full bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder-muted-light resize-none"
                        placeholder="Post an update for attendees..."
                        rows="2"
                      ></textarea>
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex gap-1">
                          <button className="p-2 rounded-xl hover:bg-card-light dark:hover:bg-card-dark text-muted-light transition-colors">
                            <ImageIcon size={18} />
                          </button>
                          <button className="p-2 rounded-xl hover:bg-card-light dark:hover:bg-card-dark text-muted-light transition-colors">
                            <Paperclip size={18} />
                          </button>
                        </div>
                        <button className="bg-primary text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg hover:bg-primary-hover transition-all active:scale-95">
                          Post Update
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Empty Announcements */}
              <div className="bg-card-light dark:bg-card-dark p-8 rounded-3xl shadow-sm border border-border-light dark:border-border-dark text-center text-muted-light dark:text-muted-dark">
                No announcements for this event yet.
              </div>
            </section>
          </div>

          {/* Right Column: Sidebar */}
          <div className="relative">
            <div className="sticky top-24 space-y-8">
              {/* RSVP Card */}
              <div className="bg-card-light dark:bg-card-dark p-8 rounded-3xl shadow-xl border border-border-light dark:border-border-dark space-y-8 relative z-20">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-extrabold tracking-tight">
                      Registration
                    </h3>
                    <span className="text-primary font-bold text-sm bg-primary/10 px-3 py-1 rounded-full">
                      Free Entry
                    </span>
                  </div>
                  <p className="text-sm text-muted-light dark:text-muted-dark">
                    {isPastEvent
                      ? "This event has already concluded."
                      : "Reserve your spot for this event."}
                  </p>
                </div>

                {!isPastEvent && (
                  <button
                    onClick={handleRSVP}
                    disabled={actionLoading}
                    className={`w-full py-4 rounded-full font-bold text-lg shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
                      hasJoinedEvent
                        ? "bg-green-100 text-green-700 hover:bg-green-200 shadow-green-500/20"
                        : "bg-primary text-white hover:bg-primary-hover shadow-primary/25"
                    }`}
                  >
                    {hasJoinedEvent ? (
                      <>
                        <CheckCircle size={20} /> Registered (Click to Cancel)
                      </>
                    ) : (
                      "Register Now"
                    )}
                  </button>
                )}

                <div className="space-y-4 pt-2 border-t border-border-light dark:border-border-dark">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-light dark:text-muted-dark">
                    Who's Going
                  </p>
                  <div className="flex items-center">
                    <div className="flex -space-x-3 overflow-hidden">
                      {/* Map real attendees */}
                      {event.attendees?.slice(0, 3).map((att, idx) => (
                        <div
                          key={att._id || idx}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 border-2 border-card-light dark:border-card-dark text-primary font-bold text-xs z-30 overflow-hidden"
                        >
                          {att.image ? (
                            <img
                              src={att.image}
                              alt={att.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            att.name?.charAt(0)
                          )}
                        </div>
                      ))}

                      {event.attendees?.length > 3 && (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-card-light dark:border-card-dark text-[10px] font-bold text-muted-light z-10">
                          +{event.attendees.length - 3}
                        </div>
                      )}
                      {(!event.attendees || event.attendees.length === 0) && (
                        <span className="text-sm font-medium text-muted-light">
                          No attendees yet.
                        </span>
                      )}
                    </div>
                    {event.attendees?.length > 0 && (
                      <span className="ml-4 text-xs font-bold text-muted-light dark:text-muted-dark">
                        {event.attendees.length} Attendees confirmed
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Admin Panel */}
              {isAdmin && (
                <div className="bg-amber-50/50 dark:bg-amber-900/10 p-6 rounded-3xl border border-amber-200 dark:border-amber-900/30 relative z-10">
                  <div className="flex items-center gap-3 mb-6 text-amber-700 dark:text-amber-500">
                    <ShieldAlert size={24} />
                    <h3 className="font-extrabold text-lg">Admin Console</h3>
                  </div>

                  {/* RSVP Stats */}
                  <div className="mb-8">
                    <div className="flex justify-between items-center text-xs font-bold mb-2">
                      <span className="uppercase tracking-widest text-muted-light dark:text-muted-dark">
                        Total RSVPs
                      </span>
                      <span className="text-amber-600 dark:text-amber-500">
                        {event.attendees?.length || 0}
                      </span>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    <button className="bg-white dark:bg-gray-800 p-3 rounded-2xl flex flex-col items-center gap-2 hover:bg-amber-100 dark:hover:bg-gray-700 transition-colors shadow-sm border border-amber-100 dark:border-gray-700">
                      <Download
                        className="text-amber-600 dark:text-amber-500"
                        size={20}
                      />
                      <span className="text-[10px] font-bold uppercase tracking-tight text-muted-light dark:text-gray-300">
                        Export CSV
                      </span>
                    </button>
                    {/* NEW PDF EXPORT BUTTON */}
                    <button className="bg-white dark:bg-gray-800 p-3 rounded-2xl flex flex-col items-center gap-2 hover:bg-amber-100 dark:hover:bg-gray-700 transition-colors shadow-sm border border-amber-100 dark:border-gray-700">
                      <FileText
                        className="text-amber-600 dark:text-amber-500"
                        size={20}
                      />
                      <span className="text-[10px] font-bold uppercase tracking-tight text-muted-light dark:text-gray-300">
                        Export PDF
                      </span>
                    </button>
                  </div>

                  {/* Attendee Check-in list */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-light dark:text-gray-400 mb-4">
                      Live Check-in
                    </p>

                    <div className="max-h-64 overflow-y-auto pr-1 custom-scrollbar space-y-2">
                      {event.attendees?.length > 0 ? (
                        event.attendees.map((att) => (
                          <div
                            key={att._id}
                            className="flex items-center justify-between p-2.5 rounded-2xl bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-amber-200 dark:hover:border-gray-600 group"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-xs shrink-0 overflow-hidden">
                                {att.image ? (
                                  <img
                                    src={att.image}
                                    alt={att.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  att.name?.charAt(0)
                                )}
                              </div>
                              <div className="min-w-0 flex-1 truncate">
                                <p className="text-xs font-bold text-foreground-light dark:text-foreground-dark truncate pr-2">
                                  {att.name}
                                </p>
                                <p className="text-[10px] text-muted-light dark:text-gray-400 font-medium truncate pr-2">
                                  {att.email}
                                </p>
                              </div>
                            </div>
                            {/* Toggle Switch Placeholder */}
                            <label className="relative inline-flex items-center cursor-pointer shrink-0">
                              <input type="checkbox" className="sr-only peer" />
                              <div className="w-9 h-5 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                            </label>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-sm text-muted-light py-4">
                          No attendees yet
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventDetails;
