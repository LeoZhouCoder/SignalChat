import { USER_LOGIN, USER_LOGOUT } from "../actionTypes";

const initialState = {
  currentUser: null
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case USER_LOGIN:
      console.log(USER_LOGIN, action.payload);
      return { ...state, currentUser: action.payload };
    case USER_LOGOUT:
      return { ...state, currentUser: null };
    default:
      return state;
  }
}
