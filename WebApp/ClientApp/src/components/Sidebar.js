import React, { Component } from "react";
import { connect } from "react-redux";

import Profile from "./Profile";
import SidebarMenu from "./SidebarMenu";
import ChatList from "./ChatList";
import ContactList from "./ContactList";

import { SCREEN_BIG } from "../utils/Dimensions";
import { CHATROOM, GROUPS } from "../redux/reducers/chat";
import { changeChatroom, createGroup } from "../redux/chatActions";
import { MENU } from "../env/Env";

class Sidebar extends Component {
  state = { activeMenu: MENU[0].value };

  handleMenuClick = name => this.setState({ activeMenu: name });

  onClickProfile = e => console.log("[Sidebar]: ClickProfile");

  handleItemClick = data => {
    const { chatroom, currentUser } = this.props;
    if (this.state.activeMenu === MENU[0].value ) {
      if (chatroom !== data.id) changeChatroom(data.id);
    } else {
      const { groups } = this.props;

      let group = groups.find(group => {
        let { users } = group;
        if (users.length > 2) return false;
        if (users.length === 1)
          return users[0] === data && data === currentUser;
        return users.includes(data) && users.includes(currentUser);
      });

      if (group) {
        if (chatroom !== group.id) changeChatroom(group.id);
      } else {
        if (currentUser === data) {
          createGroup(null, [data]);
        } else {
          createGroup(null, [currentUser, data]);
        }
      }
    }
  };

  render() {
    const { activeMenu } = this.state;
    const bigScreen = this.props.screenType === SCREEN_BIG;
    let ListComponent;
    if (activeMenu === MENU[0].value ) {
      ListComponent = ChatList;
    } else {
      ListComponent = ContactList;
    }
    return (
      <div
        className={`flexBox column border ${
          bigScreen ? "sidebar" : "collapsedSidebar"
        }`}
      >
        <Profile bigScreen={bigScreen} onClick={this.onClickProfile} />
        <SidebarMenu
          bigScreen={bigScreen}
          activeMenu={activeMenu}
          handleMenuClick={this.handleMenuClick}
          options={MENU}
        />
        <ListComponent
          collapsed={!bigScreen}
          onClickItem={this.handleItemClick}
        />
      </div>
    );
  }
}
const mapStateToProps = state => ({
  currentUser: state.authReducer.user.id,
  chatroom: state.chatReducer[CHATROOM],
  groups: state.chatReducer[GROUPS]
});
export default connect(mapStateToProps)(Sidebar);
