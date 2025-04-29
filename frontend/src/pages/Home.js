import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function Home() {
  return (
    <motion.div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-4xl font-bold text-blue-800 mb-6">Sepsis Early Warning System</h1>
      <p className="text-lg text-gray-700 mb-8 text-center max-w-2xl">
        Early detection saves lives. Predict sepsis risk using advanced AI. Choose manual entry or batch upload.
      </p>
      <div className="flex space-x-6">
        <Link to="/manual-predict" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">Manual Prediction</Link>
        <Link to="/batch-predict" className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700">Batch Prediction</Link>
      </div>
    </motion.div>
  );
}

export default Home;
