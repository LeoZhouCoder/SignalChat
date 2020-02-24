import React, { Component } from "react";
import { Input, Button } from "semantic-ui-react";
import { connect } from "react-redux";

import Popup from "./Popup";
import AvatarPicker from "./AvatarPicker";
import UserRowList from "./UserRowList";
import SelectUserList from "./SelectUserList";

import { SHOW_PROFILE } from "../redux/reducers/chat";
import { getUserProfile, createGroup, updateGroup } from "../redux/chatActions";

class GroupProfileCard extends Component {
  constructor(props) {
    super(props);
    this.state = this.resetState();
  }

  resetState = () => {
    const { group } = this.props;
    const { users, name } = group;
    return {
      isSelectMembers: false,
      name: name ? name : "",
      users: users ? users : [],
      temUsers: users ? users : [],
      searchKey: ""
    };
  };

  componentWillReceiveProps() {
    this.setState(this.resetState());
  }

  onClickButton = cancel => {
    if (this.state.isSelectMembers) {
      let newState = { ...this.state, isSelectMembers: false };
      if (!cancel) newState.users = this.state.temUsers;
      console.log("[GroupProfileCard]: onClickButton", newState);
      this.setState(newState);
    } else {
      if (cancel) {
        this.props.hideGroupProfile();
      } else {
        const { group, gid } = this.props;
        const oldUsers = group.users;
        const { name, users } = this.state;

        if (oldUsers.length < 3) {
          createGroup(name, users);
        } else {
          updateGroup(gid, name, users);
        }
      }
    }
  };

  onClickUser = uid => {
    let { temUsers } = this.state;
    if (temUsers.includes(uid)) {
      temUsers = temUsers.filter(user => user !== uid);
    } else {
      temUsers = [...temUsers, uid];
    }
    this.setState({ ...this.state, temUsers: temUsers });
  };

  getName = () => {
    return (
      <div className="flexBox maxWidth" style={{ padding: "1em 1em 0 1em" }}>
        <Input
          placeholder="Group Name"
          style={{ flex: 1 }}
          value={this.state.name}
          onChange={e => this.setState({ ...this.state, name: e.target.value })}
        />
      </div>
    );
  };

  getAvatarPicker = () => {
    const { users } = this.state;
    let avatars = users.map(user => {
      let profile = getUserProfile(user);
      return profile ? profile.profilePhoto : "";
    });
    avatars.unshift("./images/plus.png");
    return (
      <AvatarPicker
        avatars={avatars}
        onClickItem={index => {
          if (index === 0)
            this.setState({
              ...this.state,
              isSelectMembers: true,
              temUsers: this.state.users
            });
        }}
      />
    );
  };

  getUserRowList = () => {
    return (
      <UserRowList
        className="divider"
        style={{ padding: "0 1em 0.5em 1em" }}
        users={this.state.users}
      />
    );
  };

  getSearch = () => {
    return (
      <div className="flexBox maxWidth" style={{ padding: "0 1em 0 1em" }}>
        <Input
          placeholder="Search"
          style={{ flex: 1 }}
          icon="search"
          iconPosition="left"
          value={this.state.searchKey}
          onChange={e =>
            this.setState({ ...this.state, searchKey: e.target.value })
          }
        />
      </div>
    );
  };

  getSelectUserList = () => {
    return (
      <SelectUserList
        selectedUsers={this.state.temUsers}
        searchKey={this.state.searchKey}
        onClickItem={this.onClickUser}
        currentUser={this.props.currentUser}
      />
    );
  };

  render() {
    const { group } = this.props;
    const oldUsers = group.users;
    const { isSelectMembers, users, name } = this.state;
    const title = isSelectMembers
      ? "Select Members"
      : oldUsers.length > 2
      ? "Group Profile"
      : "Create Group";
    const buttonName = isSelectMembers
      ? "Confirm"
      : oldUsers.length > 2
      ? "Update"
      : "Create";
    console.log("[GroupProfileCard]: render", this.state);

    return (
      <Popup width="30em" onClose={() => this.onClickButton(true)}>
        <div
          style={{
            display: "flex",
            flexFlow: "column",
            width: "100%",
            alignItems: "center"
          }}
        >
          <div className="title single text_center unselect">{title}</div>
          {!isSelectMembers && this.getName()}
          {!isSelectMembers && this.getAvatarPicker()}
          {isSelectMembers && this.getUserRowList()}
          {isSelectMembers && this.getSearch()}
          {isSelectMembers && this.getSelectUserList()}
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-evenly"
            }}
          >
            <Button fluid onClick={() => this.onClickButton(true)}>
              Cancel
            </Button>
            <Button
              fluid
              disabled={!isSelectMembers && (!name || users.length < 3)}
              positive
              onClick={() => this.onClickButton(false)}
            >
              {buttonName}
            </Button>
          </div>
        </div>
      </Popup>
    );
  }
}

const mapStateToProps = (state, props) => {
  const group = state.chatReducer.groups.find(g => g.id === props.gid);
  return { group: group, currentUser: state.authReducer.user.id };
};

const mapDispatchToProps = dispatch => ({
  hideGroupProfile: () => dispatch({ type: SHOW_PROFILE, payload: null })
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupProfileCard);
