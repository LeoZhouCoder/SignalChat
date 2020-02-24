import React, { Component } from "react";
import { Input, Button } from "semantic-ui-react";
import { connect } from "react-redux";

import { Popup } from "./Popup";
import { AvatarPicker } from "./AvatarPicker";
import { EditMemberList } from "./EditMemberList";
import SelectUserList from "./SelectUserList";

import { SHOW_PROFILE } from "../redux/reducers/chat";

import { getUserProfile } from "../redux/chatActions";

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
      name: name,
      users: users ? users : [],
      searchKey: ""
    };
  };

  componentWillReceiveProps() {
    this.setState(this.resetState());
  }

  onClickButton = cancel => {
    if (cancel) {
      if (this.state.isSelectMembers) {
        this.setState({ ...this.state, isSelectMembers: false });
      } else {
        this.props.hideGroupProfile();
      }
    } else {
      if (this.state.isSelectMembers) {
        this.setState({ ...this.state, isSelectMembers: false });
      } else {
        console.log(
          "[GroupProfileCard]: Update Group",
          this.props.gid,
          this.state
        );
      }
    }
  };

  onClickItem = id => {
    console.log("[SelectMemberCard]: onClickItem", id);
    let { users } = this.state;
    if (users.includes(id)) {
      users = users.filter(uid => uid !== id);
    } else {
      users = [...users, id];
    }
    this.setState({ ...this.state, users: users });
  };

  getName = () => {
    return (
      <div className="flexBox maxWidth" style={{ padding: "1em 1em 0 1em" }}>
        <Input
          placeholder="Group Name"
          style={{ flex: 1 }}
          onKeyDown={this.onKeyPress}
          value={this.state.groupName}
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
            this.setState({ ...this.state, isSelectMembers: true });
        }}
      />
    );
  };

  getEditMemberList = () => {
    return (
      <EditMemberList
        className="divider"
        style={{ padding: "0 1em 0.5em 1em" }}
        selectedUsers={this.state.users}
      />
    );
  };

  getSearch = () => {
    return (
      <div className="flexBox maxWidth" style={{ padding: "0 1em 0 1em" }}>
        <Input
          placeholder="Search"
          style={{ flex: 1 }}
          onKeyDown={this.onKeyPress}
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
        selectedUsers={this.state.users}
        searchKey={this.state.searchKey}
        onClickItem={this.onClickItem}
      />
    );
  };

  render() {
    const { group } = this.props;
    const oldUsers = group.users;
    const { isSelectMembers } = this.state;
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

    return (
      <Popup width="30em" onClose={this.props.hideGroupProfile}>
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
          {isSelectMembers && this.getEditMemberList()}
          {isSelectMembers && this.getSearch()}
          {isSelectMembers && this.getSelectUserList()}
          <div
            className="flexBox row"
            style={{ justifyContent: "space-evenly" }}
          >
            {!isSelectMembers && (
              <Button onClick={this.onClickButton}>Cancel</Button>
            )}

            <Button positive onClick={this.onClickButton}>
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
  return { group: group };
};

const mapDispatchToProps = dispatch => ({
  hideGroupProfile: () => dispatch({ type: SHOW_PROFILE, payload: null })
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupProfileCard);
