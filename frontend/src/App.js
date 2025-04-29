import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ManualPredict from "./pages/ManualPredict";
import BatchPredict from "./pages/BatchPredict";
import Predict from "./pages/Predict";
import Result from "./pages/Result";
import Feedback from "./pages/Feedback";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/manual-predict" element={<ManualPredict />} />
        <Route path="/batch-predict" element={<BatchPredict />} />
        <Route path="/predict" element={<Predict />} />
        <Route path="/result" element={<Result />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
      <Footer />
      <ToastContainer />
    </Router>
  );
}

export default App;
