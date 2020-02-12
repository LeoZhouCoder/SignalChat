import React from "react";
import ReactDOM from "react-dom";
import { Menu, Icon, TextArea } from "semantic-ui-react";

import Message from "./Message.js";

class ChatHistory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chats: [
        {
          username: "Kevin Hsu",
          content: <p>Hello World!</p>,
          img: "http://i.imgur.com/Tj5DGiO.jpg"
        },
        {
          username: "Alice Chen",
          content: <p>Love it! :heart:</p>,
          img: "http://i.imgur.com/Tj5DGiO.jpg"
        },
        {
          username: "Kevin Hsu",
          content: <p>Check out my Github at https://github.com/WigoHunter</p>,
          img: "http://i.imgur.com/Tj5DGiO.jpg"
        },
        {
          username: "KevHs",
          content: (
            <p>
              Lorem ipsum dolor sit amet, nibh ipsum. Cum class sem inceptos
              incidunt sed sed. Tempus wisi enim id, arcu sed lectus aliquam,
              nulla vitae est bibendum molestie elit risus.
            </p>
          ),
          img: "http://i.imgur.com/ARbQZix.jpg"
        },
        {
          username: "Kevin Hsu",
          content: <p>So</p>,
          img: "http://i.imgur.com/Tj5DGiO.jpg"
        },
        {
          username: "Kevin Hsu",
          content: (
            <p>
              Chilltime is going to be an app for you to view videos with
              friends
            </p>
          ),
          img: "http://i.imgur.com/Tj5DGiO.jpg"
        },
        {
          username: "Kevin Hsu",
          content: <p>You can sign-up now to try out our private beta!</p>,
          img: "http://i.imgur.com/Tj5DGiO.jpg"
        },
        {
          username: "Alice Chen",
          content: <p>Definitely! Sounds great!</p>,
          img: "http://i.imgur.com/Tj5DGiO.jpg"
        }
      ]
    };

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

  render() {
    const username = "Kevin Hsu";
    const { chats } = this.state;

    return (
      <div className="chatroom">
        <Menu attached="top">
          <h3>Chats</h3>
        </Menu>
        <ul className="chats" ref="chats">
          {chats.map((chat, i) => (
            <Message key={i} chat={chat} user={username} />
          ))}
        </ul>

        <Menu attached="bottom">
          <Menu.Item name="gamepad" onClick={this.handleItemClick}>
            <Icon name="gamepad" />
          </Menu.Item>

          <Menu.Item name="video camera" onClick={this.handleItemClick}>
            <Icon name="video camera" />
          </Menu.Item>

          <Menu.Item name="video play" onClick={this.handleItemClick}>
            <Icon name="video play" />
          </Menu.Item>
        </Menu>
        <TextArea placeholder="Tell us more" />
      </div>
    );
  }
}

export default ChatHistory;
/**
 * <form className="input" onSubmit={e => this.submitMessage(e)}>
          <input type="text" ref="msg" />
          <input type="submit" value="Submit" />
        </form>
 */
