import { HubConnectionBuilder, LogLevel, HttpTransportType } from "@aspnet/signalr";

let hubConnection;
let started = false;

const sendMessage = (user, message) => {
  console.log("sendMessage: ", user, message);
  if (!hubConnection) {
    hubConnection = new HubConnectionBuilder().configureLogging(LogLevel.Debug)
      .withUrl("http://localhost:60601/chatHub", {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets
      })
      .build();
    hubConnection.on("ReceiveMessage", (nick, receivedMessage,time) => {
      const text = `${nick}: ${receivedMessage} - ${time}`;
      console.log("ReceiveMessage: ", text);
    });
  }
  if (started) {
    hubConnection.invoke("SendMessage", user, message).catch(err => {
      started = false;
      console.error(err);
    });
  } else {
    hubConnection
      .start()
      .then(() => {
        started = true;
        console.log("Connection started!");
        sendMessage(user, message);
      })
      .catch(err => console.log("Error while establishing connection :("));
  }
};

export { sendMessage };
