import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { currentUser, logout } from "../Redux/Actions/UsersActions";
import { useEffect } from "react";

const NavAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuth = useSelector((state) => state.UsersReducer?.isAuth);
  const user = useSelector((state) => state.UsersReducer?.user);
  const token = localStorage.getItem("token");

  useEffect(() => {
    token && dispatch(currentUser());
  }, [dispatch, token]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand fw-bold" to="/">
        LabFlow
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div
        className="collapse navbar-collapse justify-content-end"
        id="navbarNav"
      >
        <ul className="navbar-nav align-items-center">
          <li className="nav-item">
            <Link className="nav-link" to="/">
              Home
            </Link>
          </li>

          {token && isAuth ? (
            <>
              {user && (user.role === "Admin" || user.role === "SubAdmin") && (
                <li className="nav-item">
                  <Link
                    className="nav-link text-warning fw-bold"
                    to="/admin-dashboard"
                  >
                    Admin Dashboard
                  </Link>
                </li>
              )}

              {user && user.role === "Biologiste" && (
                <li className="nav-item">
                  <Link
                    className="nav-link text-success fw-bold"
                    to="/biologiste-dashboard"
                  >
                    Biologiste Dashboard
                  </Link>
                </li>
              )}

              <li className="nav-item">
                <Link className="nav-link" to="/profile">
                  Profile
                </Link>
              </li>

              <li className="nav-item ms-2">
                <button
                  className="btn btn-danger btn-sm"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <Link className="nav-link" to="/login">
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavAuth;
