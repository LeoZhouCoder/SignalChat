import React, { Component } from "react";
import { Menu, Icon, Input, Dropdown } from "semantic-ui-react";

import { List, ContactContent, ChatContent } from "./List";
import { Avatar } from "./Avatar";

import { SCREEN_BIG } from "../utils/Dimensions";

import { getUserProfile, getChatList } from "../mockData/chats";

const options = [
  { key: 1, text: "Chats", value: "Chats" },
  { key: 2, text: "Contacts", value: "Contacts" }
];

class Sidebar extends Component {
  state = {
    activeMenu: "Chats",
    selectedItem: null
  };

  handleMenuClick = name => this.setState({ activeMenu: name });

  handleItemClick = data => this.setState({ selectedItem: data });

  render() {
    const { activeMenu, selectedItem } = this.state;
    const bigScreen = this.props.screenType === SCREEN_BIG;
    let itemComponent = activeMenu === "Chats" ? ChatContent : ContactContent;
    return (
      <div
        className={`flexBox column border ${
          bigScreen ? "sidebar" : "collapsedSidebar"
        }`}
      >
        <Profile bigScreen={bigScreen} />
        <SidebarMenu
          bigScreen={bigScreen}
          activeMenu={activeMenu}
          handleMenuClick={this.handleMenuClick}
        />
        <List
          list={getChatList()}
          component={itemComponent}
          selectedItem={selectedItem}
          collapsed={!bigScreen}
          onClickItem={this.handleItemClick}
        />
      </div>
    );
  }
}
export default Sidebar;

function SidebarMenu({ bigScreen, activeMenu, handleMenuClick }) {
  if (bigScreen) {
    return (
      <Menu attached pointing secondary widths={2} color="teal">
        {options.map(item => {
          return (
            <Menu.Item
              key={item.value}
              active={activeMenu === item.value}
              onClick={() => handleMenuClick(item.value)}
            >
              {item.value}
            </Menu.Item>
          );
        })}
      </Menu>
    );
  }
  return (
    <Menu compact>
      <Dropdown
        options={options}
        simple
        item
        value={activeMenu}
        onChange={(e, data) => handleMenuClick(data.value)}
      />
    </Menu>
  );
}

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false
    };
  }

  getNameSection = () => {
    if (!this.props.bigScreen) return null;
    const user = getUserProfile("u0");
    if (this.state.editing) {
      return (
        <Input
          className="space title"
          transparent
          value={user.name}
          focus
          placeholder="Enter your name"
        />
      );
    }

    return (
      <div className="title text_center space">
        {user.name}
        <Icon
          name="pencil alternate"
          size="small"
          className="space"
          onClick={() => this.setState({ editing: false })}
        />
      </div>
    );
  };

  render() {
    const user = getUserProfile("u0");
    return (
      <div className="flexBox maxWidth padding profile">
        <Avatar src={user.img} size="big" />
        {this.getNameSection()}
      </div>
    );
  }
}
