import React, { Component } from "react";
import { Icon, Menu, Input, Sidebar } from "semantic-ui-react";

import { SidebarList } from "../components/SidebarList";
import ChatHistory from "../components/ChatHistory";
import { Avatar } from "../components/Avatar";

import { getChatList } from "../mockData/chats";

export default class ChatRoom extends Component {
  state = { activeItem: "Chats" };
  handleItemClick = (e, { name }) => this.setState({ activeItem: name });
  render() {
    const { activeItem } = this.state;
    return (
      <Sidebar.Pushable className="chatroom">
        <Sidebar
          animation="push"
          direction="left"
          icon="labeled"
          vertical="true"
          visible={true}
          width="wide"
          style={{overflow: "hidden"}}
        >
          <Menu
            attached="top"
            pointing
            secondary
            widths={2}
            icon="labeled"
            color="teal"
          >
            <Menu.Item
              name="Chats"
              active={activeItem === "Chats"}
              onClick={this.handleItemClick}
            >
              <Icon name="chat" />
              Chats
            </Menu.Item>
            <Menu.Item
              name="Contacts"
              active={activeItem === "Contacts"}
              onClick={this.handleItemClick}
            >
              <Icon name="address book outline" />
              Contacts
            </Menu.Item>
          </Menu>
          <Input className="icon" icon="search" placeholder="Search..." />
          <SidebarList chatList={getChatList()} />
        </Sidebar>
        <Sidebar.Pusher>
          <ChatHistory/>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    );
  }
}
