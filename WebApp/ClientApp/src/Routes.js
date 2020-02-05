import React from "react";
import { connect } from "react-redux";
import { BrowserRouter, Route } from "react-router-dom";

import PrivateRoute from "./components/PrivateRoute";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ChatRoom from "./pages/ChatRoom";

export function Routes(props) {
  return (
    <BrowserRouter>
      <div>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <PrivateRoute
          exact
          path="/"
          component={ChatRoom}
          currentUser={props.currentUser}
        />
      </div>
    </BrowserRouter>
  );
}
const mapStateToProps = state => ({ currentUser: state.authReducer.currentUser });
export default connect(mapStateToProps)(Routes);
