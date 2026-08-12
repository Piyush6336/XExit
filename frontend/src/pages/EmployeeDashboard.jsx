import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function EmployeeDashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const [showResignationForm, setShowResignationForm] = useState(false);
const [lwd, setLwd] = useState("");
const [message, setMessage] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
const [resignation, setResignation] = useState(null);
const [statusError, setStatusError] = useState("");

const handleResignation = async (e) => {
  e.preventDefault();

  setMessage("");
  setError("");

  if (!lwd) {
    setError("Please select your last working day.");
    return;
  }

  try {
    setLoading(true);

    const response = await api.post("/user/resign", {
      lwd,
    });

    setMessage("Resignation submitted successfully.");
    setShowResignationForm(false);
    setLwd("");

    console.log(response.data);
  } catch (error) {
    setError(
      error.response?.data?.message ||
        "Failed to submit resignation."
    );
  } finally {
    setLoading(false);
  }
};

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");

    navigate("/");
  };
const handleViewStatus = async () => {
  try {
    setStatusError("");

    const response = await api.get("/user/resignation-status");

    setResignation(response.data.data.resignation);
  } catch (error) {
    setStatusError(
      error.response?.data?.message ||
        "Unable to fetch resignation status."
    );
  }
};
  return (
    <div className="dashboard">
      <header className="navbar">
        <div>
          <h2>ExitEase</h2>
        </div>

        <div className="navbar-right">
          <span>Welcome, {username}</span>

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <h1>Employee Dashboard</h1>
        {message && (
    <p className="success">
      {message}
    </p>
  )}

        <div className="dashboard-grid">

          <div className="dashboard-card">
            <h3>Submit Resignation</h3>

            <p>
              Submit your resignation request and provide
              your intended last working day.
            </p>

            <button
              onClick={() =>
                setShowResignationForm(!showResignationForm)
              }
            >
              Submit Resignation
            </button>
          </div>

          <div className="dashboard-card">
            <h3>Resignation Status</h3>

            <p>
              Check the current status of your resignation
              request.
            </p>

            <button onClick={handleViewStatus}>
  View Status
</button>
{statusError && (
  <p className="error">
    {statusError}
  </p>
)}

{resignation && (
  <div className="status-box">
    <p>
      <strong>Status:</strong>{" "}
      {resignation.status}
    </p>

    <p>
      <strong>Last Working Day:</strong>{" "}
      {resignation.lwd}
    </p>

    {resignation.exitDate && (
      <p>
        <strong>Exit Date:</strong>{" "}
        {resignation.exitDate}
      </p>
    )}
  </div>
)}
          </div>

          <div className="dashboard-card">
            <h3>Exit Interview</h3>

            <p>
              Complete your exit interview after your
              resignation is approved.
            </p>

           <button
  onClick={() => navigate("/exit-interview")}
>
  Open Exit Interview
</button>
          </div>

        </div>

        {showResignationForm && (
  <div className="form-card">
    <h2>Submit Resignation</h2>

    <p>
      Select your intended last working day.
    </p>

    <form onSubmit={handleResignation}>
      <label>Last Working Day</label>

      <input
        type="date"
        value={lwd}
        onChange={(e) => setLwd(e.target.value)}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit Resignation"}
      </button>
    </form>

    {error && (
      <p className="error">
        {error}
      </p>
    )}
  </div>
)}
      </main>
    </div>
  );
}

export default EmployeeDashboard;