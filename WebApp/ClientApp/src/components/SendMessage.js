import React, { Component } from "react";
import {
  Icon,
  Menu,
  Segment,
  Form,
  TextArea,
  Input,
  Button
} from "semantic-ui-react";
import { connect } from "react-redux";

import { SCREEN_BIG } from "../utils/Dimensions";
import { sendMessage } from "../redux/chatActions";

class SendMessage extends Component {
  state = { text: "" };

  handleItemClick = () => {
    console.log("Click emoji!");
  };

  onKeyPress = e => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    this.doSendMessage();
    this.setState({ text: "" });
  };

  doSendMessage = () => {
    console.log("doSendMessage: ", this.props);
    sendMessage(0, this.state.text, this.props.chatroom, null);
    this.setState({ text: "" });
  };

  onChange = e => {
    this.setState({ text: e.target.value });
  };

  render() {
    const { screenSize } = this.props;
    if (screenSize === SCREEN_BIG) {
      return (
        <div>
          <Menu attached="top" style={{ marginTop: "0em" }}>
            <Menu.Item name="smile outline" onClick={this.handleItemClick}>
              <Icon name="smile outline" />
            </Menu.Item>
          </Menu>
          <Segment attached>
            <Form>
              <TextArea
                placeholder="Message"
                value={this.state.text}
                onChange={this.onChange}
                onKeyDown={this.onKeyPress}
              />
            </Form>
          </Segment>
        </div>
      );
    }

    return (
      <div className="flexBox maxWidth padding divider center-v">
        <div className="flexBox maxWidth">
          <Input
            placeholder="Message"
            value={this.state.text}
            style={{ flex: 1 }}
            onChange={this.onChange}
            onKeyDown={this.onKeyPress}
          />
        </div>
        <div className="flexBox center-v space">
          <Icon name="smile outline" size="big" color="grey" />
          <Button className="space" color="teal" onClick={this.doSendMessage}>
            Send
          </Button>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  chatroom: state.chatReducer.chatroom
});
export default connect(mapStateToProps)(SendMessage);
