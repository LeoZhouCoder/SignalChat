import React, { Component } from "react";
import { connect } from "react-redux";

import { SCREEN_NORMAL, SCREEN_BIG } from "../utils/Dimensions";

import Sidebar from "../components/Sidebar";
import MainScreen from "../components/MainScreen";
import { SelectMemberCard } from "../components/SelectMemberCard";
import { hubStart } from "../utils/ChatHub";

class Chatroom extends Component {
  state = { activeMenu: "Chats" };
  constructor(props) {
    hubStart();
    super(props);
  }
  render() {
    let { screenType } = this.props;
    let { activeMenu } = this.state;
    let showSidebar = false;
    if (screenType === SCREEN_NORMAL || screenType === SCREEN_BIG) {
      showSidebar = true;
      activeMenu = "ChatHistory";
    }
    return (
      <div>
        <div className="flexBox max blur">
          {showSidebar && <Sidebar screenType={screenType} />}
          <MainScreen screenType={screenType} activeMenu={activeMenu} />
        </div>
        <SelectMemberCard />
      </div>
    );
  }
}
const mapStateToProps = state => ({ screenType: state.dimensionReducer });
export default connect(mapStateToProps)(Chatroom);
//
//