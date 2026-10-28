import { Routes, Route } from "react-router-dom";
import NavAuth from "./Components/NavAuth";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Profile from "./Components/Profile";
import PrivateRoute from "./Components/PrivateRoute";
import AdminDashboard from "./Components/AdminDashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import BiologisteDashboard from "./Components/BiologisteDashboard";

function App() {
  return (
    <div className="App">
      <NavAuth />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route
            path="/biologiste-dashboard"
            element={<BiologisteDashboard />}
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
