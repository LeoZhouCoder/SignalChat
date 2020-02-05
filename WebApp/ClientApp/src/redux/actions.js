import { USER_LOGIN } from "./actionTypes";

const loginUser = user => ({
  type: USER_LOGIN,
  payload: user
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
          let { user, token } = data;
          dispatch(loginUser(user));
          localStorage.setItem("token", token.token);
          console.log("login success: ", user);
        } else {
          console.log("login error: ", data.message);
        }
      })
      .catch(error => console.log("login fetch error: ", error));
  };
};