import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Navbar() {
  return (
    <motion.nav className="bg-blue-600 p-4 flex justify-between items-center shadow-lg"
      initial={{ y: -50 }}
      animate={{ y: 0 }}
    >
      <div className="text-white font-bold text-2xl">SepsisApp</div>
      <div className="space-x-6">
        <Link to="/" className="text-white hover:underline">Home</Link>
        <Link to="/manual-predict" className="text-white hover:underline">Manual</Link>
        <Link to="/batch-predict" className="text-white hover:underline">Batch</Link>
        <Link to="/feedback" className="text-white hover:underline">Feedback</Link>
      </div>
    </motion.nav>
  );
}

export default Navbar;
