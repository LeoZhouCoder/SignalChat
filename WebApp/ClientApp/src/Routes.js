import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter, Route } from "react-router-dom";

import { updateScreenType } from "./redux/actions";

import PrivateRoute from "./components/PrivateRoute";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ChatRoom from "./pages/ChatRoom";

import { getScreenType } from "./utils/Dimensions";

export class Routes extends Component {
  componentDidMount() {
    this.props.updateDimensions();
    window.addEventListener("resize", this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
  }

  onResize = () => {
    const { screenType, updateDimensions } = this.props;
    if (getScreenType() !== screenType) updateDimensions();
  };

  render() {
    return (
      <BrowserRouter>
        <div style={{ overflow: "hidden", width: "100%", height: "100%" }}>
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <PrivateRoute
            exact
            path="/"
            component={ChatRoom}
            token={this.props.token}
          />
        </div>
      </BrowserRouter>
    );
  }
}
const mapStateToProps = state => ({
  token: state.authReducer.token,
  screenType: state.dimensionReducer
});
const mapDispatchToProps = dispatch => ({
  updateDimensions: () => dispatch(updateScreenType())
});
export default connect(mapStateToProps, mapDispatchToProps)(Routes);
