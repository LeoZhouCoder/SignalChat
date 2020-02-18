import {
  HubConnectionBuilder,
  LogLevel,
  HttpTransportType
} from "@aspnet/signalr";

import Storage from "./Storage";
import { store } from "../redux/store";
import { USER_LOGOUT } from "../redux/actionTypes";

const logout = () => ({
  type: USER_LOGOUT
});

let connected = false;
let hubConnection;

const sendMessage = (user, message) => {
  if (!hubConnection) {
    hubConnection = new HubConnectionBuilder()
      .configureLogging(LogLevel.Debug)
      .withUrl("http://localhost:60601/chatHub", {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
        accessTokenFactory: () => {
          console.log(
            "[ChatHub] Storage token: ",
            Storage.retrieveData("token")
          );
          return Storage.retrieveData("token");
        }
      })
      .build();

    // receive from hub
    /*hubConnection.on("ReceiveMessage", (nick, receivedMessage, time) => {
      const text = `${nick}: ${receivedMessage} - ${time}`;
      console.log("[ChatHub] ReceiveMessage: ", text);
    });*/

    // receive message from hub
    hubConnection.on("ReceiveResponse", response => {
      console.log("[ChatHub] ReceiveResponse: ", response);
    });
  }

  if (!connected) {
    hubConnection
      .start()
      .then(() => {
        connected = true;
        console.log("[ChatHub] Connection successful!");
        sendMessage(user, message);
      })
      .catch(err => {
        console.log("[ChatHub] Connection error: " + err);
        store.dispatch(logout());
      });
  } else {
    /*hubConnection.invoke("SendMessage", user, message).catch(err => {
      console.error("[ChatHub] SendMessage error: " + err);
      connected = false;
      store.dispatch(logout());
    });*/
    hubConnection
      .invoke("AddChatRequest", {
        type: 0,
        data: { user: user, message: message }
      })
      .catch(err => {
        console.error("[ChatHub] SendMessage error: " + err);
        connected = false;
        store.dispatch(logout());
      });
  }
};

export { sendMessage };
