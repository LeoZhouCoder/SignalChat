import React from "react";
import ReactDOM from "react-dom";

import Message from "./Message.js";

import { getChatRecord } from "../mockData/chats";

class ChatHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = getChatRecord("r0");
  }

  componentDidMount() {
    this.scrollToBot();
  }

  componentDidUpdate() {
    this.scrollToBot();
  }

  scrollToBot = () => {
    let dom = ReactDOM.findDOMNode(this.refs.chats);
    dom.scrollTop = dom.scrollHeight;
  };

  render() {
    const { chats } = this.state;
    const user = "uid0";
    return (
      <div className="extendable list chats" ref="chats">
        {chats.map((chat, i) => (
            <Message key={i} chat={chat} self={chat.uid === user} />
        ))}
      </div>
    );
  }
}

export default ChatHistory;
