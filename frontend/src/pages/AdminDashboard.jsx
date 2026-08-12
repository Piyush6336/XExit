import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [resignations, setResignations] = useState([]);
  const [responses, setResponses] = useState([]);
  const [error, setError] = useState("");
  const [exitDates, setExitDates] = useState({});

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");

    navigate("/");
  };

  const loadResignations = async () => {
    try {
      setError("");

      const response = await api.get("/admin/resignations");

      setResignations(response.data.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load resignations."
      );
    }
  };

  const loadResponses = async () => {
    try {
      setError("");

      const response = await api.get(
        "/admin/exit_responses"
      );

      setResponses(response.data.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load exit interview responses."
      );
    }
  };
  const handleExitDateChange = (resignationId, date) => {
  setExitDates((prev) => ({
    ...prev,
    [resignationId]: date,
  }));
};
const handleConcludeResignation = async (
  resignationId,
  approved,
  lwd
) => {
  try {
    setError("");

    const selectedExitDate =
      exitDates[resignationId] || lwd;

    await api.put("/admin/conclude_resignation", {
      resignationId,
      approved,
      lwd: selectedExitDate,
    });

    await loadResignations();
  } catch (error) {
    setError(
      error.response?.data?.message ||
        "Failed to update resignation."
    );
  }
};
  return (
    <div className="dashboard">
      <header className="navbar">
        <h2>ExitEase</h2>

        <div className="navbar-right">
          <span>Welcome, HR</span>

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <h1>HR Dashboard</h1>

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        <div className="dashboard-grid">

          <div className="dashboard-card">
            <h3>Resignation Requests</h3>

            <p>
              Review and manage employee resignation
              requests.
            </p>

            <button onClick={loadResignations}>
              View Resignations
            </button>
          </div>

          <div className="dashboard-card">
            <h3>Exit Interviews</h3>

            <p>
              Review completed employee exit interview
              questionnaires.
            </p>

            <button onClick={loadResponses}>
              View Responses
            </button>
          </div>

        </div>

        {resignations.length > 0 && (
          <div className="admin-section">
            <h2>Resignation Requests</h2>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
  <th>Employee ID</th>
  <th>Last Working Day</th>
  <th>Status</th>
  <th>Exit Date</th>
  <th>Action</th>
</tr>
                </thead>

                <tbody>
                  {resignations.map((resignation) => (
                    <tr key={resignation._id}>
  <td>
    {resignation.employeeId}
  </td>

  <td>
    {resignation.lwd}
  </td>

  <td>
    {resignation.status}
  </td>

  <td>
    {resignation.status === "pending" ? (
      <input
        type="date"
        value={
          exitDates[resignation._id] ||
          resignation.lwd
        }
        onChange={(e) =>
          handleExitDateChange(
            resignation._id,
            e.target.value
          )
        }
      />
    ) : (
      resignation.lwd
    )}
  </td>

  <td>
    {resignation.status === "pending" ? (
      <>
        <button
          onClick={() =>
            handleConcludeResignation(
              resignation._id,
              true,
              resignation.lwd
            )
          }
        >
          Approve
        </button>

        <button
          className="reject-btn"
          onClick={() =>
            handleConcludeResignation(
              resignation._id,
              false,
              resignation.lwd
            )
          }
        >
          Reject
        </button>
      </>
    ) : (
      <span>Completed</span>
    )}
  </td>
</tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {responses.length > 0 && (
          <div className="admin-section">
            <h2>Exit Interview Responses</h2>

            {responses.map((item) => (
              <div
                className="response-card"
                key={item._id}
              >
                <h3>
                  Employee: {item.employeeId}
                </h3>

                {item.responses.map((response, index) => (
                  <div key={index}>
                    <p>
                      <strong>
                        {response.questionText}
                      </strong>
                    </p>

                    <p>
                      {response.response}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;