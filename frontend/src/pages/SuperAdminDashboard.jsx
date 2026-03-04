import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardNavbar from "../components/DashboardNavbar"; // <--- Using the standard Navbar
import {
  Component,
  Clock,
  UserPlus,
  ClipboardList,
  Filter,
  Check,
  X,
  Shield,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const SuperAdminDashboard = () => {
  const [pendingClubs, setPendingClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  // data of users and clubs for stats
  const [stats, setStats] = useState({
    totalClubs: 0,
    totalUsers: 0,
    pendingClubs: 0,
  });

  //fetch system stats
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URI;
        // fetch pending clubs
        const pendingRes = await axios.get(
          `${API_URL}/api/clubs/admin/pending`,
          {
            withCredentials: true,
          },
        );

        // fetch stats
        const statsRes = await axios.get(`${API_URL}/api/clubs/admin/stats`, {
          withCredentials: true,
        });
        setStats(
          statsRes.data?.data || {
            totalClubs: 0,
            totalUsers: 0,
            pendingClubs: 0,
          },
        );
        setPendingClubs(pendingRes.data?.data || []);
      } catch {
        console.error("Failed to fetch admin data");
        setPendingClubs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  // handler functions
  const handleApprove = async (id) => {
    try {
      const API_URL = import.meta.env.VITE_API_URI;
      await axios.put(
        `${API_URL}/api/clubs/${id}/approve`,
        {},
        {
          withCredentials: true,
        },
      );
      // Remove from UI
      setPendingClubs((prev) => prev.filter((c) => c._id !== id));
      alert("Club Approved!");
    } catch {
      alert("Approval failed");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this club?")) return;
    try {
      const API_URL = import.meta.env.VITE_API_URI;
      await axios.delete(`${API_URL}/api/clubs/${id}/reject`, {
        withCredentials: true,
      });
      // Remove from UI
      setPendingClubs((prev) => prev.filter((c) => c._id !== id));
    } catch {
      alert("Rejection failed");
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark">
        Loading Admin Console...
      </div>
    );

  return (
    <div className="flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-200 transition-colors duration-300">
      {/* Navbar */}
      <DashboardNavbar />

      {/* Background Blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-50">
        <div className="fixed top-[-100px] left-[-100px] w-[600px] h-[600px] rounded-full bg-primary/10 blur-[100px]"></div>
        <div className="fixed bottom-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full bg-blue-400/10 blur-[100px]"></div>
      </div>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary text-white shadow-lg shadow-primary/30">
              <Shield size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Superadmin Console
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                Manage approvals and oversee platform activity.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <section className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            icon={<Component size={24} />}
            color="bg-primary/10 text-primary"
            label="Total Clubs"
            value={stats.totalClubs}
          />
          <StatCard
            icon={<Clock size={24} />}
            color="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
            label="Pending Reviews"
            value={stats.pendingClubs}
            badge="Action Needed"
            highlight
          />
          <StatCard
            icon={<UserPlus size={24} />}
            color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
            label="Total Users"
            value={stats.totalUsers}
          />
        </section>

        {/* Pending Approvals Table */}
        <section className="flex flex-col rounded-2xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/60 dark:border-gray-700 shadow-xl overflow-hidden">
          {/* Table Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/60 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ClipboardList size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Pending Approvals
              </h3>
              {pendingClubs.length > 0 && (
                <span className="ml-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  {pendingClubs.length} New
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
                <Filter size={18} /> Filter
              </button>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            {pendingClubs.length === 0 ? (
              <div className="p-16 text-center text-slate-500 dark:text-slate-400">
                <CheckCircle
                  size={64}
                  className="mx-auto mb-4 text-green-500 opacity-50"
                />
                <p className="text-xl font-medium">All caught up!</p>
                <p className="text-sm opacity-70">
                  No pending club applications at the moment.
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead className="bg-white/50 dark:bg-gray-800/50">
                  <tr className="border-b border-slate-200/60 dark:border-gray-700 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="px-6 py-4 font-semibold">Club Details</th>
                    <th className="px-6 py-4 font-semibold">Category</th>
                    <th className="px-6 py-4 font-semibold">Submitter</th>
                    <th className="px-6 py-4 font-semibold">Submitted On</th>
                    <th className="px-6 py-4 font-semibold text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 dark:divide-gray-700 text-sm">
                  {pendingClubs.map((club) => (
                    <tr
                      key={club._id}
                      className="group transition-colors hover:bg-primary/5 dark:hover:bg-primary/10"
                    >
                      {/* Club Details */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 shrink-0 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-700">
                            {club.image ? (
                              <img
                                src={club.image}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="font-bold text-gray-500 text-lg">
                                {club.name[0]}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-base text-slate-900 dark:text-white">
                              {club.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                              {club.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-600/20">
                          {club.category}
                        </span>
                      </td>

                      {/* Submitter */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                            {club.admin?.name?.[0]}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">
                              {club.admin?.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {club.admin?.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">
                        {new Date(club.createdAt).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleReject(club._id)}
                            className="p-2 rounded-lg border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-slate-500 dark:text-slate-400 hover:border-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 transition-all shadow-sm"
                            title="Reject"
                          >
                            <X size={18} />
                          </button>
                          <button
                            onClick={() => handleApprove(club._id)}
                            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white shadow-md shadow-primary/20 hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all"
                          >
                            <Check size={16} /> Approve
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

//stat card component

const StatCard = ({ icon, color, label, value, badge, highlight }) => (
  <div
    className={`glass-card rounded-2xl p-6 bg-white/60 dark:bg-gray-800/60 border border-white/50 dark:border-gray-700 shadow-sm hover:shadow-md transition-all ${highlight ? "border-l-4 border-l-primary" : ""}`}
  >
    <div className="mb-4 flex items-center justify-between">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full ${color}`}
      >
        {icon}
      </div>
      {badge && (
        <span className="flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-700 px-2 py-1 text-xs font-bold text-slate-600 dark:text-slate-300">
          {badge}
        </span>
      )}
    </div>
    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
      {label}
    </p>
    <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
      {value}
    </h3>
  </div>
);

export default SuperAdminDashboard;
