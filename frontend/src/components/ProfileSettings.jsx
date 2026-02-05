import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Camera,
  Edit,
  GraduationCap,
  Share2,
  Github,
  Linkedin,
  ChevronDown,
  Lock,
  Mail,
  Save,
  Loader,
  Settings,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const ProfileSettings = () => {
  const { user, setUser } = useAuth();

  const [formData, setFormData] = useState({
    bio: "",
    major: "",
    year: "1st Year",
    linkedin: "",
    github: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Load existing user data
  useEffect(() => {
    if (user) {
      setFormData({
        bio: user.bio || "",
        major: user.major || "",
        year: user.year || "1st Year",
        linkedin: user.socials?.linkedin || "",
        github: user.socials?.github || "",
      });
      setAvatarPreview(user.image || user.name?.charAt(0).toUpperCase() || "");
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const data = new FormData();

      Object.keys(formData).forEach((key) => data.append(key, formData[key]));

      // Append Image if changed
      if (avatarFile) {
        data.append("image", avatarFile);
      }

      const res = await axios.put(`${API_URL}/api/users/profile`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      setUser(res.data.data);
      setMessage({ type: "success", text: "Changes saved successfully!" });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to update profile." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-xl border border-white/60 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex-shrink-0 size-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
          <Settings size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#161118] dark:text-white leading-tight text-center">
            Profile Settings
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Manage your personal information and account preferences
          </p>
        </div>
      </div>

      {message.text && (
        <div
          className={`mb-6 p-4 rounded-xl text-sm font-bold ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleProfileSubmit} className="space-y-8">
        {/* ID */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
          {/* Avatar */}
          <div className="relative group cursor-pointer flex-shrink-0">
            <div
              className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-700 shadow-lg bg-cover bg-center"
              style={{ backgroundImage: `url("${avatarPreview}")` }}
            ></div>
            <label
              htmlFor="avatar-upload"
              className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px] cursor-pointer"
            >
              <Camera className="text-white" size={32} />
              <input
                id="avatar-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
            <div className="absolute bottom-1 right-1 bg-white dark:bg-gray-700 p-1.5 rounded-full shadow-md text-primary pointer-events-none">
              <Edit size={16} />
            </div>
          </div>

          {/* name and email */}
          <div className="flex-grow w-full space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <input
                  className="w-full bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 rounded-xl px-4 py-2.5 focus:outline-none cursor-not-allowed"
                  disabled
                  type="text"
                  value={user?.name || ""}
                />
                <p className="text-xs text-gray-400">
                  Contact admin to change your legal name
                </p>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <input
                  className="w-full bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 rounded-xl px-4 py-2.5 focus:outline-none cursor-not-allowed"
                  disabled
                  type="email"
                  value={user?.email || ""}
                />
                <p className="text-xs text-gray-400">
                  Used for university communications
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* bio */}
        <div className="space-y-5 pt-2">
          <h3 className="text-lg font-bold text-[#161118] dark:text-white flex items-center gap-2">
            <GraduationCap className="text-primary" size={20} />
            Academic & Bio
          </h3>

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="w-full bg-white/60 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-gray-400 text-sm leading-relaxed dark:text-white resize-none"
              placeholder="Tell us about yourself..."
              rows="3"
            ></textarea>
            <div className="flex justify-end">
              <span className="text-xs text-gray-400">
                {formData.bio.length}/300 characters
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                Major
              </label>
              <input
                type="text"
                name="major"
                value={formData.major}
                onChange={handleInputChange}
                className="w-full bg-white/60 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm font-medium dark:text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                Year of Study
              </label>
              <div className="relative">
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="w-full appearance-none bg-white/60 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 text-[#161118] dark:text-white text-sm font-medium py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer shadow-sm"
                >
                  <option value="1st Year">Freshman (1st Year)</option>
                  <option value="2nd Year">Sophomore (2nd Year)</option>
                  <option value="3rd Year">Junior (3rd Year)</option>
                  <option value="4th Year">Senior (4th Year)</option>
                  <option value="Graduated">Graduate Student</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <ChevronDown size={20} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* social */}
        <div className="space-y-5 pt-2">
          <h3 className="text-lg font-bold text-[#161118] dark:text-white flex items-center gap-2">
            <Share2 className="text-primary" size={20} />
            Social Links
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                LinkedIn Profile
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Linkedin size={20} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  className="w-full bg-white/60 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm font-medium placeholder:text-gray-400 dark:text-white"
                  placeholder="linkedin.com/in/username"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                GitHub Profile
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Github size={20} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="github"
                  value={formData.github}
                  onChange={handleInputChange}
                  className="w-full bg-white/60 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm font-medium placeholder:text-gray-400 dark:text-white"
                  placeholder="github.com/username"
                />
              </div>
            </div>
          </div>
        </div>

        {/* security */}
        <div className="pt-4">
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 bg-gray-50/50 dark:bg-gray-900/30">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-4 flex items-center gap-2">
              <Lock className="text-gray-500" size={18} />
              Security & Password
            </h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Password
                </p>
                <p className="text-xs text-gray-500">
                  To change your password, please verify via email.
                </p>
              </div>
              <Link
                to="/forgot-password"
                className="text-primary hover:text-primary/80 text-sm font-bold flex items-center gap-1 transition-colors px-3 py-1.5 rounded-lg hover:bg-primary/5 border border-transparent hover:border-primary/20"
              >
                <Mail size={18} />
                Reset Password via Email
              </Link>
            </div>
          </div>
        </div>

        {/* save */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white hover:bg-primary/90 font-bold py-2.5 px-8 rounded-xl shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 flex items-center gap-2 active:scale-95 disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {loading ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              <Save size={20} />
            )}
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;
