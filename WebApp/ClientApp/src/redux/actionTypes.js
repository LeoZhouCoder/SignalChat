export const WINDOW_RESIZE = "WINDOW_RESIZE";

export const USER_LOGIN = "USER_LOGIN";
export const USER_LOGOUT = "USER_LOGOUT";

export const CHAT_RECORD_UPDATE = "CHAT_RECORD_UPDATE";
export const ONLINE_USER_UPDATE = "ONLINE_USER_UPDATE";
export const USER_PROFILE_UPDATE = "USER_PROFILE_UPDATE";
export const CHAT_ADD = "CHAT_ADD";

const updateRecentChatRecord = data => {
  console.log("[ChatHub] update recent chat record: ", data);
};

const updateOnlineUsers = data => {
  console.log("[ChatHub] update online users: ", data);
};

const updateUserProfile = data => {
  console.log("[ChatHub] update user profile: ", data);
};

const receiveMessage = data => {
  console.log("[ChatHub] receive message: ", data);
};

export const GROUP_CREATE = "GROUP_CREATE";
export const GROUP_CHANGE_NAME = "GROUP_CREATE";
export const GROUP_ADD_USER = "GROUP_CREATE";
export const GROUP_REMOVE_USER = "GROUP_CREATE";
