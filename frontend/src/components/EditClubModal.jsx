import React, { useState } from "react";
import axios from "axios";
import { X, Camera, Save, Loader } from "lucide-react";

const EditClubModal = ({ club, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: club.name || "",
    category: club.category || "Tech",
    description: club.description || "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(club.image || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const API_URL = import.meta.env.VITE_API_URI;
      const data = new FormData();

      data.append("name", formData.name);
      data.append("category", formData.category);
      data.append("description", formData.description);

      if (imageFile) {
        data.append("image", imageFile);
      }

      await axios.put(`${API_URL}/api/clubs/${club._id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      onSuccess();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update club details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={!loading ? onClose : undefined}
      ></div>

      {/* Modal Content */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-2xl relative z-10 flex flex-col max-h-[90vh] overflow-hidden border border-border-light dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-light dark:border-gray-700 shrink-0">
          <h2 className="text-xl font-bold text-foreground-light dark:text-foreground-dark">
            Edit Club Details
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-muted-light disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="overflow-y-auto p-6 custom-scrollbar">
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-600 border border-red-200 dark:border-red-800 p-4 rounded-xl text-sm font-bold">
              {error}
            </div>
          )}

          <form
            id="edit-club-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Image Upload */}
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="relative group cursor-pointer w-full max-w-sm h-48 rounded-2xl overflow-hidden border-2 border-dashed border-border-light dark:border-gray-600 bg-gray-50 dark:bg-gray-900">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-light">
                    <Camera size={32} className="mb-2 opacity-50" />
                    <span className="text-sm font-medium">
                      Upload Cover Image
                    </span>
                  </div>
                )}

                <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
                  <Camera size={32} className="mb-2" />
                  <span className="text-sm font-bold">Change Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-foreground-light dark:text-foreground-dark">
                  Club Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-border-light dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-foreground-light dark:text-white"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-foreground-light dark:text-foreground-dark">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-border-light dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-foreground-light dark:text-white appearance-none cursor-pointer"
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
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-foreground-light dark:text-foreground-dark">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-border-light dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-foreground-light dark:text-white resize-none"
                ></textarea>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border-light dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl font-bold text-muted-light dark:text-muted-dark hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-club-form"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl font-bold text-white bg-primary hover:bg-primary-hover shadow-lg shadow-primary/30 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
          >
            {loading ? (
              <Loader className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditClubModal;
