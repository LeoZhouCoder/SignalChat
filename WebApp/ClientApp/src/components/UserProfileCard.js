import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "semantic-ui-react";

import Popup from "./Popup";
import Avatar from "./Avatar";
import { SHOW_PROFILE } from "../redux/reducers/chat";
import {
  getUserProfile,
  createGroup,
  changeChatroom,
  addMessage
} from "../redux/chatActions";


class UserProfileCard extends Component {
  state = { type: "display" };

  onClickButton = () => {
    const { uid, currentUser, chatroom, groups } = this.props;
    // edit profile
    if (uid === currentUser) {
      addMessage("[UserProfileCard]: Edit profile is not implemented yet.", true);
      this.props.hideProfile();
      return;
    }

    // send message
    let group = groups.find(group => {
      let { users } = group;
      if (users.length > 2) return false;
      if (users.length === 1) return users[0] === uid && uid === currentUser;
      return users.includes(uid) && users.includes(currentUser);
    });

    if (group) {
      if (chatroom !== group.id) changeChatroom(group.id);
    } else {
      if (currentUser === uid) {
        createGroup(null, [uid]);
      } else {
        createGroup(null, [currentUser, uid]);
      }
    }
    this.props.hideProfile();
  };

  render() {
    const { user, uid, currentUser } = this.props;
    return (
      <Popup width="20em" onClose={() => this.props.hideProfile()}>
        <Avatar
          src={user.profilePhoto}
          style={{ width: "10em", alignSelf: "center" }}
          onClick={() => this.setState({ type: "editingAvatar" })}
        />
        <div className="title text_center padding">{user.name}</div>
        <Button positive onClick={this.onClickButton}>
          {uid === currentUser ? "Edit" : "Send Message"}
        </Button>
      </Popup>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    user: getUserProfile(props.uid),
    chatroom: state.chatReducer.chatroom,
    currentUser: state.authReducer.user.id,
    groups: state.chatReducer.groups
  };
};

const mapDispatchToProps = dispatch => ({
  hideProfile: () => dispatch({ type: SHOW_PROFILE, payload: null })
});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileCard);
