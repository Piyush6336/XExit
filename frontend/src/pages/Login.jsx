import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:3001/api/auth/login",
        {
          username,
          password,
        }
      );

      const token = response.data.token;

      localStorage.setItem("token", token);

      // JWT payload decode
      const payload = JSON.parse(atob(token.split(".")[1]));

      localStorage.setItem("role", payload.role);
      localStorage.setItem("username", payload.username);

      if (payload.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/employee");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Invalid username or password"
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>ExitEase</h1>

        <p className="subtitle">
          Employee Exit Management System
        </p>

        <form onSubmit={handleLogin}>
          <label>Username</label>

          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error">{error}</p>}

          <button type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;