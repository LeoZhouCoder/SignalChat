import React from "react";
import { Route, Redirect } from "react-router-dom";

function PrivateRoute({ component: Component, currentUser, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        currentUser ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { referer: props.location } }}
          />
        )
      }
    />
  );
}

export default PrivateRoute;
