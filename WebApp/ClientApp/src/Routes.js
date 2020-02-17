import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter, Route } from "react-router-dom";

import { updateDimensions } from "./redux/actions";

import PrivateRoute from "./components/PrivateRoute";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ChatRoom from "./pages/ChatRoom";

export class Routes extends Component {
  componentDidMount() {
    this.props.updateDimensions();
    window.addEventListener("resize", this.props.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.props.updateDimensions);
  }

  render() {
    console.log(this.props.token);
    return (
      <BrowserRouter>
        <div style={{ overflow: "hidden" }}>
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
const mapStateToProps = state => ({ token: state.authReducer.token });
const mapDispatchToProps = dispatch => ({
  updateDimensions: () => dispatch(updateDimensions())
});
export default connect(mapStateToProps, mapDispatchToProps)(Routes);
