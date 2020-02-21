import React from "react";
import { connect } from "react-redux";
import { ListItem } from "./List";
import { getUserProfile } from "../redux/chatActions";
import { getTimeString } from "../utils/Time";

export function ChatContent({
  chat,
  data,
  name,
  photo,
  icon,
  selected,
  collapsed,
  onClickItem
}) {
  return (
    <ListItem
      img={photo}
      icon={icon}
      data={data}
      selected={selected}
      collapsed={collapsed}
      onClickItem={onClickItem}
    >
      <div className="flexBox row extendable center space">
        <div className="subtitle single extendable unselect">{name}</div>
        <div className="secondary unselect">
          {chat ? getTimeString(chat.createdOn) : " "}
        </div>
        <div className="single maxWidth secondary unselect">
          {chat ? chat.content : " "}
        </div>
      </div>
    </ListItem>
  );
}

const mapStateToProps = (state, props) => {
  let { name, users, photo, chats } = props.data;
  const chat = chats[chats.length - 1];
  let icon;
  if (users.length <= 2) {
    const cuid = state.authReducer.user.id;
    let uid = users.length === 1 ? users[0] : users.find(u => u !== cuid);
    let profile = getUserProfile(uid);
    name = profile ? profile.name : "";
    photo = profile ? profile.profilePhoto : "";
    icon = "user";
  } else {
    icon = "users";
  }
  return { chat, name, photo, icon };
};

export default connect(mapStateToProps)(ChatContent);
