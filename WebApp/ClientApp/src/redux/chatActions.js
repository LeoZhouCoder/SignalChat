import { store } from "./store";
import { sendRequest } from "../utils/ChatHub";

import {
  USER_LOGOUT,
  SYSTEM_MESSAGE,
  SYSTEM_MESSAGE_ERROR
} from "./actionTypes";

import {
  UPDATE_CHATROOM,
  UPDATE_ONLINE_USER,
  UPDATE_GROUP,
  UPDATE_GROUP_VIEW,
  DELETE_GROUP,
  UPDATE_USERS,
  ADD_CHAT,
  ADD_CHATS,
  SWITCH_CHATROOM,
  ADD_MESSAGE,
  DELETE_MESSAGE
} from "./reducers/chat";

const responseTypes = [
  SYSTEM_MESSAGE,
  SYSTEM_MESSAGE_ERROR,
  UPDATE_CHATROOM,
  UPDATE_ONLINE_USER,
  UPDATE_GROUP,
  UPDATE_GROUP_VIEW,
  DELETE_GROUP,
  UPDATE_USERS,
  ADD_CHAT,
  ADD_CHATS
];
export const tokenHandler = () => {
  return store.getState().authReducer.token;
};

export const chatResponseHandler = response => {
  var type = responseTypes[response.type];
  if (type) {
    console.log("[ChatHub] receiveResponse: ", type, response.data);
    store.dispatch({ type: type, payload: response.data });
  } else {
    console.error("[ChatHub] unsupported response: ", response);
  }
};

export const onCloseHub = () => {
  store.dispatch({ type: USER_LOGOUT });
};

// actions
export const { SYSTEM, MESSAGE, IMAGE } = [0, 1, 2];

export const sendMessage = (chatType, content, group, receiver = null) =>
  sendRequest("SendMessage", { chatType, content, group, receiver });

export const getChats = (group, position = 0, limit = 20) =>
  sendRequest("GetChats", { group, position, limit });

export const createGroup = (name, users) => {
  console.log("[ChatAction]: createGroup", name, users);
  sendRequest("CreateGroup", { name, users });
};

export const updateGroup = (group, name, users) => {
  console.log("[ChatAction]: updateGroup", group, name, users);
  sendRequest("UpdateGroup", { group, name, users });
};

export const deleteGroup = group => sendRequest("DeleteGroup", group);

export const getUsersProfile = userIds =>
  sendRequest("GetUserProfile", userIds);

export const changeChatroom = groupId => {
  store.dispatch({ type: SWITCH_CHATROOM, payload: groupId });
};

export const getUserProfile = uid => {
  if (!uid) return null;
  let users = store.getState().chatReducer.users;
  let userProfile = users.find(user => user.id === uid);
  if (userProfile) return userProfile;
  getUsersProfile([uid]);
  return null;
};

export const addMessage = (message, isError = false) => {
  store.dispatch({ type: ADD_MESSAGE, payload: { message, isError } });
};

export const deleteMessage = () => {
  store.dispatch({ type: DELETE_MESSAGE });
};
