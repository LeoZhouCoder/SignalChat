import React, { Component } from "react";
import { Menu } from "semantic-ui-react";

import { SidebarList } from "../components/SidebarList";
import ChatHistory from "../components/ChatHistory";

import { getChatList, getRecentGroupChat } from "../mockData/chats";

export default class ChatRoom extends Component {
  state = { activeItem: "Chats" };
  handleItemClick = (e, { name }) => this.setState({ activeItem: name });
  render() {
    const { activeItem } = this.state;
    let chats = getRecentGroupChat("u0");
    console.log("ChatRoom: ", chats);
    return (
      <div className="chatroomContainer">
        <div className="sidebar column">
          <Menu attached="top" pointing secondary widths={2} color="teal">
            <Menu.Item
              name="Chats"
              active={activeItem === "Chats"}
              onClick={this.handleItemClick}
            >
              Chats
            </Menu.Item>
            <Menu.Item
              name="Contacts"
              active={activeItem === "Contacts"}
              onClick={this.handleItemClick}
            >
              Contacts
            </Menu.Item>
          </Menu>
          <SidebarList list={getChatList()} isChat={true} />
        </div>
        <div className="chatroom">
          <ChatHistory />
        </div>
      </div>
    );
  }
}
