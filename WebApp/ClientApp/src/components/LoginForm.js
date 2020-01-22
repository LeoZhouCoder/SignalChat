import React, { Component } from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Icon,
  Message,
  Segment
} from "semantic-ui-react";

export default class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: true,
      formData: this.resetFromData(true),
      errors: {}
    };
  }
  resetFromData = isLogin => {
    let data = {
      email: "",
      password: ""
    };
    if (isLogin) return data;
    data.firstName = "";
    data.lastName = "";
    data.confirmPassword = "";
    return data;
  };
  getNameInputs = () => {
    if (this.state.isLogin) return null;
    return (
      <Form.Group widths="equal">
        <Form.Input
          id="firstName"
          fluid
          placeholder="First name"
          value={this.state.formData.firstName}
          error={this.state.errors.firstName}
          onChange={this.handleInputChange}
        />
        <Form.Input
          id="lastName"
          fluid
          placeholder="Last name"
          value={this.state.formData.lastName}
          error={this.state.errors.lastName}
          onChange={this.handleInputChange}
        />
      </Form.Group>
    );
  };

  getConfirmPassword = () => {
    if (this.state.isLogin) return null;
    return (
      <Form.Input
        id="confirmPassword"
        fluid
        icon="lock"
        iconPosition="left"
        placeholder="ConfirmPassword"
        value={this.state.formData.confirmPassword}
        error={this.state.errors.confirmPassword}
        type="password"
        onChange={this.handleInputChange}
      />
    );
  };
  getMessage = () => {
    if (this.state.isLogin) {
      return (
        <Message>
          New to us?{" "}
          <button
            type="button"
            className="link-button"
            onClick={this.handleClick}
            color="teal"
          >
            Sign Up
          </button>
        </Message>
      );
    } else {
      return (
        <Message>
          Already have an account?{" "}
          <button
            type="button"
            className="link-button"
            onClick={this.handleClick}
            color="teal"
          >
            Sign In
          </button>
        </Message>
      );
    }
  };

  isDisabled = () => {
    let { formData, errors } = this.state;
    let disabled = false;
    Object.keys(formData).forEach(function(key) {
      if (formData[key] === "") disabled = true;
    });
    Object.keys(errors).forEach(function(key) {
      if (errors[key]) return (disabled = true);
    });
    return disabled;
  };

  handleClick = () => {
    this.setState({
      isLogin: !this.state.isLogin,
      i: this.resetFromData(!this.state.isLogin),
      errors: {}
    });
  };

  handleInputChange = (e, data) => {
    let { id, value } = data;

    let formData = {};
    formData[id] = value;
    formData = Object.assign({}, this.state.formData, formData);

    let errors = {};
    errors[id] = this.validateField(id, value);
    errors = Object.assign({}, this.state.errors, errors);

    let newData = { formData, errors };
    newData = Object.assign({}, this.state, newData);
    this.setState(Object.assign({}, this.state, newData));
  };

  validateField = (key, value) => {
    let content = null;
    switch (key) {
      case "firstName":
      case "lastName":
        if (!value || /^\s{1,}$/.test(value)) {
          content = key + " is required";
        }
        break;
      case "email":
        if (!value || /^\s{1,}$/.test(value)) {
          content = key + " is required";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          content = key + " is invalid";
        }
        break;
      case "password":
        if (!value || /^\s{1,}$/.test(value)) {
          content = key + " is required";
        } else if (value.length < 7) {
          content = "Password must be at least 7 characters";
        } else if (!/\w*[a-zA-Z]\w*/.test(value)) {
          content = "Password must contain at least one letter";
        } else if (!/\w*[0-9]\w*/.test(value)) {
          content = "Password must contain at least one number";
        }
        break;
      case "confirmPassword":
        if (value !== this.state.formData.password) {
          content = "ConfirmPassword is not the same with Password";
        }
        break;
      default:
        break;
    }
    return content;
  };

  handleClickButton = (e, data) => {
    console.log(this.state);
    var response = this.postData("http://192.168.1.2:60501/auth/signIn", {
      email: this.state.email,
      password: this.state.password
    });
    console.log(response);
  };

  postData = async (url = "", data = {}) => {
    const response = await fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: data
    })
      .then(res => {
        if (res.ok) {
          return response.json();
        } else {
          console.log("response false: ", res);
        }
      })
      .catch(error => console.log("error:", error));
  };

  render() {
    return (
      <Grid
        textAlign="center"
        style={{ height: "100vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="teal" textAlign="center">
            <Icon name="chat" color="teal" />
            Let's Chat
          </Header>
          <Form size="large">
            <Segment>
              {this.getNameInputs()}
              <Form.Input
                id="email"
                fluid
                icon="user"
                iconPosition="left"
                placeholder="E-mail address"
                value={this.state.formData.email}
                error={this.state.errors.email}
                onChange={this.handleInputChange}
              />
              <Form.Input
                id="password"
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                value={this.state.formData.password}
                error={this.state.errors.password}
                type="password"
                onChange={this.handleInputChange}
              />
              {this.getConfirmPassword()}
              <Button
                color="teal"
                fluid
                size="large"
                disabled={this.isDisabled()}
                onClick={this.handleClickButton}
              >
                {this.state.isLogin ? "Login" : "Register"}
              </Button>
            </Segment>
          </Form>
          {this.getMessage()}
        </Grid.Column>
      </Grid>
    );
  }
}
