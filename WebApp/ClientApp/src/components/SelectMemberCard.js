import React, { Component } from "react";
import { Input, Button } from "semantic-ui-react";

import { Popup } from "./Popup";
import { EditMemberList } from "./EditMemberList";
import { SelectUserList } from "./SelectUserList";

export class SelectMemberCard extends Component {
  state = { selectedUsers: [], searchKey: "" };

  onClose = () => {
    console.log("[UserProfileCard]: onClose");
  };

  onClickItem = user => {
    console.log("[SelectMemberCard]: onClickItem", user);
    const { id } = user;
    let { selectedUsers } = this.state;
    if (selectedUsers.includes(id)) {
      selectedUsers = selectedUsers.filter(uid => uid !== id);
    } else {
      selectedUsers = [...selectedUsers, id];
    }
    this.setState({ ...this.state, selectedUsers: selectedUsers });
  };

  render() {
    return (
      <Popup width="30em" onClose={this.onClose}>
        <div
          className="title single text_center unselect"
          style={{ padding: "1em 1em 1em 1em" }}
        >
          Select Members
        </div>
        <EditMemberList
          className="divider"
          style={{ padding: "0 1em 0.5em 1em" }}
          selectedUsers={this.state.selectedUsers}
        />
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
        <SelectUserList
          selectedUsers={this.state.selectedUsers}
          searchKey={this.state.searchKey}
          onClickItem={this.onClickItem}
        />
        <div className="flexBox row center-v">
          <Button onClick={this.doSendMessage}>Cancel</Button>
          <Button color="green" onClick={this.doSendMessage}>
            Confirm
          </Button>
        </div>
      </Popup>
    );
  }
}
