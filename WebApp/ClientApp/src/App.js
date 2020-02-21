import React from "react";
import { Provider } from "react-redux";

import { store } from "./redux/store";
import Routes from "./Routes";

import "./custom.css";

import { serverUrl } from "./env/Env";
import { hubInit } from "./utils/ChatHub";
import {
  tokenHandler,
  chatResponseHandler,
  onCloseHub
} from "./redux/chatActions";

hubInit(serverUrl, tokenHandler, chatResponseHandler, onCloseHub);

export default function App() {
  return (
    <Provider store={store}>
      <Routes />
    </Provider>
  );
}
