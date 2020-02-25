import React, { Component } from "react";
import { connect } from "react-redux";
import { deleteMessage } from "../redux/chatActions";

class MessageBox extends Component {
  componentDidUpdate() {
    if (this.timeoutHandler) {
      clearTimeout(this.timeoutHandler);
      this.timeoutHandler = 0;
    }
    this.timeoutHandler = setTimeout(() => {
      clearTimeout(this.timeoutHandler);
      this.timeoutHandler = 0;
      deleteMessage();
    }, 5000);
  }
  render() {
    const { msg, style } = this.props;
    if (msg == null) return null;
    const { message, isError } = msg;
    return (
      <div style={style} className={`messageBox ${isError ? "error" : ""}`}>
        <div
          style={{
            flex: "1",
            color: "inherit",
            padding: ".5em",
            maxWidth: "100%",
            wordWrap: "break-word"
          }}
        >
          {message}
        </div>
        <div
          className="unselect pointer"
          style={{
            color: "inherit",
            padding: ".5em",
            fontSize: "150%",
            fontWeight: "bold"
          }}
          onClick={() => deleteMessage()}
        >
          X
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const messages = state.chatReducer.messages;
  const msg = messages && messages.length > 0 ? messages[0] : null;
  return { msg: msg };
};
export default connect(mapStateToProps)(MessageBox);
