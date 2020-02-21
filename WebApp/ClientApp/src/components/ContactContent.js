import React, { Component } from "react";
import { connect } from "react-redux";
import { ListItem } from "./List";
import { getUserProfile } from "../redux/chatActions";

export class ContactContent extends Component {
  render() {
    const { data, selected, collapsed, onClickItem } = this.props;
    const userProfile = getUserProfile(data);
    const name = userProfile ? userProfile.name : "";
    const profilePhoto = userProfile ? userProfile.profilePhoto : "";
    return (
      <ListItem
        data={data}
        img={profilePhoto}
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
}

const mapStateToProps = state => ({
  userProfile: state.chatReducer.users
});
export default connect(mapStateToProps)(ContactContent);
