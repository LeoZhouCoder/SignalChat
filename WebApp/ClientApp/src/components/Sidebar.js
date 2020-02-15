import React, { Component } from "react";
import { Menu } from "semantic-ui-react";

import { SidebarList } from "./SidebarList";
import { Avatar } from "./Avatar";
import { getUserProfile, getChatList } from "../mockData/chats";

class Sidebar extends Component {
  state = { activeItem: "Chats" };
  handleItemClick = (e, { name }) => this.setState({ activeItem: name });
  render() {
    const { activeItem } = this.state;
    const user = getUserProfile("u0");
    return (
      <div className="flexBox column border sidebar">
        <div className="flexBox maxWidth padding">
          <Avatar src={user.img} size="big" />
          <div className="title text_center space">{user.name}</div>
        </div>
        <Menu pointing secondary widths={2} color="teal">
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
