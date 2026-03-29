import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import Loader from "../components/Loader";
import DashboardNavbar from "../components/DashboardNavbar";
import {
  Users,
  Calendar,
  MapPin,
  Clock,
  Mail,
  Info,
  ChevronRight,
  ArrowRight,
  Image as ImageIcon,
  CheckCircle,
  LogOut,
  Edit,
  Plus,
  Trash2,
  Bell,
  BellOff,
  UserPlus,
  Check,
  X,
  AlertCircle,
  UserMinus,
  Crown,
  ShieldOff,
  History,
} from "lucide-react";
import CreateEvent from "../components/CreateEvent";
import ConfirmDialog from "../components/ConfirmDialog";
import EditClubModal from "../components/EditClubModal";

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
  const [showEditClub, setShowEditClub] = useState(false);
  const [showAllPastEvents, setShowAllPastEvents] = useState(false);

  const [listModalType, setListModalType] = useState(null);

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "",
    isDanger: false,
    action: null,
  });

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });

    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  const isUserInArray = (array) => {
    if (!array || !user) return false;
    return array.some(
      (item) => (item._id || item).toString() === user._id.toString(),
    );
  };

  const isAdmin =
    club?.admins?.some(
      (a) => (a._id || a).toString() === user?._id?.toString(),
    ) || user?.roles?.includes("superadmin");
  const isMember = isUserInArray(club?.members) || isAdmin;
  const isFollower = isUserInArray(club?.followers);
  const isPending = isUserInArray(club?.joinRequests);

  // Fetch Data Function
  const fetchClubData = useCallback(async () => {
    try {
      const API_URL =
        import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URI;
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
  }, [id]);

  useEffect(() => {
    fetchClubData();
  }, [fetchClubData]);

  const handleFollowToggle = async () => {
    if (!user) return navigate("/login");
    setActionLoading(true);
    try {
      const API_URL =
        import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URI;
      const endpoint = isFollower ? "unfollow" : "follow";
      await axios.put(
        `${API_URL}/api/clubs/${id}/${endpoint}`,
        {},
        { withCredentials: true },
      );
      await fetchClubData();
      showToast(
        isFollower ? "Unfollowed club" : "You are now following this club!",
        "success",
      );
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to update follow status",
        "error",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleJoinRequest = async () => {
    if (!user) return navigate("/login");
    setActionLoading(true);
    try {
      const API_URL =
        import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URI;
      await axios.post(
        `${API_URL}/api/clubs/${id}/join`,
        {},
        { withCredentials: true },
      );
      await fetchClubData();
      showToast("Join request sent to admin", "success");
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to send join request",
        "error",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveClubClick = () => {
    setModalConfig({
      isOpen: true,
      title: "Leave Club",
      message:
        isAdmin && club.admins?.length === 1
          ? "You are the ONLY admin left. If you leave, the club will be abandoned. Please promote another member to admin first."
          : "Are you sure you want to leave this club? You will no longer receive updates or have access to member-only events.",
      confirmText: "Yes, Leave",
      isDanger: true,
      action: async () => {
        if (isAdmin && club.admins?.length === 1) {
          setModalConfig((prev) => ({ ...prev, isOpen: false }));
          return showToast("Cannot leave: You are the last admin.", "error");
        }

        setActionLoading(true);
        try {
          const API_URL =
            import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URI;
          await axios.put(
            `${API_URL}/api/clubs/${id}/leave`,
            {},
            { withCredentials: true },
          );
          await fetchClubData();
          setModalConfig((prev) => ({ ...prev, isOpen: false }));
          showToast("You have left the club.", "success");
          navigate("/dashboard");
        } catch (err) {
          showToast(
            err.response?.data?.message || "Failed to leave club",
            "error",
          );
        } finally {
          setActionLoading(false);
        }
      },
    });
  };

  const handleManageRequest = async (userId, action) => {
    try {
      const API_URL =
        import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URI;
      await axios.put(
        `${API_URL}/api/clubs/${id}/requests/${userId}/${action}`,
        {},
        { withCredentials: true },
      );
      await fetchClubData();
      showToast(
        `Request ${action === "accept" ? "accepted" : "rejected"}`,
        "success",
      );
    } catch (err) {
      showToast(
        err.response?.data?.message || `Failed to ${action} request`,
        "error",
      );
    }
  };

  const handleRemoveMemberClick = (memberId, memberName) => {
    setModalConfig({
      isOpen: true,
      title: "Remove Member",
      message: `Are you sure you want to remove ${memberName} from the club? They will lose access to member benefits.`,
      confirmText: "Yes, Remove",
      isDanger: true,
      action: async () => {
        setActionLoading(true);
        try {
          const API_URL =
            import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URI;
          await axios.put(
            `${API_URL}/api/clubs/${id}/members/${memberId}/remove`,
            {},
            { withCredentials: true },
          );
          await fetchClubData();
          setModalConfig((prev) => ({ ...prev, isOpen: false }));
          showToast(`${memberName} has been removed.`, "success");
        } catch (err) {
          showToast(
            err.response?.data?.message || "Failed to remove member",
            "error",
          );
        } finally {
          setActionLoading(false);
        }
      },
    });
  };

  const handlePromoteAdminClick = (memberId, memberName) => {
    setModalConfig({
      isOpen: true,
      title: "Promote to Admin",
      message: `Are you sure you want to make ${memberName} an Admin? They will have full control over events, members, and settings.`,
      confirmText: "Yes, Promote",
      isDanger: false,
      action: async () => {
        setActionLoading(true);
        try {
          const API_URL =
            import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URI;
          await axios.put(
            `${API_URL}/api/clubs/${id}/admins/${memberId}/promote`,
            {},
            { withCredentials: true },
          );
          await fetchClubData();
          setModalConfig((prev) => ({ ...prev, isOpen: false }));
          showToast(`${memberName} is now an Admin!`, "success");
        } catch (err) {
          showToast(
            err.response?.data?.message || "Failed to promote admin",
            "error",
          );
        } finally {
          setActionLoading(false);
        }
      },
    });
  };

  const handleDemoteAdminClick = (adminId, adminName) => {
    setModalConfig({
      isOpen: true,
      title: "Demote Admin",
      message: `Are you sure you want to remove Admin privileges from ${adminName}? They will become a regular member.`,
      confirmText: "Yes, Demote",
      isDanger: true,
      action: async () => {
        setActionLoading(true);
        try {
          const API_URL =
            import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URI;
          await axios.put(
            `${API_URL}/api/clubs/${id}/admins/${adminId}/demote`,
            {},
            { withCredentials: true },
          );
          await fetchClubData();
          setModalConfig((prev) => ({ ...prev, isOpen: false }));
          showToast(`${adminName} has been demoted to a member.`, "success");
        } catch (err) {
          showToast(
            err.response?.data?.message || "Failed to demote admin",
            "error",
          );
        } finally {
          setActionLoading(false);
        }
      },
    });
  };

  const refreshEvents = async () => {
    try {
      const API_URL =
        import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URI;
      const res = await axios.get(`${API_URL}/api/events/club/${id}`);
      setEvents(res.data.data);
    } catch (err) {
      console.error("Failed to refresh events", err);
    }
  };

  const handleRSVP = async (eventId) => {
    if (!user) return navigate("/login");
    try {
      const API_URL =
        import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URI;
      await axios.put(
        `${API_URL}/api/events/${eventId}/join`,
        {},
        { withCredentials: true },
      );
      refreshEvents();
      showToast("Event registration updated!", "success");
    } catch {
      showToast("Failed to RSVP to event", "error");
    }
  };

  const handleDeleteEventClick = (eventId) => {
    setModalConfig({
      isOpen: true,
      title: "Delete Event",
      message:
        "Are you sure you want to delete this event? This action cannot be undone.",
      confirmText: "Yes, Delete Event",
      isDanger: true,
      action: async () => {
        setActionLoading(true);
        try {
          const API_URL =
            import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URI;
          await axios.delete(`${API_URL}/api/events/${eventId}`, {
            withCredentials: true,
          });
          refreshEvents();
          setModalConfig((prev) => ({ ...prev, isOpen: false }));
          showToast("Event deleted successfully", "success");
        } catch {
          showToast("Failed to delete event", "error");
        } finally {
          setActionLoading(false);
        }
      },
    });
  };

  const handleDeleteClubClick = () => {
    setModalConfig({
      isOpen: true,
      title: "Delete Club",
      message:
        "Are you absolutely sure you want to delete this entire club? All events, members, and data will be permanently removed. This action cannot be undone.",
      confirmText: "Yes, Delete Club",
      isDanger: true,
      action: async () => {
        setActionLoading(true);
        try {
          const API_URL = import.meta.env.VITE_API_URI;
          await axios.delete(`${API_URL}/api/clubs/${id}`, {
            withCredentials: true,
          });
          setModalConfig((prev) => ({ ...prev, isOpen: false }));
          navigate("/dashboard");
        } catch (err) {
          showToast(
            err.response?.data?.message || "Failed to delete club",
            "error",
          );
        } finally {
          setActionLoading(false);
        }
      },
    });
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowEvents(true);
  };

  const openCreateModal = () => {
    setShowEvents(true);
    setEditingEvent(null);
  };

  const hasJoinedEvent = (event) => {
    return event.attendees?.some((att) => (att._id || att) === user?._id);
  };

  if (loading) return <Loader />;

  if (error || !club)
    return (
      <div className="flex h-screen items-center justify-center text-red-500 bg-gray-50 dark:bg-gray-900">
        {error || "Club not found"}
      </div>
    );

  const combinedMembersList = [
    ...(club.admins || []).map((a) => ({ ...a, clubRole: "admin" })),
    ...(club.members || []).map((m) => ({ ...m, clubRole: "member" })),
  ];

  const currentList =
    listModalType === "members" ? combinedMembersList : club.followers;

  // --- FILTER EVENTS INTO UPCOMING AND PAST ---
  const now = new Date();

  // Sort upcoming ascending (closest first)
  const upcomingEvents = events
    .filter((e) => new Date(e.date) >= now)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Sort past descending (most recently finished first)
  const pastEvents = events
    .filter((e) => new Date(e.date) < now)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const visiblePastEvents = showAllPastEvents
    ? pastEvents
    : pastEvents.slice(0, 3);

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-white transition-colors duration-300 overflow-x-hidden">
      <DashboardNavbar />

      <main className="flex-grow pb-12 relative">
        {/* Background Blobs */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-50">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[100px]"></div>
          <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-400/5 blur-[100px]"></div>
        </div>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <div className="py-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
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

          {/* Hero Section */}
          <div className="relative w-full overflow-hidden rounded-2xl shadow-lg group mb-8 h-[300px] md:h-[350px]">
            <div
              className="absolute inset-0 bg-gray-200 dark:bg-gray-800 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage: `url(${club.image || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200"})`,
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
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

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column (Content) */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              {/* About Section */}
              <section className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/50 dark:border-gray-700 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Info size={20} />
                  </div>
                  <h3 className="text-xl font-bold">About Us</h3>
                </div>
                <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {club.description}
                </div>
              </section>
              {/* Gallery Section */}
              <section>
                <div className="flex items-center justify-between mb-4 px-1">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <ImageIcon size={20} />
                    </div>
                    <h3 className="text-xl font-bold">Moments & Activities</h3>
                  </div>
                  <button className="text-sm font-bold text-primary hover:text-blue-600 flex items-center gap-1 transition-colors">
                    View Gallery <ArrowRight size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px]">
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
              {/* Upcoming Events Section */}
              <section className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/50 dark:border-gray-700 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Calendar size={20} />
                    </div>
                    <h3 className="text-xl font-bold">Upcoming Events</h3>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={openCreateModal}
                      className="flex items-center gap-1 text-sm font-bold text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Plus size={16} /> Create Event
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {upcomingEvents.length > 0 ? (
                    upcomingEvents.map((event) => (
                      <div
                        key={event._id}
                        onClick={() => navigate(`/events/${event._id}`)}
                        className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl hover:bg-white/40 dark:hover:bg-gray-700/50 border border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-all cursor-pointer group"
                      >
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
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteEventClick(event._id);
                                }}
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )}
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                            <span className="flex items-center gap-1">
                              <Clock size={14} />{" "}
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
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                            {event.description}
                          </p>
                        </div>
                        <div className="flex items-center sm:justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRSVP(event._id);
                            }}
                            className={`px-4 py-2 rounded-lg border text-sm font-bold transition-all shadow-sm ${
                              hasJoinedEvent(event)
                                ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
                                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
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
                    <div className="text-center py-8 text-gray-500">
                      <p>No upcoming events scheduled.</p>
                    </div>
                  )}
                </div>
              </section>
              *
              {pastEvents.length > 0 && (
                <section className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/50 dark:border-gray-700 shadow-sm mt-2">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                      <History size={20} />
                    </div>
                    <h3 className="text-xl font-bold">Past Events</h3>
                  </div>

                  <div className="space-y-4">
                    {visiblePastEvents.map((event) => (
                      <div
                        key={event._id}
                        onClick={() => navigate(`/events/${event._id}`)}
                        className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-transparent transition-all group opacity-80 hover:opacity-100"
                      >
                        <div className="flex-shrink-0 w-full sm:w-24 h-24 sm:h-24 rounded-lg bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                          <span className="text-xs font-bold uppercase tracking-wider">
                            {new Date(event.date).toLocaleString("default", {
                              month: "short",
                            })}
                          </span>
                          <span className="text-2xl font-bold">
                            {new Date(event.date).getDate()}
                          </span>
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200">
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
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteEventClick(event._id);
                                }}
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )}
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                            <span className="flex items-center gap-1">
                              <Clock size={14} />{" "}
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
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                            {event.description}
                          </p>
                        </div>
                        <div className="flex items-center sm:justify-end">
                          <button
                            disabled
                            className="px-4 py-2 rounded-lg border text-sm font-bold shadow-sm bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700 cursor-not-allowed"
                          >
                            Completed
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Show More / Show Less Button */}
                    {pastEvents.length > 3 && (
                      <button
                        onClick={() => setShowAllPastEvents(!showAllPastEvents)}
                        className="w-full py-3 mt-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        {showAllPastEvents
                          ? "Show Less"
                          : `Show All Past Events (${pastEvents.length})`}
                      </button>
                    )}
                  </div>
                </section>
              )}
            </div>

            {/* Right Column (Sidebar) */}
            <div className="lg:col-span-4 relative">
              <div className="sticky top-24 space-y-6">
                {/* Action Card */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl shadow-primary/5 border border-white/50 dark:border-gray-700">
                  <div className="flex flex-col gap-3 mb-6">
                    {isAdmin ? (
                      <div className="flex flex-col gap-3">
                        <button
                          onClick={() => setShowEditClub(true)}
                          className="w-full py-3.5 px-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 bg-primary text-white hover:bg-blue-600 shadow-lg shadow-primary/25 transition-all active:scale-[0.98]"
                        >
                          <Edit size={18} /> Edit Club Details
                        </button>
                        <button
                          onClick={handleDeleteClubClick}
                          className="w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/10 text-red-600 border border-red-200 dark:border-red-900 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all active:scale-[0.98]"
                        >
                          <Trash2 size={16} /> Delete Club
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* Request to Join / Leave / Pending */}
                        {isMember ? (
                          <button
                            onClick={handleLeaveClubClick}
                            disabled={actionLoading}
                            className="w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all bg-red-50 dark:bg-red-900/20 text-red-600 border border-red-200 dark:border-red-900 hover:bg-red-100 active:scale-[0.98]"
                          >
                            <LogOut size={18} /> Leave Club
                          </button>
                        ) : isPending ? (
                          <button
                            disabled
                            className="w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all bg-amber-50 dark:bg-amber-900/20 text-amber-600 border border-amber-200 dark:border-amber-900 cursor-not-allowed"
                          >
                            <Clock size={18} /> Request Pending
                          </button>
                        ) : (
                          <button
                            onClick={handleJoinRequest}
                            disabled={actionLoading}
                            className="w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all bg-primary hover:bg-blue-600 text-white shadow-lg shadow-primary/25 active:scale-[0.98]"
                          >
                            <UserPlus size={18} /> Request to Join
                          </button>
                        )}
                        <button
                          onClick={handleFollowToggle}
                          disabled={actionLoading}
                          className="w-full py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all bg-transparent border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-[0.98]"
                        >
                          {isFollower ? (
                            <>
                              <BellOff size={18} /> Unfollow
                            </>
                          ) : (
                            <>
                              <Bell size={18} /> Follow for Updates
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>

                  {/* Stats Split: Members & Followers */}
                  <div className="flex flex-col gap-1 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
                    <div
                      onClick={() => setListModalType("members")}
                      className="flex items-center justify-between p-2.5 -mx-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                    >
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <Users size={16} /> Active Members
                      </span>
                      <span className="text-sm font-bold bg-primary/10 text-primary px-2.5 py-0.5 rounded-md">
                        {(club.members?.length || 0) +
                          (club.admins?.length || 0)}
                      </span>
                    </div>
                    <div
                      onClick={() => setListModalType("followers")}
                      className="flex items-center justify-between p-2.5 -mx-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                    >
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <Bell size={16} /> Followers
                      </span>
                      <span className="text-sm font-bold bg-gray-200 dark:bg-gray-700 px-2.5 py-0.5 rounded-md">
                        {club.followers?.length || 0}
                      </span>
                    </div>
                  </div>

                  {/* ADMINS PROFILE STACK */}
                  <div className="mb-2">
                    <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                      Club Admins
                    </h4>
                    <div className="flex flex-col gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                      {club.admins?.map((adminObj) => (
                        <div
                          key={adminObj._id}
                          className="flex items-center gap-3"
                        >
                          <div className="relative shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-400 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                              {adminObj.image ? (
                                <img
                                  src={adminObj.image}
                                  className="w-full h-full object-cover"
                                  alt="Admin"
                                />
                              ) : (
                                adminObj.name?.charAt(0) || "A"
                              )}
                            </div>
                            <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-800"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate">
                              {adminObj.name || "Admin"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {adminObj.email}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button className="w-full mt-4 py-2 px-4 bg-transparent border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2">
                    <Mail size={16} /> Contact Admins
                  </button>
                </div>

                {isAdmin && club.joinRequests?.length > 0 && (
                  <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 text-amber-700 dark:text-amber-500">
                      <Users size={18} />
                      <h4 className="font-bold">
                        Pending Requests ({club.joinRequests.length})
                      </h4>
                    </div>
                    <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1">
                      {club.joinRequests.map((reqUser) => (
                        <div
                          key={reqUser._id || reqUser}
                          className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-xl border border-amber-100 dark:border-gray-700 shadow-sm"
                        >
                          <div className="flex-1 min-w-0 mr-2">
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                              {reqUser.name || "Student"}
                            </p>
                            {reqUser.email && (
                              <p className="text-xs text-gray-500 truncate">
                                {reqUser.email}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() =>
                                handleManageRequest(
                                  reqUser._id || reqUser,
                                  "accept",
                                )
                              }
                              className="p-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors"
                              title="Accept"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() =>
                                handleManageRequest(
                                  reqUser._id || reqUser,
                                  "reject",
                                )
                              }
                              className="p-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-5 border border-white/50 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-2 rounded-xl bg-purple-50 dark:bg-primary/10">
                      <div className="text-2xl font-bold text-primary">
                        {events.length || 0}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        Total Events
                      </div>
                    </div>
                    <div className="text-center p-2 rounded-xl bg-blue-50 dark:bg-blue-900/10">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {new Date(club.createdAt).getFullYear() ||
                          new Date().getFullYear()}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        Established
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- MEMBERS / FOLLOWERS MODAL --- */}
      {listModalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setListModalType(null)}
          ></div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md relative z-10 shadow-2xl flex flex-col max-h-[80vh] border border-gray-200 dark:border-gray-700 transform transition-all">
            <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center shrink-0 bg-gray-50/50 dark:bg-gray-900/50 rounded-t-2xl">
              <h3 className="font-bold text-lg capitalize flex items-center gap-2">
                {listModalType === "members" ? (
                  <Users size={20} className="text-primary" />
                ) : (
                  <Bell size={20} className="text-blue-500" />
                )}
                Club {listModalType}
              </h3>
              <button
                onClick={() => setListModalType(null)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto p-2 custom-scrollbar">
              {currentList?.length > 0 ? (
                currentList.map((u) => (
                  <div
                    key={u._id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold overflow-hidden shrink-0 border border-primary/10">
                        {u.image ? (
                          <img
                            src={u.image}
                            alt={u.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          u.name?.charAt(0)
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold leading-tight">
                          {u.name}
                          {u.clubRole === "admin" && (
                            <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded ml-2 font-bold tracking-wide">
                              ADMIN
                            </span>
                          )}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {u.email}
                        </span>
                      </div>
                    </div>

                    {/* ONLY ADMIN CAN SEE THESE CONTROLS - CANNOT DEMOTE/REMOVE THEMSELVES */}
                    {isAdmin &&
                      listModalType === "members" &&
                      u._id !== user._id && (
                        <div className="flex items-center gap-1">
                          {u.clubRole === "member" ? (
                            <button
                              onClick={() =>
                                handlePromoteAdminClick(u._id, u.name)
                              }
                              className="p-2 text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors border border-transparent hover:border-yellow-200 dark:hover:border-yellow-800"
                              title="Promote to Admin"
                            >
                              <Crown size={16} />
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleDemoteAdminClick(u._id, u.name)
                              }
                              className="p-2 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors border border-transparent hover:border-orange-200 dark:hover:border-orange-800"
                              title="Demote to Member"
                            >
                              <ShieldOff size={16} />
                            </button>
                          )}
                          <button
                            onClick={() =>
                              handleRemoveMemberClick(u._id, u.name)
                            }
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-800"
                            title="Remove Member"
                          >
                            <UserMinus size={16} />
                          </button>
                        </div>
                      )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No {listModalType} yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={modalConfig.action}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        isDanger={modalConfig.isDanger}
        isLoading={actionLoading}
      />

      <div
        className={`fixed bottom-6 right-6 z-[100] transition-all duration-300 ease-out transform ${
          toast.show
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-md ${
            toast.type === "error"
              ? "bg-red-50/90 dark:bg-red-900/80 border-red-200 dark:border-red-800 text-red-700 dark:text-red-200"
              : "bg-green-50/90 dark:bg-green-900/80 border-green-200 dark:border-green-800 text-green-700 dark:text-green-200"
          }`}
        >
          {toast.type === "error" ? (
            <AlertCircle size={20} className="shrink-0" />
          ) : (
            <CheckCircle size={20} className="shrink-0" />
          )}
          <p className="text-sm font-bold">{toast.message}</p>
          <button
            onClick={() => setToast((prev) => ({ ...prev, show: false }))}
            className="ml-2 opacity-50 hover:opacity-100 transition-opacity"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {showEvents && (
        <CreateEvent
          clubId={club._id}
          onClose={() => setShowEvents(false)}
          eventToEdit={editingEvent}
          onEventCreated={() => {
            refreshEvents();
            setShowEvents(false);
            showToast(
              editingEvent
                ? "Event Updated Successfully!"
                : "Event Created Successfully!",
              "success",
            );
          }}
        />
      )}

      {showEditClub && (
        <EditClubModal
          club={club}
          onClose={() => setShowEditClub(false)}
          onSuccess={() => {
            fetchClubData();
            setShowEditClub(false);
            showToast("Club details updated successfully!", "success");
          }}
        />
      )}
    </div>
  );
};

export default ClubDetails;
