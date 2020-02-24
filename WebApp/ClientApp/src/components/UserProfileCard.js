import React, { Component } from "react";
import Popup from "./Popup";
import UserRowList from "./UserRowList";
import SelectUserList from "./SelectUserList";

export class UserProfileCard extends Component {
  state = { type: "display" };
  onClose = () => {
    console.log("[UserProfileCard]: onClose");
  };
  render() {
    return (
      <Popup width="30em" onClose={this.onClose}>
        <UserRowList />
        <SelectUserList />
      </Popup>
    );
  }
}
/**<Avatar
          src="https://react.semantic-ui.com/images/avatar/large/daniel.jpg"
          style={{ width: "10em",alignSelf: "center" }}
          onClick={() => this.setState({ type: "editingAvatar" })}
        />
        <div className="title text_center padding">Leo Zhou</div>
        <Button positive>Send Message</Button>
 * <EditMemberList/>
 * <div className="flexBox row padding maxWidth center-v text_center">
          {avatars.map((avatar, i) => (
            <Avatar
              key={i}
              src={avatar}
              style={{ width: "4em" }}
              onClick={() => this.setState({ type: "editingAvatar" })}
            />
          ))}
        </div>
 */
