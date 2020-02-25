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
export const SHOW_PROFILE = "SHOW_PROFILE";
export const ADD_MESSAGE = "ADD_MESSAGE";
export const DELETE_MESSAGE = "DELETE_MESSAGE";
// data nodes
export const GROUPS = "groups";
export const USERS = "users";
export const ONLINE_USERS = "onlineUsers";
export const ALL_USERS = "allUsers";
export const CHATROOM = "chatroom";
export const PROFILE = "profile";
export const MESSAGES = "messages";

export default function chatReducer(
  state = {
    [GROUPS]: [],
    [USERS]: [],
    [ONLINE_USERS]: [],
    [ALL_USERS]: [],
    [CHATROOM]: null,
    [PROFILE]: null,
    [MESSAGES]: []
  },
  action
) {
  switch (action.type) {
    case UPDATE_CHATROOM:
      console.log("[ChatReducer]:", action);
      const { groups, users } = action.payload;
      return { ...state, [GROUPS]: sortGroups(groups), [USERS]: users };
    case UPDATE_ONLINE_USER:
      console.log("[ChatReducer]:", action);
      return {
        ...state,
        [ONLINE_USERS]: action.payload[ONLINE_USERS],
        [ALL_USERS]: action.payload[ALL_USERS]
      };
    case UPDATE_GROUP:
      console.log("[ChatReducer]:", action);
      return updateGroup(state, action.payload);
    case UPDATE_GROUP_VIEW:
      console.log("[ChatReducer]:", action);
      return updateGroupView(state, action.payload);
    case DELETE_GROUP:
      console.log("[ChatReducer]:", action);
      return deleteGroup(state, action.payload);
    case UPDATE_USERS:
      console.log("[ChatReducer]:", action);
      return updateUserProfile(state, action.payload);
    case ADD_CHAT:
      console.log("[ChatReducer]:", action);
      return addChat(state, action.payload);
    case ADD_CHATS:
      console.log("[ChatReducer]:", action);
      return addChats(state, action.payload);
    case SWITCH_CHATROOM:
      console.log("[ChatReducer]:", action);
      return { ...state, [CHATROOM]: action.payload };
    case SHOW_PROFILE:
      console.log("[ChatReducer]:", action);
      return { ...state, [PROFILE]: action.payload };
    case ADD_MESSAGE:
      console.log("[ChatReducer]:", action);
      return { ...state, [MESSAGES]: [...state[MESSAGES], action.payload] };
    case DELETE_MESSAGE:
      console.log("[ChatReducer]:", action);
      let messages = state[MESSAGES];
      messages.shift();
      return { ...state, [MESSAGES]: messages };
    default:
      return state;
  }
}

const sortGroups = groups => {
  console.log("[Chat]: sort start", groups);
  groups = groups.sort((a, b) => {
    let aChat = a.chats ? a.chats[a.chats.length - 1] : null;
    let bChat = b.chats ? b.chats[b.chats.length - 1] : null;
    console.log("[Chat]:", aChat, bChat);
    if (aChat == null && bChat == null) return 0;
    if (aChat == null) return 1;
    if (bChat == null) return -1;
    let result = aChat.createOn > bChat.createOn ? -1 : 1;
    console.log("[Chat]: result", result);
    return result;
  });
  console.log("[Chat]: sorted", groups);
  return groups;
};

const updateGroup = (state, newGroup) => {
  if (!newGroup.chats) newGroup.chats = [];
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

const addChats = (state, data) => {
  let groups = state[GROUPS];
  const group = groups.find(g => g.id === data.group);
  if (group) group.chats = [...data.chats, ...group.chats];
  return { ...state, [GROUPS]: groups };
};
