import React from "react";
import { connect } from "react-redux";
import { ListItem } from "./List";
import { getUserProfile, getGroup } from "../redux/actions";
import {getTimeString} from "../utils/Time";

export function ChatContent({ user, data, selected, collapsed, onClickItem }) {
  const { sender, gid, receiver, content, createdOn } = data;
  let name, img, icon;
  if (gid) {
    let group = getGroup(gid);
    name = group.name;
    img = group.photo;
    icon = "users";
  } else {
    let uid = user.id === sender ? receiver : sender;
    let userProfile = getUserProfile(uid);
    name = userProfile ? userProfile.name : "";
    img = userProfile ? userProfile.profilePhoto : "";
    icon = "user";
  }
  return (
    <ListItem
      img={img}
      icon={icon}
      data={data}
      selected={selected}
      collapsed={collapsed}
      onClickItem={onClickItem}
    >
      <div className="flexBox row extendable center space">
        <div className="subtitle single extendable unselect">{name}</div>
        <div className="secondary unselect">{getTimeString(createdOn)}</div>
        <div className="single maxWidth secondary unselect">{content}</div>
      </div>
    </ListItem>
  );
}

const mapStateToProps = state => ({
  user: state.authReducer.user,
  userProfile: state.chatReducer.users
});
export default connect(mapStateToProps)(ChatContent);
