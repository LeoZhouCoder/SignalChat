import React from "react";
import { Avatar } from "./Avatar";
import { sendMessage } from "../utils/Chat";

const Message = ({ chat }) => (
  <div
    className="listItemContainer"
    onClick={() => sendMessage(chat.name, chat.msg)}
  >
    <div className="messageItemHead">
      <Avatar small={true} src={chat.img} />
    </div>

    <div className="listChatContent">
      <div className="title">{chat.name}</div>
      <div className="secondary messageTime">{chat.time}</div>
      <div className="messageContent">{chat.msg}</div>
    </div>
  </div>
);

export default Message;
