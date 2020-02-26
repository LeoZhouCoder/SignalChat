import React from "react";
import { connect } from "react-redux";
import Avatar from "./Avatar";
import { getUserProfile } from "../redux/chatActions";
import { getTimeString } from "../utils/Time";
import { SHOW_PROFILE } from "../redux/reducers/chat";

const Message = ({ chat, user, self, showUserProfile }) => {
  return (
    <div className="flexBox maxWidth padding">
      <div className="flexBox column pointer">
        <Avatar
          style={{ width: "3em" }}
          src={user ? user.profilePhoto : ""}
          icon="user"
          onClick={() => showUserProfile(user.id)}
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
const stringToHTML = str => {
  return <div dangerouslySetInnerHTML={{ __html: str }} />;
};

const mapStateToProps = (state, props) => {
  const { chat } = props;
  const { sender } = chat;
  return {
    user: getUserProfile(sender),
    self: state.authReducer.user.id === sender
  };
};

const mapDispatchToProps = dispatch => ({
  showUserProfile: uid =>
    dispatch({
      type: SHOW_PROFILE,
      payload: { type: 1, id: uid }
    })
});

export default connect(mapStateToProps, mapDispatchToProps)(Message);
