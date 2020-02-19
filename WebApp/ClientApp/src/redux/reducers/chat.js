import {
  CHAT_RECORD_UPDATE,
  ONLINE_USER_UPDATE,
  GROUP_UPDATE,
  GROUP_DELETE,
  FRIEND_ADD,
  FRIEND_DELETE,
  USER_PROFILE_UPDATE,
  CHAT_ADD,
  CHAT_GROUP_UPDATE,
  CHAT_USER_UPDATE,
  CHATROOM_OWNER_CHANGE
} from "../actionTypes";

export const CHATS = "chats";
export const FRIENDS = "friends";
export const GROUPS = "groups";
export const USERS = "users";
export const ONLINE_USERS = "onlineUsers";
export const CHAT_HISTORY = "chatHistory";

const initialState = {
  [FRIENDS]: [],
  [GROUPS]: [],
  [CHATS]: [],
  [USERS]: [],
  [ONLINE_USERS]: [],
  [CHAT_HISTORY]: {
    records: [],
    owner: {
      type: 0, // 0 user 1 group
      id: null // base on type: 0: UserId 1: GroupId
    }
  }
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
    case GROUP_UPDATE:
      return updateGroup(state, action.payload);
    case GROUP_DELETE:
      return deleteGroup(state, action.payload);
    case FRIEND_ADD:
      return addFriend(state, action.payload);
    case FRIEND_DELETE:
      return deleteFriend(state, action.payload);
    case USER_PROFILE_UPDATE:
      return updateUserProfile(state, action.payload);
    case CHAT_ADD:
      return addChat(state, action.payload);
    case CHAT_GROUP_UPDATE:
      return updateChatHistoryGroup(state, action.payload);
    case CHAT_USER_UPDATE:
      return updateChatHistoryUser(state, action.payload);
    case CHATROOM_OWNER_CHANGE:
      console.log("changeChatroomOwner");
      return changeChatroomOwner(state, action.payload);
    default:
      return state;
  }
}

const updateGroup = (state, payload) => {
  let newGroup = payload;
  let groups = state[GROUPS];
  let newGroups = [newGroup];
  groups.forEach(group => {
    if (group.id !== newGroup.id) {
      newGroups.push(group);
    }
  });
  return { ...state, [GROUPS]: newGroups };
};

const deleteGroup = (state, payload) => {
  let groupId = payload;
  let groups = state[GROUPS];
  let newGroups = [];
  let inGroups = false;
  groups.forEach(group => {
    if (group.id !== groupId) {
      newGroups.push(group);
    } else {
      inGroups = true;
    }
  });
  if (!inGroups) return state;
  return { ...state, [GROUPS]: newGroups };
};

const addFriend = (state, payload) => {
  let userId = payload;
  let friends = state[FRIENDS];
  if (friends.includes(userId)) {
    return state;
  } else {
    return { ...state, [FRIENDS]: [...friends, userId] };
  }
};

const deleteFriend = (state, payload) => {
  let userId = payload;
  let friends = state[FRIENDS];
  if (!friends.includes(userId)) {
    return state;
  } else {
    var newFriends = friends.filter(uid => uid !== userId);
    return { ...state, [FRIENDS]: newFriends };
  }
};

const updateUserProfile = (state, payload) => {
  let oldUsers = state[USERS];
  let newUsers = payload;
  let users = [];
  newUsers.forEach(newUser => {
    users.push(newUser);
  });
  oldUsers.forEach(user => {
    let existed = false;
    newUsers.forEach(newUser => {
      if (user.id === newUser.id) existed = true;
    });
    if (!existed) users.push(user);
  });
  return { ...state, [USERS]: users };
};

const addChat = (state, payload) => {
  let newChat = payload;
  // chats
  let oldChats = state[CHATS];
  let newChats = [newChat];
  oldChats.forEach(oldChat => {
    if (!isSameGroup(oldChat, newChat.sender, newChat.receiver)) {
      newChats.push(oldChat);
    }
  });
  // chatHistory
  let chatHistory = state[CHAT_HISTORY];
  let gid = null;
  let uid = null;
  if (chatHistory.owner.type === 0) {
    uid = chatHistory.owner.id;
  } else {
    gid = chatHistory.owner.id;
  }
  if (isSameGroup(newChat, gid, uid)) {
    let records = [newChat, ...chatHistory.records];
    let owner = { ...chatHistory.owner };
    let newChatHistory = { owner: owner, records: records };
    return { ...state, [CHATS]: newChats, [CHAT_HISTORY]: newChatHistory };
  } else {
    return { ...state, [CHATS]: newChats };
  }
};

const isSameGroup = (chat, gid, uid0, uid1 = null) => {
  if (chat.gid != null) {
    return chat.gid === gid;
  } else {
    let { sender, receiver } = chat;
    if (!uid1) {
      return sender === uid0 || receiver === uid0;
    }
    return (
      (sender === uid0 && receiver === uid1) ||
      (sender === uid1 && receiver === uid0)
    );
  }
};

const updateChatHistoryGroup = (state, payload) => {
  let { group, chats } = payload;
  let chatHistory = state[CHAT_HISTORY];
  let { owner, records } = chatHistory;
  if (owner.type !== 0 || owner.id !== group) return state;
  let newRecords = [...records, ...chats];
  chatHistory = { owner, records: newRecords };
  return { ...state, [CHAT_HISTORY]: chatHistory };
};

const updateChatHistoryUser = (state, payload) => {
  let { user, chats } = payload;
  let chatHistory = state[CHAT_HISTORY];
  let { owner, records } = chatHistory;
  if (owner.type !== 0 || owner.id !== user) return state;
  let newRecords = [...records, ...chats];
  chatHistory = { owner, records: newRecords };
  return { ...state, [CHAT_HISTORY]: chatHistory };
};

const changeChatroomOwner = (state, payload) => {
  let chatHistory = state[CHAT_HISTORY];
  let newChatHistory = { ...chatHistory, owner: payload, records:[] };
  return { ...state, [CHAT_HISTORY]: newChatHistory };
};
