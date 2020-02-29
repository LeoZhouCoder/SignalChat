import React from "react";
import { connect } from "react-redux";

import BasicList from "./BasicList";
import ContactContent from "./ContactContent.js";

function ContactList({ collapsed, onClickItem, users, selectedUser }) {
  if (!users || users.length === 0) {
    return (
      <div className="list column center maxParent center-v">
        <div className="flexBox column maxParent center-v secondary padding">
          No user online right now.
        </div>
      </div>
    );
  }
  return (
    <BasicList>
      {users.map((user, index) => (
        <ContactContent
          key={index}
          onClickItem={onClickItem}
          data={user}
          selected={selectedUser === user}
          collapsed={collapsed}
        />
      ))}
    </BasicList>
  );
}

const mapStateToProps = state => {
  const chatroom = state.chatReducer.chatroom;
  const groups = state.chatReducer.groups;
  const group = groups.find(g => g.id === chatroom);
  const allUsers = state.chatReducer.allUsers;
  const currentUser = state.authReducer.user.id;
  let selectedUser = null;
  if (group) {
    let { users } = group;
    if (users.length === 2) {
      selectedUser = users.find(uid => uid !== currentUser);
    } else if (users.length === 1 && users[0] === currentUser) {
      selectedUser = currentUser;
    }
  }

  return {
    users: allUsers,
    selectedUser: selectedUser
  };
};

export default connect(mapStateToProps)(ContactList);
