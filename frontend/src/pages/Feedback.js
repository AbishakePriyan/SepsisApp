import { useState } from "react";
import { submitFeedback } from "../services/api";
import { toast } from "react-toastify";

function Feedback() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    feedbackText: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitFeedback(formData);
      toast.success("Feedback submitted successfully!");
      setFormData({ name: "", email: "", feedbackText: "" });
    } catch (error) {
      toast.error("Failed to submit feedback.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-black text-white p-8">
      <div className="w-full max-w-lg bg-gray-900 rounded-lg shadow-lg p-8 mt-10">
        <h2 className="text-3xl font-bold mb-6 text-center text-yellow-400">Submit Your Feedback</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />

          {/* Email Input */}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />

          {/* Feedback Textarea */}
          <textarea
            name="feedbackText"
            value={formData.feedbackText}
            onChange={handleChange}
            placeholder="Your Feedback"
            rows="5"
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold p-3 rounded-md transition"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
}

export default Feedback;
