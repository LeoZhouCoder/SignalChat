import React from "react";
import { Menu, Icon, TextArea, Form, Segment } from "semantic-ui-react";

import { TopBar } from "./TopBar";
import ChatHistory from "./ChatHistory";

import { SCREEN_SMALL, SCREEN_MEDIUM } from "../utils/Dimensions";

import { getChatRecord } from "../mockData/chats";

class MainScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = getChatRecord("r0");
  }

  onkeypress = e => {
    console.log(e.key);
  };

  onClickTobBarBtn = type => {
    console.log("Click btn: ", type);
  };

  render() {
    const { name } = this.state;
    const { screenType } = this.props;
    return (
      <div className="flexBox extendable column">
        <TopBar
          name={name}
          icon="user"
          onClickBtn={this.onClickTobBarBtn}
          isBack={screenType === SCREEN_SMALL || screenType === SCREEN_MEDIUM}
        />

        <ChatHistory />

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

export default MainScreen;
