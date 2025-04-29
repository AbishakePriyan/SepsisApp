function Result() {
  const prediction = JSON.parse(localStorage.getItem("predictionResult"));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6 text-yellow-400">Prediction Result</h1>

      {prediction ? (
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <p className="text-2xl mb-4">
            Sepsis Risk:{" "}
            <span
              className={`px-4 py-2 rounded-full font-semibold ${
                prediction.sepsis_risk
                  ? "bg-red-600 text-white animate-pulse"
                  : "bg-green-600 text-white"
              }`}
            >
              {prediction.sepsis_risk ? "⚠️ High Risk" : "🟢 Low Risk"}
            </span>
          </p>

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-yellow-300 mb-2">Prediction Probabilities</h2>
            <p className="text-gray-300">
              {prediction.probabilities.map((p, idx) => (
                <span key={idx} className="block">
                  Class {idx}: {Number(p).toFixed(2)}
                </span>
              ))}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-gray-400 text-lg">No prediction data found.</p>
      )}
    </div>
  );
}

export default Result;
