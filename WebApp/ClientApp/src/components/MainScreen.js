import React from "react";
import { connect } from "react-redux";

import { TopBar } from "./TopBar";
import ChatHistory from "./ChatHistory";
import FooterMenu from "./FooterMenu";
import SendMessage from "./SendMessage";

import {
  SCREEN_SMALL,
  SCREEN_MEDIUM,
  SCREEN_NORMAL,
  SCREEN_BIG
} from "../utils/Dimensions";

import { getUserProfile } from "../redux/chatActions";

const SCREEN_DIALOG = "DIALOG";
export const SCREEN_CHATS = "CHATS";
export const SCREEN_ONLINE_USERS = "ONLINE_USERS";

class MainScreen extends React.Component {
  constructor(props) {
    super(props);
    const { screenType } = this.props;
    if (screenType === SCREEN_NORMAL || screenType === SCREEN_BIG) {
      this.state = {
        backScreen: SCREEN_CHATS,
        screen: SCREEN_DIALOG
      };
    } else {
      this.state = {
        backScreen: null,
        screen: SCREEN_CHATS
      };
    }
  }

  onClickTobBarBtn = type => {
    switch (type) {
      case "back":
        if (this.state.backScreen) {
          this.setState({ backScreen: null, screen: this.state.backScreen });
        }
        break;
      case "action":
        console.log("Click Tob Bar btn: ", type);
        break;
      default:
        break;
    }
  };

  onClickFooterMenu = type => this.setState({ screen: type });

  render() {
    const { screenSize } = this.props;
    let screenType;
    if (screenSize === SCREEN_NORMAL || screenSize === SCREEN_BIG) {
      screenType = SCREEN_DIALOG;
    } else {
      screenType = this.state.screen;
    }
    let name, icon, isBack, ListComponent, footer;
    if (screenType === SCREEN_CHATS) {
      name = "Chats";
      icon = "plus";
      isBack = false;
      ListComponent = ChatHistory;
      footer = (
        <FooterMenu
          activeItem={screenType}
          handleItemClick={this.onClickFooterMenu}
        />
      );
    } else if (screenType === SCREEN_ONLINE_USERS) {
      name = "Online Users";
      icon = "search";
      isBack = false;
      ListComponent = ChatHistory;
      footer = (
        <FooterMenu
          activeItem={screenType}
          handleItemClick={this.onClickFooterMenu}
        />
      );
    } else {
      const { chatroom, groups, user } = this.props;
      let group = groups.find(g => g.id === chatroom);
      if (group) {
        let { users } = group;
        if (users.length > 2) {
          name = group ? group.name : "";
          icon = "users";
        } else {
          var profile;
          if (users.length === 1) {
            profile = getUserProfile(users[0]);
          } else {
            profile = getUserProfile(users.find(u => u !== user.id));
          }
          name = profile ? profile.name : "";
          icon = "user";
        }
      } else {
        name = "";
        icon = "";
      }

      isBack = screenSize === SCREEN_SMALL || screenSize === SCREEN_MEDIUM;
      ListComponent = ChatHistory;
      footer = <SendMessage screenSize={screenSize} />;
    }

    return (
      <div className="flexBox extendable column">
        <TopBar
          name={name}
          icon={icon}
          onClickBtn={this.onClickTobBarBtn}
          isBack={isBack}
        />
        <ListComponent />
        {footer}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  screenSize: state.dimensionReducer.type,
  chatroom: state.chatReducer.chatroom,
  groups: state.chatReducer.groups,
  users: state.chatReducer.users,
  user: state.authReducer.user
});
export default connect(mapStateToProps)(MainScreen);
