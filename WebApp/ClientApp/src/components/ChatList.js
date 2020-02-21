import React from "react";
import { connect } from "react-redux";

import { List } from "./List";
import ChatContent from "./ChatContent.js";

function ChatList({ collapsed, onClickItem, groups, selectGroup }) {
  return (
    <List
      component={ChatContent}
      list={groups}
      selectedData={selectGroup}
      onClickItem={onClickItem}
      collapsed={collapsed}
      placeHolder={"No chat record, go to OnlineUsers find more friends."}
    />
  );
}

const mapStateToProps = state => {
  const chatroom = state.chatReducer.chatroom;
  const groups = state.chatReducer.groups;
  const selectGroup = groups.find(g => g.id === chatroom);
  return {
    groups: groups,
    selectGroup: selectGroup
  };
};

export default connect(mapStateToProps)(ChatList);
