import React from "react";
import { connect } from "react-redux";
import { ListItem } from "./List";
import { getUserProfile } from "../redux/chatActions";
import { getTimeString } from "../utils/Time";

export function ChatContent({
  currentUser,
  group,
  chats,
  selected,
  collapsed,
  onClickItem
}) {
  const { name, users, photo } = group;
  const lastChat = chats[chats.length - 1];
  let displayName, displayImg, displayIcon;

  if (users.length <= 2) {
    let uid =
      users.length === 1 ? users[0] : users.find(u => u !== currentUser.id);
    let profile = getUserProfile(uid);
    displayName = profile ? profile.name : "";
    displayImg = profile ? profile.profilePhoto : "";
    displayIcon = "user";
  } else {
    displayName = name;
    displayImg = photo;
    displayIcon = "users";
  }

  return (
    <ListItem
      img={displayImg}
      icon={displayIcon}
      data={group}
      selected={selected}
      collapsed={collapsed}
      onClickItem={onClickItem}
    >
      <div className="flexBox row extendable center space">
        <div className="subtitle single extendable unselect">{displayName}</div>
        <div className="secondary unselect">
          {lastChat ? getTimeString(lastChat.createdOn) : " "}
        </div>
        <div className="single maxWidth secondary unselect">
          {lastChat ? lastChat.content : " "}
        </div>
      </div>
    </ListItem>
  );
}

const mapStateToProps = (state, props) => {
  const group = props.data;
  const groups = state.chatReducer.groups;
  const groupIndex = groups.indexOf(group);
  return {
    currentUser: state.authReducer.user,
    group: state.chatReducer.groups[groupIndex],
    chats: state.chatReducer.groups[groupIndex].chats,
    usersProfile: state.chatReducer.users
  };
};

export default connect(mapStateToProps)(ChatContent);
