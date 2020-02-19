import React, { Component } from "react";
import { connect } from "react-redux";
import { Menu, Dropdown } from "semantic-ui-react";

import { List } from "./List";
import ContactContent from "./ContactContent";
import ChatContent from "./ChatContent";

import Profile from "./Profile";

import { SCREEN_BIG } from "../utils/Dimensions";
import { CHATS, ONLINE_USERS, CHAT_HISTORY } from "../redux/reducers/chat";
import { changeChatroom } from "../redux/actions";

const options = [
  { key: 1, text: "Chats", value: "Chats" },
  { key: 2, text: "ActiveUsers", value: "ActiveUsers" }
];

class Sidebar extends Component {
  state = { activeMenu: "Chats" };

  handleMenuClick = name => this.setState({ activeMenu: name });

  handleItemClick = data => {
    console.log("Sidebar Click Item: ", data);
    const { activeMenu } = this.state;
    if (activeMenu === "Chats") {
      if (data.gid !== null) {
        changeChatroom(0, data.gid);
      } else {
        changeChatroom(
          1,
          this.props.user.id === data.sender ? data.receiver : data.sender
        );
      }
    } else {
      changeChatroom(1, data);
    }
  };

  render() {
    console.log("Sidebar render:", this.props);
    const { activeMenu } = this.state;
    const { owner, chats, onlineUsers, user } = this.props;
    const bigScreen = this.props.screenType === SCREEN_BIG;
    let listData,
      itemComponent,
      placeHolder,
      selectedData = null;
    if (activeMenu === "Chats") {
      placeHolder = "No chat record, go to ActiveUsers find more friends.";
      listData = chats;

      itemComponent = ChatContent;
      listData.forEach(data => {
        if (owner.type === 0 && owner.id === data.gid) selectedData = data;
        if(owner.type === 1)
        {
          if(owner.id===user.id)
          {
            if(owner.id === data.sender && owner.id === data.receiver)selectedData = data;
          }else{
            if(owner.id === data.sender || owner.id === data.receiver) selectedData = data;
          }
        }
      });
    } else {
      placeHolder = "No user online right now.";
      listData = onlineUsers;
      itemComponent = ContactContent;
      if (owner.type === 1) {
        listData.forEach(uid => {
          if (owner.id === uid) selectedData = uid;
        });
      }
    }
    console.log("selectedData", selectedData);
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
  owner: state.chatReducer[CHAT_HISTORY].owner,
  chats: state.chatReducer[CHATS],
  onlineUsers: state.chatReducer[ONLINE_USERS]
});
export default connect(mapStateToProps)(Sidebar);

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
