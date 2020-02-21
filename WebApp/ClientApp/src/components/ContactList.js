import React from "react";
import { connect } from "react-redux";

import { List } from "./List";
import ContactContent from "./ContactContent.js";

function ContactList({ collapsed, onClickItem, users, selectedUser }) {
  return (
    <List
      component={ContactContent}
      list={users}
      selectedData={selectedUser}
      onClickItem={onClickItem}
      collapsed={collapsed}
      placeHolder={"No user online right now."}
    />
  );
}

const mapStateToProps = state => {
  const chatroom = state.chatReducer.chatroom;
  const groups = state.chatReducer.groups;
  const group = groups.find(g => g.id === chatroom);
  const onlineUsers = state.chatReducer.onlineUsers;
  const currentUser = state.authReducer.user.id;
  let selectedUser = null;
  if (group) {
    let { users } = group;
    if (users.length === 2) {
      selectedUser = onlineUsers.find(
        uid => users.includes(uid) && users.includes(currentUser)
      );
    } else if (users.length === 1 && users[0] === currentUser) {
      selectedUser = currentUser;
    }
  }

  return {
    users: onlineUsers,
    selectedUser: selectedUser
  };
};

export default connect(mapStateToProps)(ContactList);
