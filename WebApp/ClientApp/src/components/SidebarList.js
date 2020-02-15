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
    <div className="flexBox maxWidth padding divider">
      <div className="column center-v">
        <Avatar src={img} />
      </div>
      {isChat ? <ChatContent data={data} /> : <ContactContent data={data} />}
    </div>
  );
}

function ContactContent({ data }) {
  const { name } = data;
  return (
    <div className="flexBox row extendable center space">
      <div className="subtitle single text_center unselect">{name}</div>
    </div>
  );
}

function ChatContent({ data }) {
  const { name, time, msg } = data;
  return (
    <div className="flexBox row extendable center space">
      <div className="subtitle single extendable unselect">{name}</div>
      <div className="secondary unselect">{time}</div>
      <div className="single maxWidth secondary unselect">{msg}</div>
    </div>
  );
}
