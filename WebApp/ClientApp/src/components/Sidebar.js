import React, { Component } from "react";
import { connect } from "react-redux";

import Profile from "./Profile";
import SidebarMenu from "./SidebarMenu";
import { List } from "./List";
import ContactContent from "./ContactContent";
import ChatContent from "./ChatContent";

import { SCREEN_BIG } from "../utils/Dimensions";
import { CHATROOM, ONLINE_USERS, GROUPS } from "../redux/reducers/chat";
import { changeChatroom, createGroup } from "../redux/chatActions";

const MENU_CHATS = "Chats";
const MENU_CONTACTS = "OnlineUsers";
const options = [
  { key: 1, text: MENU_CHATS, value: MENU_CHATS },
  { key: 2, text: MENU_CONTACTS, value: MENU_CONTACTS }
];

class Sidebar extends Component {
  state = { activeMenu: MENU_CHATS };

  handleMenuClick = name => this.setState({ activeMenu: name });

  handleItemClick = data => {
    const { chatroom } = this.props;
    if (this.state.activeMenu === MENU_CHATS) {
      if (chatroom !== data.id) changeChatroom(data.id);
    } else {
      let group = this.findGroup(data);
      if (group) {
        if (chatroom !== group.id) changeChatroom(group.id);
      } else {
        if (this.props.user.id === data) {
          createGroup(null, [data]);
        } else {
          createGroup(null, [this.props.user.id, data]);
        }
      }
    }
  };

  findGroup = uid => {
    const { groups, user } = this.props;
    return groups.find(group => {
      let { users } = group;
      if (users.length > 2) return false;

      if (uid === user.id) {
        if (users.length !== 1) return false;
        return users[0] === uid;
      } else {
        if (users.length !== 2) return false;
        if (!users.includes(uid) || !users.includes(user)) return false;
        return true;
      }
    });
  };

  render() {
    const { activeMenu } = this.state;
    const { user, groups, onlineUsers, chatroom } = this.props;
    const bigScreen = this.props.screenType === SCREEN_BIG;
    let listData,
      itemComponent,
      placeHolder,
      selectedData = null;
    if (activeMenu === MENU_CHATS) {
      placeHolder = "No chat record, go to OnlineUsers find more friends.";
      listData = groups;
      itemComponent = ChatContent;
      selectedData = listData.find(data => data.id === chatroom);
    } else {
      placeHolder = "No user online right now.";
      listData = onlineUsers;
      itemComponent = ContactContent;
      let group = groups.find(data => data.id === chatroom);
      if (group) {
        let { users } = group;
        if (users.length === 2) {
          selectedData = listData.find(
            uid => users.includes(uid) && users.includes(user.id)
          );
        } else if (users.length === 1 && users[0] === user.id) {
          selectedData = listData.find(uid => users[0] === user.id);
        }
      }
    }
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
          options={options}
        />
        <List
          placeHolder={placeHolder}
          list={listData}
          component={itemComponent}
          selectedData={selectedData}
          collapsed={!bigScreen}
          onClickItem={this.handleItemClick}
        />
      </div>
    );
  }
}
const mapStateToProps = state => ({
  user: state.authReducer.user,
  chatroom: state.chatReducer[CHATROOM],
  groups: state.chatReducer[GROUPS],
  onlineUsers: state.chatReducer[ONLINE_USERS]
});
export default connect(mapStateToProps)(Sidebar);