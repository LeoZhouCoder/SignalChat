import React from "react";
import { connect } from "react-redux";
import { ListItem } from "./List";
import { getUserProfile } from "../redux/chatActions";

export function ContactContent({
  data,
  selected,
  collapsed,
  onClickItem,
  name,
  photo
}) {
  return (
    <ListItem
      data={data}
      img={photo}
      icon="user"
      selected={selected}
      collapsed={collapsed}
      onClickItem={onClickItem}
    >
      <div className="flexBox row extendable center space">
        <div className="subtitle single text_center unselect">{name}</div>
      </div>
    </ListItem>
  );
}

const mapStateToProps = (state, props) => {
  const { data } = props;
  const user = getUserProfile(data);
  return {
    name: user ? user.name : "",
    photo: user ? user.profilePhoto : ""
  };
};
export default connect(mapStateToProps)(ContactContent);
