import {
  CURRENT_USER,
  FAIL,
  LOGIN,
  LOGOUT,
  REGISTER,
  GET_ALL_USERS_SUCCESS,
  GET_ALL_USERS_FAIL,
} from "../ActionsTypes/UsersTypes";

const initialState = {
  user: null,
  allUsers: [],
  load: false,
  errors: null,
  isAuth: false,
};

export const UsersReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case REGISTER:
      return {
        ...state,
        load: false,
        user: payload.user,
        errors: null,
      };

    case LOGIN:
      return {
        ...state,
        load: false,
        user: payload.user,
        isAuth: true,
        errors: null,
      };

    case CURRENT_USER:
      return {
        ...state,
        load: false,
        user: payload.user || payload,
        isAuth: true,
        errors: null,
      };

    case GET_ALL_USERS_SUCCESS:
      return {
        ...state,
        allUsers: payload,
      };

    case GET_ALL_USERS_FAIL:
      return {
        ...state,
        load: false,
        errors: payload,
      };

    case FAIL:
      return {
        ...state,
        load: false,
        errors: payload,
      };

    case LOGOUT:
      return {
        ...state,
        user: null,
        allUsers: [],
        isAuth: false,
        load: false,
        errors: null,
      };

    default:
      return state;
  }
};
