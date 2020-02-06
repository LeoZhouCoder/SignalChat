import React, { Component } from "react";
import { Button, Form } from "semantic-ui-react";

import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import { AuthForm, AuthLink } from "../components/AuthForm";
import { register } from "../redux/actions";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
      },
      errors: {}
    };
  }

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

  handleClickButton = event => {
    event.preventDefault();
    this.props.register(this.state.formData);
  };

  render() {
    if (this.props.currentUser) {
      const referer = this.props.location.state
        ? this.props.location.state.referer || "/"
        : "/";
      return <Redirect to={referer} />;
    }
    return (
      <AuthForm
        link={
          <AuthLink
            msg="Already have an account?"
            buttonName="Sign In"
            link="/login"
          />
        }
      >
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
        <Button
          color="teal"
          fluid
          size="large"
          disabled={this.isDisabled()}
          onClick={this.handleClickButton}
        >
          Signup
        </Button>
      </AuthForm>
    );
  }
}


const mapStateToProps = state => ({
  currentUser: state.authReducer.currentUser
});

const mapDispatchToProps = dispatch => ({
  register: user => dispatch(register(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
