// actions
export const UPDATE_CHATROOM = "CHAT_UPDATE_CHATROOM";
export const UPDATE_ONLINE_USER = "UPDATE_ONLINE_USER";
export const UPDATE_GROUP = "UPDATE_GROUP";
export const UPDATE_GROUP_VIEW = "UPDATE_GROUP_VIEW";
export const DELETE_GROUP = "DELETE_GROUP";
export const UPDATE_USERS = "UPDATE_USERS";
export const ADD_CHAT = "ADD_CHAT";
export const ADD_CHATS = "ADD_CHATS";
export const SWITCH_CHATROOM = "SWITCH_CHATROOM";
// data nodes
export const GROUPS = "groups";
export const USERS = "users";
export const ONLINE_USERS = "onlineUsers";
export const CHATROOM = "chatroom";

export default function chatReducer(
  state = {
    [GROUPS]: [],
    [USERS]: [],
    [ONLINE_USERS]: [],
    [CHATROOM]: null
  },
  action
) {
  switch (action.type) {
    case UPDATE_CHATROOM:
      const { groups, users } = action.payload;
      return { ...state, [GROUPS]: groups, [USERS]: users };
    case UPDATE_ONLINE_USER:
      return { ...state, [ONLINE_USERS]: action.payload };
    case UPDATE_GROUP:
      return updateGroup(state, action.payload);
    case UPDATE_GROUP_VIEW:
      return updateGroupView(state, action.payload);
    case DELETE_GROUP:
      return deleteGroup(state, action.payload);
    case UPDATE_USERS:
      return updateUserProfile(state, action.payload);
    case ADD_CHAT:
      return addChat(state, action.payload);
    case ADD_CHATS:
      return addChats(state, action.payload);
    case SWITCH_CHATROOM:
      return { ...state, [CHATROOM]: action.payload };
    default:
      return state;
  }
}

const sortGroups = groups => {
  groups.sort((a, b) => {
    let aChat = a.chats ? a.chats[a.chats.length - 1] : null;
    let bChat = b.chats ? b.chats[b.chats.length - 1] : null;
    if (aChat == null && bChat == null) return 0;
    if (aChat == null) return -1;
    if (bChat == null) return 1;
    return aChat.createOn > bChat.createOn ? 1 : -1;
  });
  return groups;
};

const updateGroup = (state, newGroup) => {
  let newGroups = [newGroup];
  state[GROUPS].forEach(group => {
    if (group.id !== newGroup.id) {
      newGroups.push(group);
    }
  });
  return { ...state, [GROUPS]: sortGroups(newGroups), [CHATROOM]: newGroup.id };
};

const updateGroupView = (state, groupView) => {
  let newGroups = [];
  state[GROUPS].forEach(group => {
    if (group.id === groupView.id) {
      groupView.chats = group.chats;
      newGroups.push(groupView);
    } else {
      newGroups.push(group);
    }
  });
  return { ...state, [GROUPS]: newGroups };
};

const deleteGroup = (state, groupId) => {
  let newGroups = [];
  state[GROUPS].forEach(group => {
    if (group.id !== groupId) {
      newGroups.push(group);
    }
  });
  return { ...state, [GROUPS]: newGroups };
};

const updateUserProfile = (state, newUsers) => {
  if (!Array.isArray(newUsers)) return state;
  if (newUsers.length === 0) return state;
  state[USERS].forEach(user => {
    if (!newUsers.find(x => x.id === user.id)) {
      newUsers.push(user);
    }
  });
  return { ...state, [USERS]: newUsers };
};

const addChat = (state, newChat) => {
  let groups = state[GROUPS];
  let group = groups.find(g => g.id === newChat.gid);
  if (group) {
    if (!Array.isArray(group.chats)) group.chats = [];
    group.chats = [...group.chats, newChat];
  }
  const newGroups = [...groups];
  return { ...state, [GROUPS]: sortGroups(newGroups) };
};

const addChats = (state, { groupId, chats }) => {
  let groups = state[GROUPS];
  groups.forEach(group => {
    if (group.id === groupId) {
      if (!Array.isArray(group.chats)) group.chats = [];
      group.chats = [...chats, ...group.chats];
    }
  });
  return { ...state, [GROUPS]: groups };
};
