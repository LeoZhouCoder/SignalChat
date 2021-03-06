import { WINDOW_RESIZE, USER_LOGIN, USER_FETCHING } from "./actionTypes";

import { serverUrl } from "../env/Env";
import { getScreenType } from "../utils/Dimensions";
import { addMessage } from "../redux/chatActions";

const loginUser = loginResult => ({
  type: USER_LOGIN,
  payload: loginResult
});

export const login = user => {
  console.log("[login]: start", user);
  return dispatch => {
    dispatch({ type: USER_FETCHING, payload: true });
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
        dispatch({ type: USER_FETCHING, payload: false });
        if (data.success) {
          dispatch(loginUser(data));
          console.log("[login]: success", data);
        } else {
          addMessage("[login]: error " + data.message, true);
          console.log("[login]: error", data.message);
        }
      })
      .catch(error => {
        dispatch({ type: USER_FETCHING, payload: false });
        addMessage("[login]: fetch error " + error, true);
        console.log("[login]: fetch error", error);
      });
  };
};

export const register = request => {
  console.log("[register]: start", request);
  return dispatch => {
    dispatch({ type: USER_FETCHING, payload: true });
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
          addMessage("[register]: error " + data.message, true);
          console.log("[register]: error", data.message);
        }
        dispatch({ type: USER_FETCHING, payload: false });
      })
      .catch(error => {
        dispatch({ type: USER_FETCHING, payload: false });
        addMessage("[register]: fetch error " + error, true);
        console.log("[register]: fetch error", error);
      });
  };
};

export const updateScreenType = () => {
  return {
    type: WINDOW_RESIZE,
    payload: getScreenType()
  };
};
