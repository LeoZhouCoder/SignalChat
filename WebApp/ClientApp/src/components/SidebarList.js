import React, { Component } from "react";
import { Avatar } from "./Avatar";

export class SidebarList extends Component {
  render() {
    const { list, isChat } = this.props;
    return (
      <div className="list column">
        {list.map((data, i) => {
          return <SidebarListItem key={i} data={data} isChat={isChat} />;
        })}
      </div>
    );
  }
}

function SidebarListItem({ data, isChat }) {
  const { img } = data;
  return (
    <div className="container divider">
      <div className="column center">
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
      <div className="title single text_center unselect">{name}</div>
    </div>
  );
}

function ChatContent({ data }) {
  const { name, time, msg } = data;
  return (
    <div className="listChatContent">
      <div className="title single text_flex unselect">{name}</div>
      <div className="tertiary unselect">{time}</div>
      <div className="single text_max secondary unselect">{msg}</div>
    </div>
  );
}
