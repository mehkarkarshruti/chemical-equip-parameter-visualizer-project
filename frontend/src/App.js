// imports
import React, { useEffect, useState } from "react";
import "./App.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function App() {
  // React state
  const [summary, setSummary] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  // Fetch history when page loads
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/history/")
      .then((res) => res.json())
      .then((data) => setHistory(data))
      .catch((err) => console.error("History fetch error:", err));
  }, []);

  // Upload handler
  function handleUpload() {
    if (!file) return alert("Please select a CSV file first.");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    fetch("http://127.0.0.1:8000/api/upload/", {
      method: "POST",
      body: formData
    })
      .then((res) => {
        if (!res.ok) throw new Error("Upload failed");
        return res.json();
      })
      .then((data) => {
        setSummary(data);
        setError(null);

        // refresh history after upload
        return fetch("http://127.0.0.1:8000/api/history/");
      })
      .then((res) => res.json())
      .then((data) => setHistory(data))
      .catch((err) => {
        console.error("Upload error:", err);
        setError("Upload failed. Please try again.");
      })
      .finally(() => setLoading(false));
  }

  // Loading spinner
  if (loading) return <p style={{ fontSize: "18px" }}>⏳ Loading...</p>;

  // Error message
  if (error) {
    return (
      <div style={{ padding: "20px", color: "red" }}>
        <h2>Error</h2>
        <p>{error}</p>
        <h3>Upload CSV File</h3>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button onClick={handleUpload}>Upload</button>
      </div>
    );
  }

  // If no summary yet
  if (!summary && !loading) {
    return (
      <div className="container">
        <h1>Chemical Equipment Summary</h1>
        <div className="card">
          <h2>Upload CSV File</h2>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button onClick={handleUpload} style={{ marginLeft: "10px" }}>
            Upload
          </button>
          <p style={{ marginTop: "10px", color: "#555" }}>
            Please upload a CSV file to view equipment analysis.
          </p>
        </div>
      </div>
    );
  }

  // Chart data
  const typeLabels = Object.keys(summary.type_distribution);
  const typeValues = Object.values(summary.type_distribution);

  const typeChartData = {
    labels: typeLabels,
    datasets: [
      {
        label: "Equipment Count",
        data: typeValues,
        backgroundColor: "rgba(75,192,192,0.6)"
      }
    ]
  };

  const avgChartData = {
    labels: ["Flowrate", "Pressure", "Temperature"],
    datasets: [
      {
        label: "Averages",
        data: [
          summary.avg_flowrate,
          summary.avg_pressure,
          summary.avg_temperature
        ],
        backgroundColor: "rgba(153,102,255,0.6)"
      }
    ]
  };

  // JSX
  return (
    <div className="container">
      <h1>Chemical Equipment Summary</h1>

      {/* Upload section */}
      <div className="card">
        <h2>Upload CSV File</h2>
        <div className="upload-row">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button onClick={handleUpload}>Upload</button>
        </div>
      </div>

      {/* Overview table */}
      <div className="card">
        <h2>Overview</h2>
        <table>
          <tbody>
            <tr>
              <td>Total Equipment</td>
              <td>{summary.total_equipment}</td>
            </tr>
            <tr>
              <td>Avg Flowrate</td>
              <td>{summary.avg_flowrate.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Avg Pressure</td>
              <td>{summary.avg_pressure.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Avg Temperature</td>
              <td>{summary.avg_temperature.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Charts */}
      <div className="card">
        <h2>Type Distribution</h2>
        <Bar data={typeChartData} />
      </div>

      <div className="card">
        <h2>Average Parameters</h2>
        <Bar data={avgChartData} />
      </div>

      {/* History */}
      <div className="card">
        <h2>Recent Uploads</h2>
        <table>
          <thead>
            <tr>
              <th>Uploaded At</th>
              <th>Total</th>
              <th>Flowrate</th>
              <th>Pressure</th>
              <th>Temperature</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, index) => (
              <tr key={index}>
                <td>{new Date(item.uploaded_at).toLocaleString()}</td>
                <td>{item.total_equipment}</td>
                <td>{item.avg_flowrate.toFixed(2)}</td>
                <td>{item.avg_pressure.toFixed(2)}</td>
                <td>{item.avg_temperature.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card">
        <h2>Download Report</h2>
        <a
          href="http://127.0.0.1:8000/api/report/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button>Download PDF Report</button>
        </a>
      </div>
    </div>
  );
}

export default App;