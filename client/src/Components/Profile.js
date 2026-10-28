import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  currentUser,
  deleteAccount,
  updateProfile,
} from "../Redux/Actions/UsersActions";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userState = useSelector((state) => state.UsersReducer.user);
  const load = useSelector((state) => state.UsersReducer.load);

  const user = userState?.user || userState;

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [secondaryPhone, setSecondaryPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    dispatch(currentUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setSecondaryPhone(user.secondaryPhone || "");
    }
  }, [user]);

  const handleUpdate = (e) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    dispatch(
      updateProfile({
        name,
        email,
        phone,
        secondaryPhone,
        newPassword: newPassword ? newPassword : undefined,
      }),
    );

    setIsEditing(false);
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      dispatch(deleteAccount(navigate));
    }
  };

  if (load) {
    return <h2 className="text-center mt-5">Loading...</h2>;
  }

  return (
    <div className="container mt-5" style={{ maxWidth: "550px" }}>
      <div className="card shadow p-4 bg-light">
        <h2 className="text-center mb-4 text-primary">User Profile</h2>
        {user ? (
          <div>
            {!isEditing ? (
              <div>
                <hr />
                <p className="fs-5">
                  <strong>Name:</strong> {user.name || "N/A"}
                </p>
                <hr />
                <p className="fs-5">
                  <strong>Email:</strong> {user.email || "N/A"}
                </p>
                <hr />
                <p className="fs-5">
                  <strong>Phone (Required):</strong> {user.phone || "Not set"}
                </p>
                <hr />
                <p className="fs-5">
                  <strong>Secondary Phone (Optional):</strong>{" "}
                  {user.secondaryPhone || "None"}
                </p>
                <hr />
                <p className="fs-5">
                  <strong>Role:</strong>{" "}
                  <span className="badge bg-secondary">
                    {user.role || "Patient"}
                  </span>
                </p>

                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-warning w-100 mt-3 text-white fw-bold"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleDelete}
                  className="btn btn-danger w-100 mt-2 fw-bold"
                >
                  Delete Account
                </button>
              </div>
            ) : (
              <form onSubmit={handleUpdate}>
                <div className="mb-3">
                  <label className="form-label fw-bold">Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Email:</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Phone (Required):
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Secondary Phone (Optional):
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={secondaryPhone}
                    onChange={(e) => setSecondaryPhone(e.target.value)}
                  />
                </div>
                <hr />
                <h5 className="text-secondary text-center">Change Password</h5>
                <div className="mb-3">
                  <label className="form-label">New Password:</label>
                  <input
                    type="password"
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Leave blank to keep old password"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Confirm New Password:</label>
                  <input
                    type="password"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-success w-100 mt-2 fw-bold"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn btn-secondary w-100 mt-2"
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        ) : (
          <p className="text-center text-danger">
            No user data found. Please log in again.
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;
