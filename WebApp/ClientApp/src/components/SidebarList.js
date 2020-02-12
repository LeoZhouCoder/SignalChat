import React, { Component } from "react";
import { Avatar } from "./Avatar";

export class SidebarList extends Component {
  render() {
    const { list, isChat } = this.props;
    return (
      <div className="sidebarListContainer">
        <div className="sidebarList">
          {list.map((data, i) => {
            return <SidebarListItem key={i} data={data} isChat={isChat} />;
          })}
        </div>
      </div>
    );
  }
}

function SidebarListItem({ data, isChat }) {
  const { img } = data;
  return (
    <div className="listItemContainer">
      <div className="listItemHead">
        <Avatar src={img} />
      </div>

      {isChat ? <ChatContent data={data} /> : <ContactContent data={data} />}
    </div>
  );
}

function ContactContent({ data }) {
  const { name } = data;
  return (
    <div className="listChatContent">
      <div className="title contactTitle">{name}</div>
    </div>
  );
}

function ChatContent({ data }) {
  const { name, time, msg } = data;
  return (
    <div className="listChatContent">
      <div className="title chatTitle">{name}</div>
      <div className="secondary">{time}</div>
      <div className="secondary chatRecord">{msg}</div>
    </div>
  );
}
