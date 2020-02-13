import React from "react";
import { Avatar } from "./Avatar";
import { sendMessage } from "../utils/Chat";

const Message = ({ chat }) => (
  <div
    className="container"
    onClick={() => sendMessage(chat.name, chat.msg)}
  >
    <div className="column">
      <Avatar size="small" src={chat.img} />
    </div>

    <div className="listChatContent">
      <div className="title single">{chat.name}</div>
      <div className="secondary space">{chat.time}</div>
      <div className="text_max multiple">{chat.msg}</div>
    </div>
  </div>
);

export default Message;
