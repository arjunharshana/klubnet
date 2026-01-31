import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
//import { useAuth } from "../hooks/useAuth";
import DashboardNavbar from "../components/DashboardNavbar";
import { CloudUpload, Eye, Users, PlusCircle, X } from "lucide-react";
const CreateClub = () => {
  const navigate = useNavigate();

  // 1. Form State
  const [formData, setFormData] = useState({
    name: "",
    category: "Tech",
    description: "",
  });

  // 2. Image State (File + Preview URL)
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    "https://via.placeholder.com/400x300?text=No+Image",
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create a fake URL to show the image immediately without uploading
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      // Prepare form data for submission
      const data = new FormData();
      data.append("name", formData.name);
      data.append("category", formData.category);
      data.append("description", formData.description);
      if (imageFile) {
        data.append("image", imageFile);
      }

      await axios.post(`${API_URL}/api/clubs`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create club");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display">
        <DashboardNavbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl p-8 text-center shadow-xl border border-gray-100 dark:border-gray-700">
            <div className="size-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-4xl">
                check_circle
              </span>
            </div>
            <h2 className="text-2xl font-bold text-foreground-light dark:text-foreground-dark mb-2">
              Application Submitted!
            </h2>
            <p className="text-muted-light dark:text-muted-dark mb-8">
              Your club <strong>{formData.name}</strong> has been created. It is
              currently
              <span className="font-bold text-orange-500">
                {" "}
                Pending Approval
              </span>
              . An admin will review it shortly.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-foreground-light dark:text-foreground-dark transition-colors duration-300">
      <DashboardNavbar />

      <main className="flex-1 w-full max-w-[1440px] mx-auto p-6 md:p-8 lg:p-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 h-full">
          {/* live preview */}
          <div className="w-full lg:w-5/12 xl:w-1/3 flex flex-col">
            <div className="sticky top-24 space-y-6">
              {/* Header Text */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                  <Eye size={18} />
                  Live Preview
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Create your Club
                </h1>
                <p className="text-muted-light dark:text-muted-dark text-base">
                  Start a new community. See how your club card will look in the
                  Explore feed in real-time.
                </p>
              </div>

              {/* preview card */}
              <div className="relative py-8 flex justify-center">
                <div className="w-full max-w-sm transform transition-all duration-500 hover:scale-[1.02]">
                  <div className="group bg-card-light dark:bg-card-dark rounded-2xl overflow-hidden border border-border-light/60 dark:border-border-dark/60 shadow-xl flex flex-col h-full relative">
                    {/* image */}
                    <div
                      className="h-56 bg-cover bg-center relative overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center transition-all duration-500"
                      style={{ backgroundImage: `url(${imagePreview})` }}
                    >
                      <div className="absolute inset-0 bg-black/10 transition-colors"></div>
                      <div className="absolute top-3 right-3">
                        <span className="bg-white/95 dark:bg-black/80 backdrop-blur-md text-foreground-light dark:text-white text-xs font-bold px-2.5 py-1 rounded-lg border border-white/20 shadow-sm">
                          {formData.category || "Category"}
                        </span>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-xl font-bold mb-2 line-clamp-1 break-words">
                        {formData.name || "New Club Name"}
                      </h3>
                      <p className="text-muted-light dark:text-muted-dark text-sm line-clamp-3 mb-5 leading-relaxed break-words">
                        {formData.description ||
                          "Your club description will appear here. This is a great place to tell potential members what your community is all about."}
                      </p>

                      {/* Fake Footer */}
                      <div className="mt-auto flex items-center justify-between pt-5 border-t border-border-light dark:border-border-dark">
                        <div className="flex items-center gap-1.5 text-muted-light dark:text-muted-dark text-xs font-semibold">
                          <Users size={16} />
                          <span>1 Member</span>
                        </div>
                        <button className="px-5 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold pointer-events-none">
                          Join Club
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Glow Effect behind card */}
                  <div className="absolute -inset-4 bg-primary/20 blur-2xl -z-10 rounded-full opacity-40"></div>
                </div>
              </div>
            </div>
          </div>

          {/* form */}
          <div className="w-full lg:w-7/12 xl:w-2/3">
            <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl shadow-lg rounded-3xl p-8 md:p-10 border border-white/50 dark:border-gray-700/50 h-full">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold">Club Details</h2>
                <span className="text-xs font-semibold text-muted-light dark:text-muted-dark bg-white/50 dark:bg-gray-800/50 px-3 py-1 rounded-full border border-border-light dark:border-border-dark">
                  Step 1 of 1
                </span>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Name Input */}
                  <div className="space-y-3 md:col-span-2">
                    <label className="block text-sm font-bold" htmlFor="name">
                      Club Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Quantum Computing Society"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-border-light dark:border-border-dark focus:bg-white dark:focus:bg-gray-800 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-sm text-foreground-light dark:text-foreground-dark placeholder-muted-light/60"
                    />
                    <p className="text-xs text-muted-light dark:text-muted-dark">
                      Choose a unique and descriptive name.
                    </p>
                  </div>

                  {/* Category Select */}
                  <div className="space-y-3 md:col-span-2">
                    <label
                      className="block text-sm font-bold"
                      htmlFor="category"
                    >
                      Category
                    </label>
                    <div className="relative">
                      <select
                        id="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-border-light dark:border-border-dark focus:bg-white dark:focus:bg-gray-800 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-sm appearance-none cursor-pointer text-foreground-light dark:text-foreground-dark"
                      >
                        {[
                          "Tech",
                          "Art",
                          "Sports",
                          "Music",
                          "Business",
                          "Social",
                          "Science",
                          "Other",
                        ].map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      {/* Arrow Icon */}
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-muted-light dark:text-muted-dark">
                        <svg
                          className="w-4 h-4 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Image Upload Area */}
                  <div className="space-y-3 md:col-span-2">
                    <span className="block text-sm font-bold">Cover Image</span>
                    <label
                      htmlFor="image-upload"
                      className="border-2 border-dashed border-border-light dark:border-border-dark rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-white/40 dark:hover:bg-gray-800/40 hover:border-primary/50 transition-all cursor-pointer group bg-white/20 dark:bg-gray-800/20"
                    >
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <div className="size-12 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                        <CloudUpload className="text-primary" />
                      </div>
                      <p className="text-sm font-medium">
                        {imageFile
                          ? imageFile.name
                          : "Click to upload or drag and drop"}
                      </p>
                      <p className="text-xs text-muted-light dark:text-muted-dark mt-1">
                        SVG, PNG, JPG (max. 3MB)
                      </p>
                    </label>
                  </div>

                  {/* Description Textarea */}
                  <div className="space-y-3 md:col-span-2">
                    <label
                      className="block text-sm font-bold"
                      htmlFor="description"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe the club's mission, activities, and what members can expect..."
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-border-light dark:border-border-dark focus:bg-white dark:focus:bg-gray-800 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-sm min-h-[140px] resize-y text-foreground-light dark:text-foreground-dark placeholder-muted-light/60"
                    />
                    <div className="flex justify-between text-xs text-muted-light dark:text-muted-dark">
                      <span>Be concise and engaging.</span>
                      <span>{formData.description.length}/300</span>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-6 border-t border-border-light dark:border-border-dark flex items-center justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className="px-6 py-2.5 rounded-xl text-muted-light dark:text-muted-dark font-bold text-sm hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/25 hover:bg-primary-hover hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      "Creating..."
                    ) : (
                      <>
                        <PlusCircle size={18} /> Create Club
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateClub;
