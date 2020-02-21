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
      const { user, token } = action.payload;
      return { [TOKEN]: token, [USER]: user };
    case USER_LOGOUT:
      return { ...state, [USER]: null, [TOKEN]: null };
    default:
      return state;
  }
}
