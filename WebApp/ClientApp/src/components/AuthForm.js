import React from "react";
import { Link } from "react-router-dom";
import { Form, Header, Icon, Segment, Button } from "semantic-ui-react";

function AuthForm(props) {
  return (
    <div style={{ height: "100vh" }}>
      <div className="bg-image" />
      <div className="formBasic">
        <Form size="large">
          <Segment >
            <Header color="green" as="h2" textAlign="center">
              <Icon color="green" name="chat" />
              Let's Chat
            </Header>
            {props.children}
          </Segment>
        </Form>
        {props.link}
      </div>
      <LinkButtons/>
    </div>
  );
}

function AuthLink(props) {
  return (
    <Segment>
      {props.msg} <Link to={props.link}>{props.buttonName}</Link>
    </Segment>
  );
}

function LinkButtons() {
  return (
    <div className="linkButtons">
      <Button color="black" onClick={()=>window.open("https://github.com/LeoZhouCoder/SignalChat",'_blank')}>
        <Icon name="github" /> Source
      </Button>
      <Button color="linkedin" onClick={()=>window.open("https://www.linkedin.com/in/leo-zhou-coder",'_blank')}>
        <Icon name="linkedin" /> LinkedIn
      </Button>
    </div>
  );
}

export { AuthForm, AuthLink };
