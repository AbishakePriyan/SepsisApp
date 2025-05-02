import React from "react";
import ProbabilityChart from "../components/ProbabilityChart"; // adjust path if needed

function Result() {
  const prediction = JSON.parse(localStorage.getItem("predictionResult"));
  const inputValues = JSON.parse(localStorage.getItem("inputValues")); // assuming you stored input too

  const riskLevel = prediction?.sepsis_risk ? "High Risk ⚠️" : "Low Risk ✅";
  const riskColor = prediction?.sepsis_risk ? "text-red-500" : "text-green-500";

  const featureLabels = {
    PRG: "Plasma Glucose",
    PL: "Blood Work R1",
    PR: "Blood Pressure",
    SK: "Blood Work R2",
    TS: "Blood Work R3",
    M11: "Blood Work R4",
    BD2: "Body Mass Index",
    Age: "Age",
    Insurance: "Insurance",
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6 text-yellow-400">Prediction Result</h1>

      {prediction ? (
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-3xl text-center animate-fade-in">
          <p className={`text-2xl font-bold mb-4 ${riskColor}`}>{riskLevel}</p>

          <div className="my-6">
            <h2 className="text-xl font-semibold text-yellow-300 mb-2">Prediction Probabilities</h2>
            <ProbabilityChart probabilities={prediction.probabilities} />
          </div>

          <div className="mt-8 text-left">
            <h2 className="text-xl font-semibold text-yellow-300 mb-4">Patient Data Analysis</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {inputValues &&
                Object.entries(inputValues).map(([key, value]) => (
                  <div
                    key={key}
                    className="bg-gray-800 p-4 rounded shadow text-gray-200 hover:bg-gray-700 transition"
                  >
                    <p className="font-semibold text-yellow-400">{featureLabels[key]}</p>
                    <p>{value}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-400 text-lg">No prediction data found.</p>
      )}
    </div>
  );
}

export default Result;
