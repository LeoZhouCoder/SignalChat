import React, { Component } from "react";
import { connect } from "react-redux";
import { Menu, Dropdown } from "semantic-ui-react";

import { List, ContactContent, ChatContent } from "./List";
import Profile from "./Profile";

import { SCREEN_BIG } from "../utils/Dimensions";
import { CHATS, ONLINE_USERS, CHAT_HISTORY } from "../redux/reducers/chat";

const options = [
  { key: 1, text: "Chats", value: "Chats" },
  { key: 2, text: "OnlineUsers", value: "OnlineUsers" }
];

class Sidebar extends Component {
  state = { activeMenu: "Chats" };

  handleMenuClick = name => this.setState({ activeMenu: name });

  handleItemClick = data => this.setState({ selectedItem: data });

  render() {
    const { activeMenu, selectedItem } = this.state;
    const { chats, onlineUsers } = this.props;
    const bigScreen = this.props.screenType === SCREEN_BIG;
    const listData = activeMenu === "Chats" ? chats : onlineUsers;
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
          list={listData}
          component={itemComponent}
          selectedItem={selectedItem}
          collapsed={!bigScreen}
          onClickItem={this.handleItemClick}
        />
      </div>
    );
  }
}
const mapStateToProps = state => ({
  owner: state.chatReducer[CHAT_HISTORY].owner,
  chats: state.chatReducer[CHATS],
  onlineUsers: state.chatReducer[ONLINE_USERS]
});
export default connect(mapStateToProps)(Sidebar);

function SidebarMenu({ bigScreen, activeMenu, handleMenuClick }) {
  if (bigScreen) {
    return (
      <Menu
        attached
        pointing
        secondary
        widths={2}
        color="teal"
      >
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
