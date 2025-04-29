import axios from "axios";

const API_URL = "http://localhost:5000/api"; // Adjust if deployed

export const predictSepsis = async (data) => {
  return await axios.post(`${API_URL}/predict`, data);
};

export const submitFeedback = async (data) => {
  return await axios.post(`${API_URL}/feedback`, data);
};

export const batchpredict = async (data) => {
  return await axios.post(`${API_URL}/batch-predict`, data);
};

