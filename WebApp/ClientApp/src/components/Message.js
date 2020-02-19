import React from "react";
import { Avatar } from "./Avatar";
import { sendMessage } from "../utils/Chat";

const Message = ({ chat , self }) => (
  <div
    className="flexBox maxWidth padding"
    onClick={() => sendMessage(chat.name, chat.msg)}
  >
    <div className="column">
      <Avatar size="large" src={chat.img} />
    </div>

    <div className="space flex row center extendable">
      <div className="secondary single">{chat.name}</div>
      <div className="tertiary space">{chat.time}</div>
      <div className="break"/>
      <div className={`message multiple flexMaxWidth ${self?"self":""}`}>{chat.msg}</div>
    </div>
  </div>
);

export default Message;
