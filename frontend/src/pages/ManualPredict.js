import { useState } from "react";
import { predictSepsis } from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function ManualPredict() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    PRG: "", PL: "", PR: "", SK: "", TS: "", M11: "", BD2: "", Age: "", Insurance: ""
  });

  const fieldPlaceholders = {
    PRG: "Plasma Glucose",
    PL: "Blood Work R1",
    PR: "Blood Pressure",
    SK: "Blood Work R2",
    TS: "Blood Work R3",
    M11: "Blood Work R4",
    BD2: "Body Mass Index",
    Age: "Age",
    Insurance: "Insurance (Yes = 1 or No = 0)"
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special validation for Insurance field
    if (name === "Insurance") {
      // Only allow 0, 1, or empty string (for backspace)
      if (value === "" || (Number(value) >= 0 && Number(value) <= 1)) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Additional validation for Insurance before submission
    if (formData.Insurance !== "0" && formData.Insurance !== "1") {
      toast.error("Insurance must be 0 or 1");
      return;
    }
    
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
              placeholder={fieldPlaceholders[field]}
              required
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              // Add min and max for Insurance field
              {...(field === "Insurance" && { 
                min: "0",
                max: "1",
                step: "1"
              })}
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