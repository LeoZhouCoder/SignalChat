import {
  HubConnectionBuilder,
  LogLevel,
  HttpTransportType
} from "@aspnet/signalr";

import { addMessage } from "../redux/chatActions";

let hubConnection = null;
let closeHubHandler = null;

export const hubInit = (
  serverUrl,
  tokenHandler,
  responseHandler,
  onCloseHub
) => {
  if (
    !serverUrl ||
    tokenHandler == null ||
    responseHandler == null ||
    onCloseHub == null ||
    hubConnection
  )
    return;
  console.log("[ChatHub]: initHub:", serverUrl);
  closeHubHandler = onCloseHub;
  hubConnection = new HubConnectionBuilder()
    .configureLogging(LogLevel.Debug)
    .withUrl(serverUrl + "chatHub", {
      skipNegotiation: true,
      transport: HttpTransportType.WebSockets,
      accessTokenFactory: () => tokenHandler()
    })
    .build();

  hubConnection.serverTimeoutInMilliseconds = 100000;

  hubConnection.on("ReceiveResponse", response => responseHandler(response));

  hubConnection.onclose(err => hubStop("[ChatHub]: closed: " + err));
};

export const hubStart = () => {
  if (!hubConnection || hubConnection.state) return;
  console.log("[ChatHub]: start");
  hubConnection
    .start()
    .then(() => {
      console.log("[ChatHub]: start successful:", hubConnection.state);
      addMessage("[ChatHub]: start successful:" + hubConnection.state);
    })
    .catch(err => hubStop("[ChatHub]: start error: " + err));
};

export const hubStop = message => {
  if (message) {
    console.error(message);
    addMessage(message, true);
  }
  if (hubConnection && hubConnection.state) {
    console.log("[ChatHub]: stop:", hubConnection.state);
    hubConnection
      .stop()
      .catch(err => console.error("[ChatHub]: stop error:", err));
  }
  if (closeHubHandler != null && message) closeHubHandler();
};

export const sendRequest = (type, data) => {
  if (!hubConnection || !hubConnection.state) return;
  console.log("[ChatHub]: sendRequest:", type, data);
  hubConnection
    .invoke(type, data)
    .catch(err =>
      hubStop(
        "[ChatHub]: sendRequest error: " +
          err +
          " type: " +
          type +
          " data: " +
          data
      )
    );
};
