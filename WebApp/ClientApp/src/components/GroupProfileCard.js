import React, { Component } from "react";
import { Input, Button, Grid, Image } from "semantic-ui-react";
import { Popup } from "./Popup";
import { Avatar } from "./Avatar";

import { chatUsers } from "../mockData/chats";

export class GroupProfileCard extends Component {
  state = { groupName: "", users: [] };
  onClose = () => {
    console.log("[UserProfileCard]: onClose");
  };
  render() {
    return (
      <Popup width="30em" onClose={this.onClose}>
        <div
          className="title single text_center unselect"
        >
          Create Group
        </div>
        <div className="flexBox maxWidth" style={{ padding: "1em" }}>
          <Input
            placeholder="Group Name"
            style={{ flex: 1 }}
            onKeyDown={this.onKeyPress}
            value={this.state.groupName}
            onChange={e =>
              this.setState({ ...this.state, groupName: e.target.value })
            }
          />
        </div>
        <GroupUsers />
        <Button positive>Create</Button>
      </Popup>
    );
  }
}

function GroupUsers() {
  return (
    <div className="flexBox maxWidth" style={{ padding: "1em" }}>
      <div
        className="flexBox row"
        style={{
          padding: "0",
          alignSelf: "center",
        }}
      >
        {chatUsers.map((user, i) => (
          <Avatar
            key={i}
            src={user.profilePhoto}
            style={{ padding: "0.2em", width: "4em", alignSelf: "center" }}
          />
        ))}
      </div>
    </div>
  );
}
