import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function ExitInterview() {
  const navigate = useNavigate();

  const [careerGrowth, setCareerGrowth] = useState("");
  const [recommend, setRecommend] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!careerGrowth || !recommend) {
      setError("Please answer all questions.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/user/responses", {
        responses: [
          {
            questionText:
              "What prompted you to start looking for another job?",
            response: careerGrowth,
          },
          {
            questionText:
              "Would you recommend this company to others?",
            response: recommend,
          },
        ],
      });

      setMessage(
        "Exit questionnaire submitted successfully."
      );

      setCareerGrowth("");
      setRecommend("");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to submit exit questionnaire."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <header className="navbar">
        <h2>ExitEase</h2>

        <button onClick={() => navigate("/employee")}>
          Back to Dashboard
        </button>
      </header>

      <main className="interview-container">
        <div className="interview-card">
          <h1>Exit Interview</h1>

          <p className="subtitle">
            Please share your feedback about your experience
            with the company.
          </p>

          <form onSubmit={handleSubmit}>
            <label>
              What prompted you to start looking for another
              job?
            </label>

            <textarea
              value={careerGrowth}
              onChange={(e) =>
                setCareerGrowth(e.target.value)
              }
              placeholder="Share your reason..."
              rows="5"
              required
            />

            <label>
              Would you recommend this company to others?
            </label>

            <select
              value={recommend}
              onChange={(e) =>
                setRecommend(e.target.value)
              }
              required
            >
              <option value="">
                Select an option
              </option>

              <option value="Yes">
                Yes
              </option>

              <option value="Yes, with some reservations">
                Yes, with some reservations
              </option>

              <option value="No">
                No
              </option>
            </select>

            {error && (
              <p className="error">
                {error}
              </p>
            )}

            {message && (
              <p className="success">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Submitting..."
                : "Submit Interview"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default ExitInterview;