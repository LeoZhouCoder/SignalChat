import React, { Component } from "react";
import { connect } from "react-redux";

import {
  SCREEN_SMALL,
  SCREEN_MEDIUM,
  SCREEN_NORMAL,
  SCREEN_BIG
} from "../utils/Dimensions";

import TopBar from "./TopBar";
import FooterMenu from "./FooterMenu";
import Content from "./Content";
import Sidebar from "./Sidebar";

class ChatroomLayout extends Component {
  render() {
    console.log("screenType", this.props.screenType);
    let screenType = this.props.screenType;
    let showSidebar = screenType === SCREEN_NORMAL || screenType === SCREEN_BIG;
    return (
      <div
        style={{
          minHeight: "100vh",
          position: "relative"
        }}
      >
        {showSidebar && <Sidebar />}
        <div>
          <TopBar />
          <Content />
          <FooterMenu />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({ screenType: state.dimensionReducer.type });
export default connect(mapStateToProps)(ChatroomLayout);
