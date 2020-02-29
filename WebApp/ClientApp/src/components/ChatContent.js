import React from "react";
import { connect } from "react-redux";
import { AvatarMultiple } from "./Avatar";
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
  let content = null;
  if (!collapsed)
    content = (
      <div className="flexBox row extendable center space">
        <div className="subtitle single extendable unselect">{name}</div>
        <div className="secondary unselect">
          {chat ? getTimeString(chat.createdOn) : "-"}
        </div>
        <div className="single maxWidth secondary unselect">
          {chat ? chat.content : "No records."}
        </div>
      </div>
    );
  return (
    <div
      className={`flexBox maxWidth padding pointer center-v divider ${
        selected ? "selected" : ""
      }`}
      onClick={() => onClickItem(data)}
    >
      <div className="flexBox column center-v">
        <AvatarMultiple photos={photos} />
      </div>
      {content}
    </div>
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
