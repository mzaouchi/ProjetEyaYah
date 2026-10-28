import {
  CURRENT_USER,
  FAIL,
  LOGIN,
  LOGOUT,
  REGISTER,
  GET_ALL_USERS_SUCCESS,
  GET_ALL_USERS_FAIL,
} from "../ActionsTypes/UsersTypes";
import axios from "axios";

export const getAllUsers = () => async (dispatch) => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.get("/api/auth/all-users", {
      headers: { Authorization: token },
    });
    dispatch({
      type: GET_ALL_USERS_SUCCESS,
      payload: res.data.users,
    });
  } catch (error) {
    dispatch({
      type: GET_ALL_USERS_FAIL,
      payload: error.response?.data,
    });
  }
};

export const register = (newUser, navigate) => async (dispatch) => {
  try {
    const res = await axios.post("/api/auth/SignUp", newUser);
    dispatch(getAllUsers());

    navigate("/admin-dashboard");
  } catch (error) {
    console.log(
      "Backend Error Details:",
      error.response?.data.errors || error.response?.data,
    );
    dispatch({
      type: FAIL,
      payload: error.response?.data || error.message,
    });
  }
};

export const login = (userCredential, navigate) => async (dispatch) => {
  try {
    const res = await axios.post("/api/auth/SignIn", userCredential);

    localStorage.setItem("token", res.data.token);

    dispatch({
      type: LOGIN,
      payload: res.data,
    });

    navigate("/profile");
  } catch (error) {
    dispatch({
      type: FAIL,
      payload: error.response?.data || error.message,
    });
  }
};

export const currentUser = () => async (dispatch) => {
  try {
    const config = {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    };
    const res = await axios.get("/api/auth/current", config);
    dispatch({
      type: CURRENT_USER,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: FAIL,
      payload: error.response?.data || error.message,
    });
  }
};

export const updateProfile = (updatedData) => async (dispatch) => {
  try {
    const config = {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    };
    await axios.put("/api/auth/update", updatedData, config);

    alert("Profile updated successfully!");

    dispatch(currentUser());
  } catch (error) {
    console.log("Update Profile Error:", error.response?.data);
    dispatch({
      type: FAIL,
      payload: error.response?.data || error.message,
    });
    alert(error.response?.data?.errors?.[0]?.msg || "Update failed");
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("token");
  dispatch({ type: LOGOUT });
};

export const deleteAccount = (navigate) => async (dispatch) => {
  try {
    const config = {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    };
    await axios.delete("/api/auth/delete", config);

    localStorage.removeItem("token");
    dispatch({ type: LOGOUT });

    navigate("/register");
  } catch (error) {
    console.log("Delete Account Error:", error.response?.data);
  }
};

export const deleteUser = (id) => async (dispatch) => {
  const token = localStorage.getItem("token");
  try {
    await axios.delete(`/api/auth/delete-user/${id}`, {
      headers: { Authorization: token },
    });
    dispatch(getAllUsers());
  } catch (error) {
    console.log("Delete User Error:", error.response?.data);
    alert(error.response?.data?.errors?.[0]?.msg || "Delete failed");
  }
};

export const updateUser = (id, updatedData) => async (dispatch) => {
  const token = localStorage.getItem("token");
  try {
    await axios.put(`/api/auth/update-user/${id}`, updatedData, {
      headers: { Authorization: token },
    });
    dispatch(getAllUsers());
  } catch (error) {
    console.error(
      "Error updating user:",
      error.response?.data || error.message,
    );
    alert(error.response?.data?.errors?.[0]?.msg || "Update failed");
  }
};

export const createUserByAdmin =
  (userData, handleCloseModal) => async (dispatch) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post("/api/auth/create-user", userData, {
        headers: { Authorization: token },
      });
      alert(res.data.msg || "Utilisateur créé avec succès");
      dispatch(getAllUsers());
      if (handleCloseModal) handleCloseModal();
    } catch (error) {
      console.error(
        "Error creating user:",
        error.response.data || error.message,
      );
      alert(
        error.response?.data?.errors?.[0]?.msg || "Erreur lors de la création",
      );
    }
  };
