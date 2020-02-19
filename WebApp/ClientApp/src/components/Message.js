import React from "react";
import { connect } from "react-redux";
import { Avatar } from "./Avatar";
import { getUserProfile } from "../redux/actions";

const Message = ({ chat, self }) => {
  const userProfile = getUserProfile(chat.sender);
  return (
    <div className="flexBox maxWidth padding">
      <div className="column">
        <Avatar
          size="large"
          src={userProfile ? userProfile.profilePhoto : ""}
          icon="user"
        />
      </div>

      <div className="space flex row center extendable">
        <div className="secondary single">
          {userProfile ? userProfile.name : ""}
        </div>
        <div className="tertiary space">{chat.createdOn}</div>
        <div className="break" />
        <div className={`message multiple flexMaxWidth ${self ? "self" : ""}`}>
          {chat.content}
        </div>
      </div>
    </div>
  );
};


const mapStateToProps = state => ({
  userProfile: state.chatReducer.users
});
export default connect(mapStateToProps)(Message);
