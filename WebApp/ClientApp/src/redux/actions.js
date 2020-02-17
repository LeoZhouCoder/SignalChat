import { WINDOW_RESIZE, USER_LOGIN, USER_LOGOUT } from "./actionTypes";
import { getScreenType } from "../utils/Dimensions";

const loginUser = loginResult => ({
  type: USER_LOGIN,
  payload: loginResult
});

const windowResize = size => ({
  type: WINDOW_RESIZE,
  payload: size
});

export const login = user => {
  console.log("login start:", user);
  return dispatch => {
    return fetch("http://localhost:60601/auth/signIn", {
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
          // TODO: validation token user
          dispatch(loginUser(data));
          console.log("login success: ", data);
        } else {
          console.log("login error: ", data.message);
        }
      })
      .catch(error => console.log("login fetch error: ", error));
  };
};

export const register = request => {
  console.log("register start:", request);
  return dispatch => {
    return fetch("http://localhost:60601/auth/signUp", {
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
          let { user, token } = data;
          dispatch(loginUser(user));
          localStorage.setItem("token", token.token);
          console.log("register success: ", user);
        } else {
          console.log("register error: ", data.message);
        }
      })
      .catch(error => console.log("register fetch error: ", error));
  };
};

export const getProfile = users => {};

export const getRecentGroupChat = uid => {};

export const getGroupChats = (gid, position, limit) => {};

export const createGroup = (name, users) => {};

export const changeGroupName = (gid, name) => {};

export const addUserToGroup = (gid, user) => {};

export const removeUserFromGroup = (gid, user) => {};

export const deleteGroup = gid => {};

export const sendMessage = (gid, message) => {};

export const changePhoto = () => {};

export const changeName = (firstName, lastName) => {};

export const updateDimensions = () => {
  return windowResize(getDimensions());
};

export const getDimensions = () => {
  let width, height;
  if (typeof window !== "undefined") {
    width = window.innerWidth;
    height = window.innerHeight;
  } else {
    width =
      document.documentElement.clientWidth || document.body.clientWidth || 0;
    height =
      document.documentElement.clientHeight || document.body.clientHeight || 0;
  }
  let size = {
    width: width,
    height: height,
    type: getScreenType(width, height)
  };
  return size;
};
