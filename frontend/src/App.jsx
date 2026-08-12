import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ExitInterview from "./pages/ExitInterview";
import AdminDashboard from "./pages/AdminDashboard";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/employee"
          element={<EmployeeDashboard />}
        />
        <Route
  path="/exit-interview"
  element={<ExitInterview />}
/>
        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        <Route
          path="*"
          element={<Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;