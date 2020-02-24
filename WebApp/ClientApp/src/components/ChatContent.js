import React from "react";
import { connect } from "react-redux";
import { ListItem } from "./List";
import { getUserProfile } from "../redux/chatActions";
import { getTimeString } from "../utils/Time";

export function ChatContent({
  chat,
  name,
  photos,
  data,
  selected,
  collapsed,
  onClickItem
}) {
  return (
    <ListItem
      photos={photos}
      data={data}
      selected={selected}
      collapsed={collapsed}
      onClickItem={onClickItem}
    >
      <div className="flexBox row extendable center space">
        <div className="subtitle single extendable unselect">{name}</div>
        <div className="secondary unselect">
          {chat ? getTimeString(chat.createdOn) : "-"}
        </div>
        <div className="single maxWidth secondary unselect">
          {chat ? chat.content : "No records."}
        </div>
      </div>
    </ListItem>
  );
}

const mapStateToProps = (state, props) => {
  let { name, users, chats } = props.data;

  const chat = chats[chats.length - 1];
  let photos;
  if (users.length <= 2) {
    const cuid = state.authReducer.user.id;
    let uid = users.length === 1 ? users[0] : users.find(u => u !== cuid);
    let profile = getUserProfile(uid);
    name = profile ? profile.name : "";
    photos = [profile ? profile.profilePhoto : ""];
  } else {
    photos = users.map(uid => {
      const profile = getUserProfile(uid);
      return profile ? profile.profilePhoto : "";
    });
  }
  return { chat, name, photos };
};

export default connect(mapStateToProps)(ChatContent);
