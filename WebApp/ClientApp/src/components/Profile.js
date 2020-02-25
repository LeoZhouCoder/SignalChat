import React from "react";
import { connect } from "react-redux";

import Avatar from "./Avatar";
import { onCloseHub, getUserProfile } from "../redux/chatActions";

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
        <div className="title text_center space extendable">{user ? user.name : ""}</div>
      )}
      {bigScreen && (
        <div className="text_center secondary" onClick={() => onCloseHub()}>
          Logout
        </div>
      )}
    </div>
  );
}

const mapStateToProps = state => ({
  user: getUserProfile(state.authReducer.user.id)
});
export default connect(mapStateToProps)(Profile);
