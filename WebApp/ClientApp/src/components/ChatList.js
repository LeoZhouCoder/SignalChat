import React from "react";
import { connect } from "react-redux";

import BasicList from "./BasicList";
import ChatContent from "./ChatContent.js";

function ChatList({ collapsed, onClickItem, groups, selectGroup }) {
  if (!groups || groups.length === 0) {
    return (
      <div className="box-extendable-center secondary">
        No chat record, go to OnlineUsers find more friends.
      </div>
    );
  }
  return (
    <BasicList>
      {groups.map((group, index) => (
        <ChatContent
          key={index}
          onClickItem={onClickItem}
          data={group}
          selected={selectGroup === group}
          collapsed={collapsed}
        />
      ))}
    </BasicList>
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
