import React from "react";
import { connect } from "react-redux";

import { SCREEN_NORMAL, SCREEN_BIG } from "../utils/Dimensions";

import Sidebar from "../components/Sidebar";
import MainScreen from "../components/MainScreen";

const Chatroom = props => {
  console.log("screenType", props.screenType);
  let screenType = props.screenType;
  let showSidebar = screenType === SCREEN_NORMAL || screenType === SCREEN_BIG;
  return (
    <div className="flexBox max">
      {showSidebar && <Sidebar />}
      <MainScreen />
    </div>
  );
};

const mapStateToProps = state => ({ screenType: state.dimensionReducer.type });
export default connect(mapStateToProps)(Chatroom);
