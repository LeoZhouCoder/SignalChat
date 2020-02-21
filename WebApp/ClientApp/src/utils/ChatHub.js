import {
  HubConnectionBuilder,
  LogLevel,
  HttpTransportType
} from "@aspnet/signalr";

let connected = false;
let hubConnection = null;
let closeHubHandler = null;

const closeHub = message => {
  console.error(message);
  connected = false;
  if (closeHubHandler != null) closeHubHandler();
};

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
  console.log("[ChatHub] initHub: " + serverUrl + " token: " + tokenHandler());
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

  hubConnection.onclose(err => closeHub("[ChatHub] Connection closed: " + err));
};

const hubStart = callBack => {
  if (connected) return;
  console.log("[ChatHub] Connection start");
  hubConnection
    .start()
    .then(() => {
      connected = true;
      console.log("[ChatHub] Connection successful");
      if (callBack != null) callBack();
    })
    .catch(err => closeHub("[ChatHub] Connection error: " + err));
};

export const sendRequest = (type, data) => {
  if (!hubConnection) return;
  if (!connected) {
    hubStart(() => sendRequest(type, data));
  } else {
    console.log("[ChatHub] SendRequest " + type + " : ", data);
    hubConnection
      .invoke(type, data)
      .catch(err =>
        closeHub("[ChatHub] SendRequest " + type + " error: " + err)
      );
  }
};
