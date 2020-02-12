import React, { Component } from "react";
import { Icon, Menu, Segment, Sidebar } from "semantic-ui-react";

import { SidebarList } from "../components/SidebarList";
import ChatHistory from "../components/ChatHistory";

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
          style={{overflow:"hidden"}}
          className="sidebarListContainer"
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
          <SidebarList list={getChatList()} isChat={true} />
        </Sidebar>
        <Sidebar.Pusher>
          <ChatHistory />
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    );
  }
}
