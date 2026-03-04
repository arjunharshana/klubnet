import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  X,
  MapPin,
  Calendar,
  Clock,
  AlignLeft,
  CheckCircle,
  Loader,
} from "lucide-react";

const CreateEvent = ({
  clubId,
  onClose,
  onEventCreated,
  eventToEdit = null,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditMode = !!eventToEdit;

  // Pre-fill form if editing
  useEffect(() => {
    if (eventToEdit) {
      const dateObj = new Date(eventToEdit.date);
      const dateStr = dateObj.toISOString().split("T")[0];
      const timeStr = dateObj.toTimeString().slice(0, 5);

      setFormData({
        title: eventToEdit.title,
        date: dateStr,
        time: timeStr,
        location: eventToEdit.location,
        description: eventToEdit.description,
      });
    }
  }, [eventToEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // combine date and time into a single Date object
      const dateTimeString = new Date(`${formData.date}T${formData.time}`);

      const payload = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        date: dateTimeString,
        clubId: clubId, // Pass the club ID
      };

      const API_URL = import.meta.env.VITE_API_URI;
      if (isEditMode) {
        // update existing event
        await axios.put(`${API_URL}/api/events/${eventToEdit._id}`, payload, {
          withCredentials: true,
        });
      } else {
        await axios.post(`${API_URL}/api/events`, payload, {
          withCredentials: true,
        });
      }

      onEventCreated(); // Refresh the list
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1c1022]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* card */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-[2.5rem] bg-white/80 dark:bg-gray-900/80 p-8 text-left shadow-2xl ring-1 ring-white/60 backdrop-blur-2xl transition-all">
        {/* header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-[#161118] dark:text-white">
              Create Event
            </h3>
            <p className="text-sm text-gray-500 font-medium mt-1">
              Add details for your new event
            </p>
          </div>
          <button
            onClick={onClose}
            className="group -mt-1 -mr-2 rounded-full p-2 text-gray-400 hover:bg-black/5 dark:hover:bg-white/10 hover:text-gray-600 transition-all"
          >
            <X
              className="group-hover:rotate-90 transition-transform duration-300"
              size={24}
            />
          </button>
        </div>

        {/* error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-xl font-medium">
            {error}
          </div>
        )}

        {/* form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* title */}
          <div className="group relative">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
              Event Title
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="block w-full rounded-2xl border-0 bg-white/50 dark:bg-gray-800/50 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-200 dark:ring-gray-700 placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-all"
              placeholder="e.g. Annual Tech Hackathon"
              type="text"
            />
          </div>

          {/* date & time grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="group relative">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                Date
              </label>
              <input
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="block w-full rounded-2xl border-0 bg-white/50 dark:bg-gray-800/50 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-200 dark:ring-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-all"
              />
            </div>
            <div className="group relative">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                Time
              </label>
              <input
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="block w-full rounded-2xl border-0 bg-white/50 dark:bg-gray-800/50 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-200 dark:ring-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-all"
              />
            </div>
          </div>

          {/* location */}
          <div className="group relative">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
              Location
            </label>
            <div className="relative rounded-2xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MapPin className="text-gray-400" size={20} />
              </div>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="block w-full rounded-2xl border-0 bg-white/50 dark:bg-gray-800/50 py-3 pl-10 pr-4 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-200 dark:ring-gray-700 placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-all"
                placeholder="e.g. Student Center, Room 304"
                type="text"
              />
            </div>
          </div>

          {/* description */}
          <div className="group relative">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="3"
              className="block w-full rounded-2xl border-0 bg-white/50 dark:bg-gray-800/50 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-200 dark:ring-gray-700 placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 resize-none transition-all"
              placeholder="Briefly describe what attendees can expect..."
            ></textarea>
          </div>

          <div className="pt-2"></div>

          {/* submit button */}
          <button
            type="submit"
            disabled={loading}
            className="relative w-full overflow-hidden rounded-2xl bg-primary py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader className="animate-spin" size={20} /> Processing...
              </>
            ) : (
              <>
                <CheckCircle
                  className="group-hover:scale-110 transition-transform"
                  size={20}
                />{" "}
                Publish Event
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
