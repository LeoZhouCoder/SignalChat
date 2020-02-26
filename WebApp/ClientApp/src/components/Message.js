import React from "react";
import { connect } from "react-redux";
import Avatar from "./Avatar";
import { getUserProfile } from "../redux/chatActions";
import { getTimeString } from "../utils/Time";

const Message = ({ chat, user, self }) => {
  return (
    <div className="flexBox maxWidth padding">
      <div className="flexBox column">
        <Avatar
          style={{ width: "3em" }}
          src={user ? user.profilePhoto : ""}
          icon="user"
        />
      </div>

      <div className="space flexBox row center extendable chat">
        <div className="secondary single">{user ? user.name : ""}</div>
        <div className="tertiary space">{getTimeString(chat.createdOn)}</div>
        <div className="break" />
        <div className={`message multiple flexMaxWidth ${self ? "self" : ""}`}>
          {stringToHTML(chat.content)}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state, props) => {
  const { chat } = props;
  const { sender } = chat;
  return {
    user: getUserProfile(sender),
    self: state.authReducer.user.id === sender
  };
};

const stringToHTML = str => {
  return <div dangerouslySetInnerHTML={{ __html: str }} />
};

export default connect(mapStateToProps)(Message);
