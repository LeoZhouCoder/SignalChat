import React from "react";
import { Link } from "react-router-dom";
import { Form, Grid, Header, Icon, Segment, Message } from "semantic-ui-react";

function AuthForm(props) {
  return (
    <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="green" textAlign="center">
          <Icon name="chat" color="green" />
          Let's Chat
        </Header>
        <Form size="large">
          <Segment>{props.children}</Segment>
        </Form>
        {props.link}
      </Grid.Column>
    </Grid>
  );
}

function AuthLink(props) {
  return (
    <Message>
      {props.msg} <Link to={props.link}>{props.buttonName}</Link>
    </Message>
  );
}

export { AuthForm, AuthLink };
