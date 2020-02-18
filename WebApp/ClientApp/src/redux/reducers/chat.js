import { USER_LOGIN, USER_LOGOUT } from "../actionTypes";

export const TOKEN = "token";
export const USER = "user";

const initialState = {
  chats: [],
  groups: [],
  users: []
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case USER_LOGIN:
      console.log(USER_LOGIN, action.payload);
      return { ...state, [USER]: action.payload };
    case USER_LOGOUT:
      return { ...state, [USER]: null, [TOKEN]: null };
    default:
      return state;
  }
}
