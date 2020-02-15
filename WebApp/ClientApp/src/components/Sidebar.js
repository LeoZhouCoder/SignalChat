import React, { Component } from "react";

import { Menu } from "semantic-ui-react";

import { SidebarList } from "../components/SidebarList";

import { getChatList } from "../mockData/chats";

class Sidebar extends Component {
  state = { activeItem: "Chats" };
  handleItemClick = (e, { name }) => this.setState({ activeItem: name });
  render() {
    const { activeItem } = this.state;
    return (
      <div className="flexBox column border sidebar">
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
    );
  }
}

export default Sidebar;
