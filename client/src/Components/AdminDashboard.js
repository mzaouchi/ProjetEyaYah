import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllUsers,
  deleteUser,
  updateUser,
  createUserByAdmin,
} from "../Redux/Actions/UsersActions";

const ROLES = ["Patient", "Biologiste", "Admin", "SubAdmin"];

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.UsersReducer?.user);
  const allUsers = useSelector((state) => state.UsersReducer?.allUsers || []);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    phone: "",
    secondaryPhone: "",
    role: "Patient",
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    phone: "",
    secondaryPhone: "",
    role: "Patient",
  });

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")
    ) {
      dispatch(deleteUser(id));
    }
  };

  const handleEditClick = (u) => {
    setSelectedUser(u);
    setEditData({
      name: u.name || "",
      email: u.email || "",
      phone: u.phone || "",
      secondaryPhone: u.secondaryPhone || "",
      role: u.role || "Patient",
    });
    setShowEditModal(true);
  };

  const handleChange = (field) => (e) =>
    setEditData({ ...editData, [field]: e.target.value });

  const handleNewChange = (field) => (e) =>
    setNewUserData({ ...newUserData, [field]: e.target.value });

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    await dispatch(updateUser(selectedUser._id, editData));
    setSelectedUser(null);
    setShowEditModal(false);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    dispatch(
      createUserByAdmin(newUserData, () => {
        setNewUserData({
          name: "",
          email: "",
          phone: "",
          secondaryPhone: "",
          role: "Patient",
        });
        setShowCreateModal(false);
      }),
    );
  };

  const canEditUser = (targetUser) => {
    if (!user) return false;

    if (targetUser.role === "Patient" || targetUser.role === "Biologiste") {
      return true;
    }

    if (user.role === "Admin" && user._id === targetUser._id) {
      return true;
    }

    if (user.role === "Admin" && targetUser.role === "SubAdmin") {
      return true;
    }

    if (user.role === "SubAdmin" && targetUser.role === "Admin") {
      return true;
    }

    if (user.role === "SubAdmin" && user._id === targetUser._id) {
      return true;
    }

    return false;
  };

  const canDeleteUser = (targetUser) => {
    if (!user) return false;

    if (targetUser.role === "Patient" || targetUser.role === "Biologiste") {
      return true;
    }

    if (user.role === "Admin") {
      if (user._id === targetUser._id) return false;
      if (targetUser.role === "SubAdmin") return true;
    }

    if (user.role === "SubAdmin") {
      if (targetUser.role === "Admin") return false;
      if (user._id === targetUser._id) return true;
    }

    return false;
  };

  if (user && user.role !== "Admin" && user.role !== "SubAdmin") {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger" role="alert">
          <h3>🚫 Accès non autorisé</h3>
          <p>Cette page est réservée uniquement aux administrateurs.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-primary">👑 Admin Dashboard</h2>
          <span className="badge bg-primary fs-6">
            Total Utilisateurs : {allUsers.length}
          </span>
        </div>
        <button
          type="button"
          className="btn btn-success fw-bold shadow-sm"
          onClick={() => setShowCreateModal(true)}
        >
          ➕ Créer un utilisateur & envoyer le mot de passe
        </button>
      </div>

      {allUsers.length === 0 ? (
        <div className="alert alert-info text-center">
          Aucun utilisateur disponible
        </div>
      ) : (
        <div className="row">
          {allUsers.map((u) => (
            <div className="col-md-4 col-sm-6 mb-4" key={u._id}>
              <div className="card h-100 shadow-sm border-0 rounded-3">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="card-title fw-bold text-dark mb-0">
                      {u.name || "Sans nom"}
                    </h5>
                    <span
                      className={`badge ${
                        u.role === "Admin"
                          ? "bg-danger"
                          : u.role === "SubAdmin"
                            ? "bg-warning text-dark"
                            : u.role === "Biologiste"
                              ? "bg-success"
                              : "bg-secondary"
                      }`}
                    >
                      {u.role}
                    </span>
                  </div>

                  <hr />

                  <p className="card-text mb-1 text-muted">
                    <strong>📧 Email :</strong> {u.email}
                  </p>
                  <p className="card-text mb-1 text-muted">
                    <strong>📞 Tél :</strong> {u.phone || "Non disponible"}
                  </p>
                  {u.secondaryPhone && (
                    <p className="card-text mb-1 text-muted">
                      <strong>📱 Tél 2 :</strong> {u.secondaryPhone}
                    </p>
                  )}

                  <div className="mt-auto pt-3 d-flex justify-content-between gap-2">
                    {canEditUser(u) && (
                      <button
                        type="button"
                        className="btn btn-outline-warning btn-sm w-100 fw-bold"
                        onClick={() => handleEditClick(u)}
                      >
                        ✏️ Modifier
                      </button>
                    )}
                    {canDeleteUser(u) && (
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm w-100 fw-bold"
                        onClick={() => handleDelete(u._id)}
                      >
                        🗑️ Supprimer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showEditModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-warning text-dark">
                  <h5 className="modal-title fw-bold">
                    Modifier l'utilisateur
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setShowEditModal(false)}
                  ></button>
                </div>

                <form onSubmit={handleUpdateSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label fw-bold">Nom</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editData.name}
                        onChange={handleChange("name")}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={editData.email}
                        onChange={handleChange("email")}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Téléphone</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editData.phone}
                        onChange={handleChange("phone")}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        Téléphone secondaire
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={editData.secondaryPhone}
                        onChange={handleChange("secondaryPhone")}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Rôle</label>
                      <select
                        className="form-select"
                        value={editData.role}
                        onChange={handleChange("role")}
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowEditModal(false)}
                    >
                      Annuler
                    </button>
                    <button type="submit" className="btn btn-warning fw-bold">
                      Enregistrer les modifications
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {showCreateModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title fw-bold">
                    Créer un compte & envoyer le mot de passe
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    aria-label="Close"
                    onClick={() => setShowCreateModal(false)}
                  ></button>
                </div>

                <form onSubmit={handleCreateSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        Nom et Prénom
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={newUserData.name}
                        onChange={handleNewChange("name")}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={newUserData.email}
                        onChange={handleNewChange("email")}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Téléphone</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newUserData.phone}
                        onChange={handleNewChange("phone")}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        Téléphone secondaire
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={newUserData.secondaryPhone}
                        onChange={handleNewChange("secondaryPhone")}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Rôle</label>
                      <select
                        className="form-select"
                        value={newUserData.role}
                        onChange={handleNewChange("role")}
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowCreateModal(false)}
                    >
                      Annuler
                    </button>
                    <button type="submit" className="btn btn-success fw-bold">
                      Créer & Envoyer l'email
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
