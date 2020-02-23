export const getUserProfile = uid => {
  let targetUser;
  chatUsers.forEach(user => {
    if (user.uid === uid) targetUser = user;
  });
  return targetUser;
};

export const getChatsByGroupId = (gid, position = 0, limit = 5) => {
  let groupChats = [];
  chats.forEach(chat => {
    if (chat.gid === gid) {
      groupChats.push(chat);
    }
  });
  groupChats = groupChats.sort((a, b) => {
    return a.time > b.time ? -1 : 1;
  });
  return groupChats.slice(position, position + limit);
};

export const getRecentGroupChat = uid => {
  var groups = [];
  groupUsers.forEach(x => {
    if (x.uid === uid) {
      let groupView = {};
      let gid = x.gid;
      let group = getGroupById(gid);
      groupView.id = gid;
      groupView.name = group.name;
      groupView.users = getUsersByGid(gid);
      let lastChat = getChatsByGroupId(gid, 0, 1);
      groupView.lastChat = lastChat ? lastChat[0] : null;
      groups.push(groupView);
    }
  });
  return groups;
};

const getUsersByGid = gid => {
  let users = [];
  groupUsers.forEach(x => {
    if (x.gid === gid) users.push(x.uid);
  });
  return users;
};

const getGroupById = gid => {
  let group;
  groups.forEach(x => {
    if (x.id === gid) group = x;
  });
  return group;
};

// server mockData
export const groups = [
  { id: "g0", name: "" },
  { id: "g1", name: "Team-V" },
  { id: "g2", name: "" },
  { id: "g3", name: "" },
  { id: "g4", name: "" },
  { id: "g5", name: "" }
];

export const groupUsers = [
  { gid: "g0", uid: "u0" },
  { gid: "g0", uid: "u1" },
  { gid: "g1", uid: "u0" },
  { gid: "g1", uid: "u2" },
  { gid: "g1", uid: "u1" },
  { gid: "g2", uid: "u0" },
  { gid: "g2", uid: "u2" },
  { gid: "g3", uid: "u0" },
  { gid: "g3", uid: "u3" },
  { gid: "g4", uid: "u0" },
  { gid: "g4", uid: "u4" },
  { gid: "g5", uid: "u0" },
  { gid: "g5", uid: "u5" }
];

export const chats = [
  {
    gid: "g5",
    uid: "u6",
    time: "2010-10-10 14:45",
    msg: "Hi everyone from the 10 Feb intake. Welcome onboard!"
  },
  {
    gid: "g4",
    uid: "u5",
    time: "2010-10-11 14:06",
    msg: "Please Slack me privately so I can invite you to join the channel."
  },
  {
    gid: "g1",
    uid: "u1",
    time: "2010-10-11 13:21",
    msg: "Please Slack me privately so I can invite you to join the channel."
  },
  {
    gid: "g3",
    uid: "u4",
    time: "2010-10-12 06:43",
    msg: "Hello World!"
  },
  {
    gid: "g2",
    uid: "u3",
    time: "2010-10-12 11:24",
    msg:
      "I have seen the question of where to find the session recordings come up a number of times over the past few days."
  },
  {
    gid: "g1",
    uid: "u2",
    time: "2010-10-12 13:14",
    msg: "Have a great day everyone!"
  },
  {
    gid: "g0",
    uid: "u0",
    time: "2010-10-12 15:45",
    msg:
      "Hi all, the regional scrum is starting now, please join your meeting room respectively"
  },
  {
    gid: "g0",
    uid: "u1",
    time: "2010-10-12 16:25",
    msg: "Hi BI team, Here is the slide of the topic today."
  },
  {
    gid: "g0",
    uid: "u1",
    time: "2010-10-12 13:45",
    msg: `Lorem ipsum dolor sit amet, nibh ipsum. Cum class sem inceptos
      incidunt sed sed. Tempus wisi enim id, arcu sed lectus aliquam,
      nulla vitae est bibendum molestie elit risus.Lorem ipsum dolor sit amet, nibh ipsum. Cum class sem inceptos
      incidunt sed sed. Tempus wisi enim id, arcu sed lectus aliquam,
      nulla vitae est bibendum molestie elit risus. Lorem ipsum dolor sit amet, nibh ipsum. Cum class sem inceptos
      incidunt sed sed. Tempus wisi enim id, arcu sed lectus aliquam,
      nulla vitae est bibendum molestie elit risus.`
  },
  {
    gid: "g0",
    uid: "u1",
    time: "2010-10-12 13:25",
    msg: "Chilltime is going to be an app for you to view videos with friends"
  },
  {
    gid: "g0",
    uid: "u0",
    time: "2010-10-12 10:59",
    msg: "You can sign-up now to try out our private beta!"
  },
  {
    gid: "g0",
    uid: "u0",
    time: "2010-10-12 08:05",
    msg: "sfs123r"
  },
  {
    gid: "g0",
    uid: "u1",
    time: "2010-10-12 10:05",
    msg: "Definitely! Sounds great!"
  },
  {
    gid: "g0",
    uid: "u0",
    time: "2010-10-12 08:00",
    msg: "ooooooooooo"
  }
];

export const chatUsers = [
  {
    id: "u0",
    name: "Daniel",
    profilePhoto: "https://react.semantic-ui.com/images/avatar/large/daniel.jpg"
  },
  {
    id: "u1",
    name: "Stevie",
    profilePhoto: "https://react.semantic-ui.com/images/avatar/large/stevie.jpg"
  },
  {
    id: "u2",
    name: "Elliot",
    profilePhoto: "https://react.semantic-ui.com/images/avatar/large/elliot.jpg"
  },
  {
    id: "u3",
    name: "Matt",
    profilePhoto: "https://react.semantic-ui.com/images/avatar/large/matt.jpg"
  },
  {
    id: "u4",
    name: "Christian",
    profilePhoto: "https://react.semantic-ui.com/images/avatar/large/christian.jpg"
  },
  {
    uid: "u5",
    name: "Tom",
    profilePhoto: "https://react.semantic-ui.com/images/avatar/large/tom.jpg"
  },
  {
    id: "u6",
    name: "Jenny",
    profilePhoto: "https://react.semantic-ui.com/images/avatar/large/jenny.jpg"
  }
];
