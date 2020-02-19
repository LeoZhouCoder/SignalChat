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

const responseType = {
  "0": SYSTEM_MESSAGE,
  "1": SYSTEM_MESSAGE_ERROR,
  "2": CHAT_RECORD_UPDATE,
  "3": ONLINE_USER_UPDATE,
  "4": GROUP_UPDATE,
  "5": GROUP_DELETE,
  "6": FRIEND_ADD,
  "7": FRIEND_DELETE,
  "8": USER_PROFILE_UPDATE,
  "9": CHAT_ADD,
  "10": CHAT_GROUP_UPDATE,
  "11": CHAT_USER_UPDATE
};

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
    var type = responseType[response.type.toString()];
    if (type) {
      console.log("[ChatHub] dispatch action: ", type, response.data);
      store.dispatch({ type: type, payload: response.data });
    } else {
      console.log("[ChatHub] Unsupported response type: ", response.type);
    }
  });

  hubConnection.onclose(error => {
    connected = false;
    console.log("[ChatHub] Connection closed: " + error);
  });
};

const sendRequest = request => {
  initHub();
  if (!connected) {
    hubConnection
      .start()
      .then(() => {
        connected = true;
        console.log("[ChatHub] Connection successful!");
        sendRequest(request);
      })
      .catch(err => {
        console.log("[ChatHub] Connection error: " + err);
        store.dispatch(logout());
      });
  } else {
    hubConnection.invoke("AddChatRequest", request).catch(err => {
      console.error("[ChatHub] send request error: " + err);
      connected = false;
      store.dispatch(logout());
    });
  }
};

const {
  SEND_MESSAGE,
  GET_GROUP_CHATS,
  GET_USER_CHATS,
  CREATE_GROUP,
  CHANGE_GROUP_NAME,
  ADD_USER_TO_GROUP,
  REMOVE_USER_FROM_GROUP,
  DELETE_GROUP,
  ADD_FRIEND,
  DELETE_FRIEND,
  GET_USER_PROFILE
} = [0, 1, 2, 3, 4];

export const { SYSTEM, MESSAGE, IMAGE } = [0, 1, 2];

export const sendMessage = (
  chatType,
  content,
  groupId = null,
  receiver = null
) => {
  var request = {
    type: SEND_MESSAGE,
    data: {
      chatType: chatType,
      content: content,
      group: groupId,
      receiver: receiver
    }
  };
  sendRequest(request);
};

export const getGroupChats = (gid, position, limit) => {
  var request = {
    type: GET_GROUP_CHATS,
    data: {
      group: gid,
      position: position,
      limit: limit
    }
  };
  sendRequest(request);
};

export const getUserChats = (uid, position, limit) => {
  var request = {
    type: GET_USER_CHATS,
    data: {
      user: uid,
      position: position,
      limit: limit
    }
  };
  sendRequest(request);
};

export const createGroup = (name, users) => {
  var request = {
    type: CREATE_GROUP,
    data: {
      name: name,
      users: users
    }
  };
  sendRequest(request);
};

export const changeGroupName = (group, name) => {
  var request = {
    type: CHANGE_GROUP_NAME,
    data: {
      group: group,
      name: name
    }
  };
  sendRequest(request);
};

export const addUserToGroup = (group, user) => {
  var request = {
    type: ADD_USER_TO_GROUP,
    data: {
      group: group,
      user: user
    }
  };
  sendRequest(request);
};

export const removeUserFromGroup = (group, user) => {
  var request = {
    type: REMOVE_USER_FROM_GROUP,
    data: {
      group: group,
      user: user
    }
  };
  sendRequest(request);
};

export const deleteGroupRequest = group => {
  var request = {
    type: DELETE_GROUP,
    data: group
  };
  sendRequest(request);
};

export const addFriendRequest = user => {
  var request = {
    type: ADD_FRIEND,
    data: user
  };
  sendRequest(request);
};

export const deleteFriendRequest = user => {
  var request = {
    type: DELETE_FRIEND,
    data: user
  };
  sendRequest(request);
};

export const getUserProfile = userIds => {
  var request = {
    type: GET_USER_PROFILE,
    data: userIds
  };
  sendRequest(request);
};
