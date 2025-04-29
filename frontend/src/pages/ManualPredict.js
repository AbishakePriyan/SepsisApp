import { useState } from "react";
import { predictSepsis } from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function ManualPredict() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    PRG: "", PL: "", PR: "", SK: "", TS: "", M11: "", BD2: "", Age: "", Insurance: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await predictSepsis(formData);
      localStorage.setItem("predictionResult", JSON.stringify(response.data));
      toast.success("Prediction Successful!");
      navigate("/result");
    } catch (error) {
      toast.error("Prediction Failed!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-black text-white p-8">
      <div className="w-full max-w-lg bg-gray-900 rounded-lg shadow-lg p-8 mt-10">
        <h2 className="text-3xl font-bold mb-6 text-center text-yellow-400">
          Manual Sepsis Prediction
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {Object.keys(formData).map((field) => (
            <input
              key={field}
              name={field}
              type="number"
              value={formData[field]}
              onChange={handleChange}
              placeholder={field}
              required
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          ))}
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold p-3 rounded-md transition"
          >
            Predict
          </button>
        </form>
      </div>
    </div>
  );
}

export default ManualPredict;
