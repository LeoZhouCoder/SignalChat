import {
  HubConnectionBuilder,
  LogLevel,
  HttpTransportType
} from "@aspnet/signalr";

import { serverUrl } from "../env/Env";
import Storage from "./Storage";
import { store } from "../redux/store";
import { USER_LOGOUT } from "../redux/actionTypes";

const logout = () => ({
  type: USER_LOGOUT
});

let connected = false;
let hubConnection = null;

const showSystemMessage = data => {
  console.log("[ChatHub] show normal message: ", data);
};

const showErrorMessage = data => {
  console.log("[ChatHub] show error message: ", data);
};

const updateRecentChatRecord = data => {
  console.log("[ChatHub] update recent chat record: ", data);
};

const updateOnlineUsers = data => {
  console.log("[ChatHub] update online users: ", data);
};

const updateUserProfile = data => {
  console.log("[ChatHub] update user profile: ", data);
};

const receiveMessage = data => {
  console.log("[ChatHub] receive message: ", data);
};

const responseHandlers = {
  "0": showSystemMessage,
  "1": showErrorMessage,
  "2": updateRecentChatRecord,
  "3": updateOnlineUsers,
  "4": updateUserProfile,
  "5": receiveMessage
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
    var handler = responseHandlers[response.type.toString()];
    if (!handler) {
      console.log("[ChatHub] Unsupported response type: ", response.type);
    } else {
      handler(response.data);
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
  CREATE_GROUP,
  CHANGE_GROUP_NAME,
  ADD_USER_TO_GROUP,
  REMOVE_USER_FROM_GROUP,
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

export const getUserProfile = userIds => {
  var request = {
    type: GET_USER_PROFILE,
    data: userIds
  };
  sendRequest(request);
}
