import React, { useState } from 'react';
import Papa from 'papaparse';

const REQUIRED_FIELDS = ['PRG','PL','PR','SK','TS','M11','BD2','Age','Insurance'];

function BatchPredict() {
  const [file, setFile] = useState(null);
  const [missingFields, setMissingFields] = useState([]);
  const [records, setRecords] = useState([]);          
  const [summary, setSummary] = useState(null);        
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFile = (f) => {
    setFile(f);
    setMissingFields([]);
    setRecords([]);
    setSummary(null);
    setError(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };
  const handleDragOver = (e) => e.preventDefault();
  const handleChange = (e) => handleFile(e.target.files[0]);

  const handleUpload = (e) => {
    e.preventDefault();
    if (!file) return alert('Please select or drop a CSV file.');

    setLoading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const fields = results.meta.fields || [];
        // 1️⃣ Validate columns
        const missing = REQUIRED_FIELDS.filter(f => !fields.includes(f));
        if (missing.length) {
          setMissingFields(missing);
          setLoading(false);
          return;
        }

        // 2️⃣ Send the original file to backend
        const formData = new FormData();
        formData.append('file', file);

        try {
          const resp = await fetch('http://localhost:5000/api/batch-predict', {
            method: 'POST',
            body: formData,
          });
          const json = await resp.json();
          if (!resp.ok) throw new Error(json.error || 'Server error');

          // 3️⃣ Combine IDs with backend predictions
          // assume backend returns { predictions: [0,1,0,1,...] }
          const preds = json.predictions;
          const recs = results.data.map((row, i) => {
            const id = row.ID || `Row ${i+1}`;
            const isSepsis = preds[i] === 1 || preds[i] === 'Sepsis' || preds[i] === 'High Risk';
            return {
              id,
              risk: isSepsis ? '⚠️ High Risk' : '🟢 Low Risk'
            };
          });

          // 4️⃣ Summarize
          const highCount = recs.filter(r => r.risk.includes('⚠️')).length;
          const lowCount  = recs.length - highCount;
          setRecords(recs);
          setSummary({ total: recs.length, highCount, lowCount });
        } catch (err) {
          console.error(err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      },
      error: (err) => {
        console.error(err);
        setError('Failed to parse CSV');
        setLoading(false);
      }
    });
  };

  return (
    <div
      className="flex flex-col items-center justify-start min-h-screen bg-black text-white p-6"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <h1 className="text-3xl font-bold mb-6">Batch Prediction</h1>

      <form onSubmit={handleUpload} className="w-full max-w-xl space-y-4">
        {/* Drag & Drop + File Input */}
        <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
          {file
            ? <p className="text-green-400">{file.name}</p>
            : <p className="text-gray-400">Drag & drop CSV here, or click to select</p>
          }
          <input
            type="file"
            accept=".csv"
            onChange={handleChange}
            className="relative"
          />
        </div>

        {/* Missing Fields Error */}
        {missingFields.length > 0 && (
          <div className="bg-red-900 p-4 rounded">
            <strong>Data Insufficient:</strong> Missing columns:{' '}
            {missingFields.join(', ')}
          </div>
        )}

        {/* Server / Parsing Error */}
        {error && (
          <div className="bg-red-900 p-4 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Upload Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-700 hover:bg-blue-800 py-3 rounded font-semibold transition"
        >
          {loading ? 'Processing…' : 'Upload & Predict'}
        </button>
      </form>

      {/* Results Table */}
      {records.length > 0 && (
        <div className="mt-8 w-full max-w-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="px-4 py-2">Patient ID</th>
                <th className="px-4 py-2">Rough Risk</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={i} className="odd:bg-gray-900 even:bg-gray-800">
                  <td className="px-4 py-2">{r.id}</td>
                  <td className="px-4 py-2">{r.risk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary */}
      {summary && (
        <div className="mt-6 bg-gray-900 p-4 rounded max-w-md w-full text-center">
          <p className="text-lg"><strong>Total Patients:</strong> {summary.total}</p>
          <p className="text-lg text-green-400"><strong>Low Risk:</strong> {summary.lowCount}</p>
          <p className="text-lg text-red-400"><strong>High Risk:</strong> {summary.highCount}</p>
        </div>
      )}
    </div>
  );
}

export default BatchPredict;
