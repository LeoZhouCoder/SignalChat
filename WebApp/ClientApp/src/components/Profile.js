import React, { Component } from "react";
import { connect } from "react-redux";
import { Icon, Input } from "semantic-ui-react";

import { Avatar } from "./Avatar";
import { getUserProfile } from "../redux/actions";

class Profile extends Component {
  state = { editing: false };

  getNameSection = user => {
    if (!this.props.bigScreen) return null;
    let name = user && user.name ? user.name : "";
    if (this.state.editing) {
      return (
        <Input
          className="space title"
          transparent
          value={name}
          focus
          placeholder="Enter your name"
        />
      );
    }

    return (
      <div className="title text_center space">
        {name}
        <Icon
          name="pencil alternate"
          size="small"
          className="space"
          onClick={() => this.setState({ editing: false })}
        />
      </div>
    );
  };

  render() {
    const user = getUserProfile(this.props.user.id);
    return (
      <div className="flexBox maxWidth padding profile">
        <Avatar src={user && user.profilePhoto ? user.profilePhoto : ""} size="big" />
        {this.getNameSection(user)}
      </div>
    );
  }
}
const mapStateToProps = state => ({
  user: state.authReducer.user,
  userProfile: state.chatReducer.users
});
export default connect(mapStateToProps)(Profile);
