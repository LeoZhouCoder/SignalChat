import React from "react";
import { connect } from "react-redux";

import { TopBar } from "./TopBar";
import ChatHistory from "./ChatHistory";
import ChatList from "./ChatList";
import ContactList from "./ContactList";
import FooterMenu from "./FooterMenu";
import SendMessage from "./SendMessage";

import {
  SCREEN_SMALL,
  SCREEN_MEDIUM,
  SCREEN_NORMAL,
  SCREEN_BIG
} from "../utils/Dimensions";

import {
  getUserProfile,
  changeChatroom,
  createGroup
} from "../redux/chatActions";

import { SHOW_PROFILE } from "../redux/reducers/chat";

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
        this.props.showGroupProfile(this.props.chatroom);
        break;
      default:
        break;
    }
  };

  onClickFooterMenu = type => this.setState({ screen: type });

  onClickItem = data => {
    let screenType = this.getScreenType();
    const { chatroom, currentUser, groups } = this.props;
    if (screenType === SCREEN_CHATS) {
      if (chatroom !== data.id) {
        changeChatroom(data.id);
      }
      this.setState({ backScreen: SCREEN_CHATS, screen: SCREEN_DIALOG });
    } else if (screenType === SCREEN_ONLINE_USERS) {
      let group = groups.find(group => {
        let { users } = group;
        if (users.length > 2) return false;
        if (users.length === 1)
          return users[0] === data && data === currentUser;
        return users.includes(data) && users.includes(currentUser);
      });

      if (group) {
        if (chatroom !== group.id) {
          changeChatroom(group.id);
        }
        this.setState({
          backScreen: SCREEN_ONLINE_USERS,
          screen: SCREEN_DIALOG
        });
      } else {
        if (currentUser === data) {
          createGroup(null, [data]);
        } else {
          createGroup(null, [currentUser, data]);
        }
        this.setState({
          backScreen: SCREEN_ONLINE_USERS,
          screen: SCREEN_DIALOG
        });
      }
    }
  };

  getScreenType = () => {
    const { screenSize } = this.props;
    let screenType;
    if (screenSize === SCREEN_NORMAL || screenSize === SCREEN_BIG) {
      screenType = SCREEN_DIALOG;
    } else {
      screenType = this.state.screen;
    }
    return screenType;
  };

  render() {
    const { screenSize } = this.props;
    let screenType = this.getScreenType();
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
      ListComponent = ChatList;
    } else if (screenType === SCREEN_ONLINE_USERS) {
      name = "Online Users";
      isBack = false;
      ListComponent = ChatHistory;
      footer = (
        <FooterMenu
          activeItem={screenType}
          handleItemClick={this.onClickFooterMenu}
        />
      );
      ListComponent = ContactList;
    } else {
      const { group, currentUser } = this.props;
      if (group) {
        let { users } = group;
        if (users.length > 2) {
          name = group ? group.name : "";
          icon = "user plus";
        } else {
          var profile;
          if (users.length === 1) {
            profile = getUserProfile(users[0]);
          } else {
            profile = getUserProfile(users.find(u => u !== currentUser));
          }
          name = profile ? profile.name : "";
          icon = "user plus";
        }
      } else {
        name = "";
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
        <ListComponent onClickItem={this.onClickItem} />
        {footer}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const group = state.chatReducer.groups.find(
    g => g.id === state.chatReducer.chatroom
  );

  return {
    screenSize: state.dimensionReducer,
    group: group,
    currentUser: state.authReducer.user.id,
    chatroom: state.chatReducer.chatroom,
    groups: state.chatReducer.groups
  };
};

const mapDispatchToProps = dispatch => ({
  showGroupProfile: gid =>
    dispatch({
      type: SHOW_PROFILE,
      payload: { type: 0, id: gid }
    })
});

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);
