import { WINDOW_RESIZE, USER_LOGIN } from "./actionTypes";
import { serverUrl } from "../env/Env";
import { getScreenType } from "../utils/Dimensions";

const loginUser = loginResult => ({
  type: USER_LOGIN,
  payload: loginResult
});

export const login = user => {
  console.log("[login]: start", user);
  return dispatch => {
    return fetch(serverUrl + "auth/signIn", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(user)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          dispatch(loginUser(data));
          console.log("[login]: success", data);
        } else {
          console.log("[login]: error", data.message);
        }
      })
      .catch(error => console.log("[login]: fetch error", error));
  };
};

export const register = request => {
  console.log("[register]: start", request);
  return dispatch => {
    return fetch(serverUrl + "auth/signUp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(request)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          console.log("[register]: success", data);
          dispatch(loginUser(data));
        } else {
          console.log("[register]: error", data.message);
        }
      })
      .catch(error => console.log("[register]: fetch error", error));
  };
};

export const updateScreenType = () => {
  return {
    type: WINDOW_RESIZE,
    payload: getScreenType()
  };
};
