import React from "react";
import { Avatar } from "./Avatar";

const Message = ({ chat }) => (
  <div className="listItemContainer">
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
