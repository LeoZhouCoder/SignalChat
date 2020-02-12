import React, { Component } from "react";
import { Avatar } from "./Avatar";

export class SidebarList extends Component {
  render() {
    const { chatList } = this.props;
    return (
      <div className="sidebarList">
        {chatList.map((data, i) => {
          return <SidebarListItem key={i} data={data} />;
        })}
      </div>
    );
  }
}

function SidebarListItem({ data }) {
  const { img, name, time, msg } = data;
  return (
    <div className="listItemContainer">
      <div className="listItemHead">
        <Avatar src={img} />
      </div>
      <ChatContent name={name} time={time} record={msg} />
    </div>
  );
}

function ContactContent({ name }) {
  return (
    <div className="listChatContent">
      <div className="title contactTitle">{name}</div>
    </div>
  );
}

function ChatContent({ name, time, record }) {
  return (
    <div className="listChatContent">
      <div>
        <div className="title">{name}</div>
        <div className="secondary chatTime">{time}</div>
      </div>

      <div className="secondary chatRecord">{record}</div>
    </div>
  );
}
