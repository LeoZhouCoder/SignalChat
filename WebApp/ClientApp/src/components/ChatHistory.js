import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";

import Message from "./Message.js";
import { getChats } from "../redux/chatActions";

class ChatHistory extends React.Component {
  temState = {
    oldChats: null,
    scrollHeight: 0,
    loading: false
  };

  componentDidMount() {
    this.scrollToBot();
  }

  componentDidUpdate() {
    let dom = ReactDOM.findDOMNode(this.refs.chats);
    const newState = {
      oldChats: this.props.chats,
      scrollHeight: dom ? dom.scrollHeight : 0
    };
    if (!this.temState.loading) {
      this.scrollToBot();
    } else {
      const { oldChats, scrollHeight } = this.temState;
      const newChats = this.props.chats;
      if (
        oldChats !== newChats &&
        newChats[newChats.length - 1].id === oldChats[oldChats.length - 1].id
      ) {
        if (dom) dom.scrollTop = dom.scrollHeight - scrollHeight;
        newState.loading = false;
      }
    }
    this.temState = newState;
  }

  scrollToBot = () => {
    let dom = ReactDOM.findDOMNode(this.refs.chats);
    if (!dom) return;
    dom.scrollTop = dom.scrollHeight;
  };

  onScroll = e => {
    let list = e.target;
    if (list.scrollTop === 0 && !this.temState.loading) {
      this.temState.loading = true;
      const { chats, chatroom } = this.props;
      getChats(chatroom, chats.length);
    }
  };

  render() {
    const { chats } = this.props;
    if (chats.length === 0) {
      return (
        <div className="extendable list chats">
          <div className="flexBox column maxParent center-v secondary padding">
            "Let's start chat."
          </div>
        </div>
      );
    }

    return (
      <div
        className="extendable list chats"
        ref="chats"
        onScroll={this.onScroll}
      >
        {chats.map((chat, i) => (
          <Message key={i} chat={chat} />
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const chatroom = state.chatReducer.chatroom;
  const groups = state.chatReducer.groups;
  const group = groups.find(g => g.id === chatroom);
  return {
    chats: group ? group.chats : [],
    chatroom: state.chatReducer.chatroom
  };
};

export default connect(mapStateToProps)(ChatHistory);
