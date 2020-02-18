import {
  CHAT_RECORD_UPDATE,
  ONLINE_USER_UPDATE,
  USER_PROFILE_UPDATE,
  CHAT_ADD
} from "../actionTypes";

export const CHATS = "chats";
export const FRIENDS = "friends";
export const GROUPS = "groups";
export const USERS = "users";
export const ONLINE_USERS = "onlineUsers";
export const CHAT_HISTORY = "chatHistory";

const initialState = {
  [CHATS]: [],
  [FRIENDS]: [],
  [GROUPS]: [],
  [USERS]: [],
  [ONLINE_USERS]: []
};

export default function chatReducer(state = initialState, action) {
  switch (action.type) {
    case CHAT_RECORD_UPDATE:
      return {
        ...state,
        [CHATS]: action.payload[CHATS],
        [FRIENDS]: action.payload[FRIENDS],
        [GROUPS]: action.payload[GROUPS],
        [USERS]: action.payload[USERS]
      };
    case ONLINE_USER_UPDATE:
      return { ...state, [ONLINE_USERS]: action.payload };
    case USER_PROFILE_UPDATE:
      var oldUsers = state.users;
      var newUsers = action.payload;
      var users = [];
      oldUsers.forEach(user => {
        newUsers.forEach(newUser => {
          users.push(newUser);
          if (user.id !== newUser.id) users.push(user);
        });
      });
      return { ...state, [ONLINE_USERS]: users };
    case CHAT_ADD:
      return state;
    default:
      return state;
  }
}
