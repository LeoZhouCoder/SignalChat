import React from "react";
import { connect } from "react-redux";
import { ListItem } from "./List";
import { getUserProfile } from "../redux/chatActions";
import { getTimeString } from "../utils/Time";

export function ChatContent({ user, data, selected, collapsed, onClickItem }) {
  const { name, chats, users, photo } = data;
  const lastChat = chats[chats.length - 1];

  console.log("[ChatContent] render: ", name, chats, users, photo);

  let displayName, displayImg, displayIcon;
  if (users.length === 1) {
    let profile = getUserProfile(user.id);
    console.log("profile: ", profile);
    displayName = profile ? profile.name : "";
    displayImg = profile ? profile.profilePhoto : "";
    displayIcon = "user";
  } else if (users.length === 2) {
    let profile = getUserProfile(users.find(u => u !== user.id));
    displayName = profile ? profile.name : "";
    displayImg = profile ? profile.profilePhoto : "";
    displayIcon = "user";
  } else {
    displayName = name;
    displayImg = photo;
    displayIcon = "users";
  }
  console.log(
    "displayName: ",
    displayName,
    " displayImg: ",
    displayImg,
    " displayIcon: ",
    displayIcon
  );

  return (
    <ListItem
      img={displayImg}
      icon={displayIcon}
      data={data}
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

const mapStateToProps = state => ({
  user: state.authReducer.user,
  usersProfile: state.chatReducer.users
});
export default connect(mapStateToProps)(ChatContent);
