import React from "react";
import ReactDOM from "react-dom";
import { Menu, Icon, TextArea, Form, Segment } from "semantic-ui-react";

import Message from "./Message.js";

import { getChatRecord } from "../mockData/chats";
import { TopBar } from "./TopBar";

class ChatHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = getChatRecord("r0");
    this.submitMessage = this.submitMessage.bind(this);
  }

  componentDidMount() {
    this.scrollToBot();
  }

  componentDidUpdate() {
    this.scrollToBot();
  }

  scrollToBot() {
    ReactDOM.findDOMNode(this.refs.chats).scrollTop = ReactDOM.findDOMNode(
      this.refs.chats
    ).scrollHeight;
  }

  submitMessage(e) {
    e.preventDefault();

    this.setState(
      {
        chats: this.state.chats.concat([
          {
            username: "Kevin Hsu",
            content: <p>{ReactDOM.findDOMNode(this.refs.msg).value}</p>,
            img: "http://i.imgur.com/Tj5DGiO.jpg"
          }
        ])
      },
      () => {
        ReactDOM.findDOMNode(this.refs.msg).value = "";
      }
    );
  }

  onkeypress = e => {
    console.log(e.key);
  };
  onChange = e => {};
  actionHandler = () => {
    console.log("Click btn");
  };

  render() {
    const { chats, name } = this.state;
    return (
      <div className="chatroom">
        <TopBar name={name} icon="user" actionHandler={this.actionHandler} />
        <div className="chats" ref="chats">
          {chats.map((chat, i) => (
            <Message key={i} chat={chat} />
          ))}
        </div>

        <Menu attached="top" style={{ marginTop: "0em" }}>
          <Menu.Item name="smile outline" onClick={this.handleItemClick}>
            <Icon name="smile outline" />
          </Menu.Item>

          <Menu.Item name="paperclip" onClick={this.handleItemClick}>
            <Icon name="paperclip" />
          </Menu.Item>
        </Menu>
        <Segment attached>
          <Form>
            <TextArea placeholder="Message" onKeyDown={this.onkeypress} />
          </Form>
        </Segment>
      </div>
    );
  }
}

export default ChatHistory;
