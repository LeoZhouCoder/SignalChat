import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import { Popup } from "./Popup";
import { Avatar } from "./Avatar";
import { EditMemberList } from "./EditMemberList";
import SelectUserList from "./SelectUserList";

const avatars = [
  "https://react.semantic-ui.com/images/avatar/large/daniel.jpg",
  "https://react.semantic-ui.com/images/avatar/large/stevie.jpg",
  "https://react.semantic-ui.com/images/avatar/large/elliot.jpg",
  "https://react.semantic-ui.com/images/avatar/large/matt.jpg",
  "https://react.semantic-ui.com/images/avatar/large/christian.jpg",
  "https://react.semantic-ui.com/images/avatar/large/tom.jpg",
  "https://react.semantic-ui.com/images/avatar/large/jenny.jpg"
];

export class UserProfileCard extends Component {
  state = { type: "display" };
  onClose = () => {
    console.log("[UserProfileCard]: onClose");
  };
  render() {
    return (
      <Popup width="30em" onClose={this.onClose}>
        <EditMemberList />
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
