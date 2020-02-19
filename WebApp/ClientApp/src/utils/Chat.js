import {
  HubConnectionBuilder,
  LogLevel,
  HttpTransportType
} from "@aspnet/signalr";

import { serverUrl } from "../env/Env";
import Storage from "./Storage";
import { store } from "../redux/store";
import {
  USER_LOGOUT,
  SYSTEM_MESSAGE,
  SYSTEM_MESSAGE_ERROR,
  CHAT_RECORD_UPDATE,
  ONLINE_USER_UPDATE,
  GROUP_UPDATE,
  GROUP_DELETE,
  FRIEND_ADD,
  FRIEND_DELETE,
  USER_PROFILE_UPDATE,
  CHAT_ADD,
  CHAT_GROUP_UPDATE,
  CHAT_USER_UPDATE
} from "../redux/actionTypes";

const logout = () => ({
  type: USER_LOGOUT
});

let connected = false;
let hubConnection = null;

const responseTypes = [
  SYSTEM_MESSAGE,
  SYSTEM_MESSAGE_ERROR,
  CHAT_RECORD_UPDATE,
  ONLINE_USER_UPDATE,
  GROUP_UPDATE,
  GROUP_DELETE,
  FRIEND_ADD,
  FRIEND_DELETE,
  USER_PROFILE_UPDATE,
  CHAT_ADD,
  CHAT_GROUP_UPDATE,
  CHAT_USER_UPDATE
];

const initHub = () => {
  if (hubConnection) return;
  hubConnection = new HubConnectionBuilder()
    .configureLogging(LogLevel.Debug)
    .withUrl(serverUrl + "chatHub", {
      skipNegotiation: true,
      transport: HttpTransportType.WebSockets,
      accessTokenFactory: () => Storage.retrieveData("token")
    })
    .build();

  hubConnection.on("ReceiveResponse", response => {
    console.log("[ChatHub] ReceiveResponse: ", response);
    var type = responseTypes[response.type];
    if (type) {
      console.log("[ChatHub] dispatch action: ", type, response.data);
      store.dispatch({ type: type, payload: response.data });
    } else {
      console.log("[ChatHub] Unsupported response type: ", response.type);
    }
  });

  hubConnection.onclose(error => {
    connected = false;
    console.error("[ChatHub] Connection closed: " + error);
    store.dispatch(logout());
  });
};

const sendRequest = (type, data) => {
  initHub();
  if (!connected) {
    hubConnection
      .start()
      .then(() => {
        connected = true;
        console.log("[ChatHub] Connection successful!");
        sendRequest(type, data);
      })
      .catch(err => {
        console.log("[ChatHub] Connection error: " + err);
        store.dispatch(logout());
      });
  } else {
    console.log("[ChatHub] SendRequest " + type + " : ", data);
    hubConnection.invoke(type, data).catch(err => {
      console.error("[ChatHub] SendRequest " + type + " error: " + err);
      connected = false;
      store.dispatch(logout());
    });
  }
};

export const { SYSTEM, MESSAGE, IMAGE } = [0, 1, 2];

export const sendMessage = (chatType, content, group = null, receiver = null) =>
  sendRequest("SendMessage", { chatType, content, group, receiver });

export const getGroupChats = (group, position, limit) =>
  sendRequest("GetGroupChats", { group, position, limit });

export const getUserChats = (user, position, limit) =>
  sendRequest("GetUserChats", { user, position, limit });

export const createGroup = (name, users) =>
  sendRequest("CreateGroup", { name, users });

export const changeGroupName = (group, name) =>
  sendRequest("ChangeGroupName", { group, name });

export const addUserToGroup = (group, user) =>
  sendRequest("AddUserToGroup", { group, user });

export const removeUserFromGroup = (group, user) =>
  sendRequest("RemoveUserFromGroup", { group, user });

export const deleteGroupRequest = group => sendRequest("DeleteGroup", group);

export const addFriendRequest = user => sendRequest("AddFriend", user);

export const deleteFriendRequest = user => sendRequest("DeleteFriend", user);

export const getUsersProfile = userIds =>
  sendRequest("GetUserProfile", userIds);
