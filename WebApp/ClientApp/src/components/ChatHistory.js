import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";

import Message from "./Message.js";
import { getGroupChats, getUserChats } from "../utils/Chat";

class ChatHistory extends React.Component {
  componentDidMount() {
    this.scrollToBot();
    /*
    const { chatHistory } = this.props;
    const { records, owner } = chatHistory;
    if (!owner || !owner.id) return;
    if (owner.type === 0) {
      getGroupChats(owner.id, records.length);
    } else {
      getUserChats(owner.id, records.length);
    }*/
  }

  componentDidUpdate() {
    this.scrollToBot();
    /*const { chatHistory } = this.props;
    const { records, owner } = chatHistory;
    if (!owner || !owner.id) return;
    if (owner.type === 0) {
      getGroupChats(owner.id, records.length);
    } else {
      getUserChats(owner.id, records.length);
    }*/
  }

  scrollToBot = () => {
    let dom = ReactDOM.findDOMNode(this.refs.chats);
    if (!dom) return;
    dom.scrollTop = dom.scrollHeight;
  };

  render() {
    const { user, chatHistory } = this.props;
    const { records } = chatHistory;
    console.log("ChatHistory render: ", records);
    if (records.length === 0) {
      return (
        <div className="extendable list chats">
          <div className="flexBox column maxParent center-v secondary padding">
            "Let's start chat."
          </div>
        </div>
      );
    }

    return (
      <div className="extendable list chats" ref="chats">
        {records.map((chat, i) => (
          <Message key={i} chat={chat} self={chat.sender === user.id} />
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.authReducer.user,
  chatHistory: state.chatReducer.chatHistory
});
export default connect(mapStateToProps)(ChatHistory);
