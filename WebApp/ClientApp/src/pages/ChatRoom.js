import React, { Component } from "react";
import { connect } from "react-redux";

import { SCREEN_NORMAL, SCREEN_BIG } from "../utils/Dimensions";

import Sidebar from "../components/Sidebar";
import MainScreen from "../components/MainScreen";
import GroupProfileCard from "../components/GroupProfileCard";
import MessageBox from "../components/MessageBox";
import { UserProfileCard } from "../components/UserProfileCard";
import { hubStart } from "../utils/ChatHub";

class Chatroom extends Component {
  state = { activeMenu: "Chats" };
  constructor(props) {
    hubStart();
    super(props);
  }
  render() {
    let { screenType, profile } = this.props;
    let { activeMenu } = this.state;
    let showSidebar = false;
    if (screenType === SCREEN_NORMAL || screenType === SCREEN_BIG) {
      showSidebar = true;
      activeMenu = "ChatHistory";
    }

    let profileCard = null;
    if (profile) {
      if (profile.type) {
        profileCard = <UserProfileCard uid={profile.id} />;
      } else {
        profileCard = <GroupProfileCard gid={profile.id} />;
      }
    }

    return (
      <div>
        <MessageBox/>
        <div className={`flexBox max ${profileCard === null ? "" : "blur"}`}>
          {showSidebar && <Sidebar screenType={screenType} />}
          <MainScreen screenType={screenType} activeMenu={activeMenu} />
        </div>
        {profileCard}
      </div>
    );
  }
}
const mapStateToProps = state => ({
  screenType: state.dimensionReducer,
  profile: state.chatReducer.profile
});
export default connect(mapStateToProps)(Chatroom);
