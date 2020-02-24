import React from "react";
import { connect } from "react-redux";

import Avatar from "./Avatar";
import { getUserProfile } from "../redux/chatActions";

function Profile({ user, bigScreen, onClick }) {
  return (
    <div
      className="flexBox maxWidth padding profile pointer"
      onClick={() => onClick()}
    >
      <Avatar
        src={user && user.profilePhoto ? user.profilePhoto : ""}
        style={{ width: "5em" }}
      />
      {bigScreen && (
        <div className="title text_center space">{user ? user.name : ""}</div>
      )}
    </div>
  );
}

const mapStateToProps = state => ({
  user: getUserProfile(state.authReducer.user.id)
});
export default connect(mapStateToProps)(Profile);
