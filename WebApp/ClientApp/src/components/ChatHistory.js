import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";

import Message from "./Message.js";
// import { getChats } from "../redux/chatActions";

class ChatHistory extends React.Component {
  componentDidMount() {
    this.scrollToBot();
  }

  componentDidUpdate() {
    this.scrollToBot();
  }

  scrollToBot = () => {
    let dom = ReactDOM.findDOMNode(this.refs.chats);
    if (!dom) return;
    dom.scrollTop = dom.scrollHeight;
  };

  handleScroll = e => {
    let list = e.target;
    console.log(list.scrollTop);
    if(list.scrollTop===0){
      // loadmore
    }
  };

  render() {
    const { user, chatroom, groups } = this.props;
    let group = groups.find(group => group.id === chatroom);
    const chats = group ? group.chats : [];
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
        onScroll={this.handleScroll}
      >
        {chats.map((chat, i) => (
          <Message key={i} chat={chat} self={chat.sender === user.id} />
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.authReducer.user,
  chatroom: state.chatReducer.chatroom,
  groups: state.chatReducer.groups
});
export default connect(mapStateToProps)(ChatHistory);
