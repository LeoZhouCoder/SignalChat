import { USER_LOGIN, USER_LOGOUT } from "../actionTypes";
import Storage from "../../utils/Storage";

export const TOKEN = "token";
export const USER = "user";

const initialState = {
  [USER]: Storage.retrieveData(USER),
  [TOKEN]: Storage.retrieveData(TOKEN)
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case USER_LOGIN:
      console.log("[AuthReducer]:", action);
      const { user, token } = action.payload;
      return { [TOKEN]: token, [USER]: user };
    case USER_LOGOUT:
      console.log("[AuthReducer]:", action);
      return { ...state, [USER]: null, [TOKEN]: null };
    default:
      return state;
  }
}
