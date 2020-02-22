import React, { Component } from "react";
import { Button, Form } from "semantic-ui-react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import { AuthForm, AuthLink } from "../components/AuthForm";
import { login } from "../redux/actions";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        email: "",
        password: ""
      },
      errors: {}
    };
  }

  isDisabled = () => {
    let { formData, errors } = this.state;
    let disabled = false;
    Object.keys(formData).forEach(key => {
      if (formData[key] === "") disabled = true;
    });
    Object.keys(errors).forEach(key => {
      if (errors[key]) return (disabled = true);
    });
    return disabled;
  };

  handleInputChange = (e, data) => {
    let { id, value } = data;

    let formData = {};
    formData[id] = value;
    formData = Object.assign({}, this.state.formData, formData);

    let errors = {};
    errors[id] = this.validateField(id, value);
    errors = Object.assign({}, this.state.errors, errors);

    this.setState({ formData, errors });
  };

  validateField = (key, value) => {
    let content = null;
    switch (key) {
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
        }
        break;
      default:
        break;
    }
    return content;
  };

  handleClickButton = event => {
    event.preventDefault();
    this.props.login(this.state.formData);
  };

  render() {
    if (this.props.token) {
      const state = this.props.location.state;
      return <Redirect to={state && state.referer ? state.referer : "/"} />;
    }

    return (
      <AuthForm
        link={<AuthLink msg="New to us?" buttonName="Sign Up" link="/signup" />}
      >
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
        <Button
          color="green"
          fluid
          size="large"
          disabled={this.isDisabled()}
          onClick={this.handleClickButton}
        >
          Login
        </Button>
      </AuthForm>
    );
  }
}

const mapStateToProps = state => ({
  token: state.authReducer.token
});

const mapDispatchToProps = dispatch => ({
  login: user => dispatch(login(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
