import {
  WINDOW_RESIZE,
  USER_LOGIN,
  CHATROOM_OWNER_CHANGE
} from "./actionTypes";
import { store } from "./store";
import { getScreenType } from "../utils/Dimensions";
import { serverUrl } from "../env/Env";

import { getUsersProfile } from "../utils/Chat";

const loginUser = loginResult => ({
  type: USER_LOGIN,
  payload: loginResult
});

export const login = user => {
  console.log("login start:", user);
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
          console.log("register success: ", data);
          dispatch(loginUser(data));
        } else {
          console.log("register error: ", data.message);
        }
      })
      .catch(error => console.log("register fetch error: ", error));
  };
};

export const getUserProfile = uid => {
  let users = store.getState().chatReducer.users;
  let userProfile;
  users.forEach(user => {
    if (user.id === uid) userProfile = user;
  });
  if (userProfile) return userProfile;
  getUsersProfile([uid]);
  return null;
};

export const getGroup = gid => {
  let groups = store.getState().chatReducer.groups;
  let groupInfo;
  groups.forEach(group => {
    if (group.id === gid) groupInfo = group;
  });
  return groupInfo;
};


export const getGroupChats = (gid, position=0, limit=20) => {};

export const createGroup = (name, users) => {};

export const changeGroupName = (gid, name) => {};

export const addUserToGroup = (gid, user) => {};

export const removeUserFromGroup = (gid, user) => {};

export const deleteGroup = gid => {};

export const sendMessage = (gid, message) => {};

export const changePhoto = () => {};

export const changeName = (firstName, lastName) => {};

export const updateDimensions = () => {
  return {
    type: WINDOW_RESIZE,
    payload: getDimensions()
  };
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

export const changeChatroom = (type, id) => {
  store.dispatch({ type: CHATROOM_OWNER_CHANGE, payload: { type, id } });
};
