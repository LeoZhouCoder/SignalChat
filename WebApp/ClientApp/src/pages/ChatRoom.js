import React, { Component } from "react";
import { connect } from "react-redux";

import { SCREEN_NORMAL, SCREEN_BIG } from "../utils/Dimensions";

import Sidebar from "../components/Sidebar";
import MainScreen from "../components/MainScreen";

class Chatroom extends Component {
  state = { activeMenu: "Chats" };

  render() {
    let { screenType } = this.props;
    let { activeMenu } = this.state;
    let showSidebar = false;
    if (screenType === SCREEN_NORMAL || screenType === SCREEN_BIG) {
      showSidebar = true;
      activeMenu = "ChatHistory";
    }
    return (
      <div className="flexBox max">
        {showSidebar && <Sidebar screenType={screenType} />}
        <MainScreen screenType={screenType} activeMenu={activeMenu} />
      </div>
    );
  }
}

const mapStateToProps = state => ({ screenType: state.dimensionReducer.type });
export default connect(mapStateToProps)(Chatroom);
