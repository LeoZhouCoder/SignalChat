import { USER_LOGIN } from "./actionTypes";

const loginUser = loginResult => ({
  type: USER_LOGIN,
  payload: loginResult
});

export const login = user => {
  console.log("login start:", user);
  return dispatch => {
    return fetch("http://localhost:60601/auth/signIn", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(user)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // TODO: validation token user
          dispatch(loginUser(data));
          console.log("login success: ", data);
        } else {
          console.log("login error: ", data.message);
        }
      })
      .catch(error => console.log("login fetch error: ", error));
  };
};

export const register = request => {
  console.log("register start:", request);
  return dispatch => {
    return fetch("http://localhost:60601/auth/signUp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(request)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          let { user, token } = data;
          dispatch(loginUser(user));
          localStorage.setItem("token", token.token);
          console.log("register success: ", user);
        } else {
          console.log("register error: ", data.message);
        }
      })
      .catch(error => console.log("register fetch error: ", error));
  };
};
