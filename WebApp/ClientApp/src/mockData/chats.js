export function getChatList() {
  let list = [];
  records.forEach(record => {
    let group = {};
    group.id = record.id;
    group.name = getName(record);
    group.img = getImage(record);

    if (record.chats && record.chats[0]) {
      group.time = record.chats[0].time;
      group.msg = record.chats[0].msg;
    } else {
      group.time = "";
      group.msg = "";
    }
    list.push(group);
  });
  return list;
}

function getName(record) {
  if (record.name) return record.name;
  let names = [];
  record.users.forEach(uid => {
    if (uid !== userId) names.push(users[uid].name);
  });
  return names.join(",");
}

function getImage(record) {
  let img = "";
  record.users.forEach(uid => {
    if (uid !== userId && !img) img = users[uid].img;
  });
  return img;
}

const userId = "uid0";

export const records = [
  {
    id: "r0",
    name: "",
    users: ["uid0", "uid1"],
    chats: [
      {
        uid: "uid1",
        time: "2010-10-12 16:25",
        msg: "Hi BI team, Here is the slide of the topic today."
      },
      {
        uid: "uid0",
        time: "2010-10-12 15:45",
        msg:
          "Hi all, the regional scrum is starting now, please join your meeting room respectively"
      }
    ]
  },
  {
    id: "r1",
    name: "",
    users: ["uid0", "uid2"],
    chats: [
      {
        uid: "uid2",
        time: "2010-10-12 13:14",
        msg: "Have a great day everyone!"
      }
    ]
  },
  {
    id: "r2",
    name: "",
    users: ["uid0", "uid3"],
    chats: [
      {
        uid: "uid3",
        time: "2010-10-12 11:24",
        msg:
          "I have seen the question of where to find the session recordings come up a number of times over the past few days."
      }
    ]
  },
  {
    id: "r3",
    name: "",
    users: ["uid0", "uid4"],
    chats: [
      {
        uid: "uid4",
        time: "2010-10-12 06:43",
        msg: "Hello World!"
      }
    ]
  },
  {
    id: "r4",
    name: "",
    users: ["uid0", "uid5"],
    chats: [
      {
        uid: "uid5",
        time: "2010-10-11 14:06",
        msg:
          "Please Slack me privately so I can invite you to join the channel."
      }
    ]
  },
  {
    id: "r5",
    name: "",
    users: ["uid0", "uid6"],
    chats: [
      {
        uid: "uid6",
        time: "2010-10-10 14:45",
        msg: "Hi everyone from the 10 Feb intake. Welcome onboard!"
      }
    ]
  },
  {
    id: "r6",
    name: "",
    users: ["uid0", "uid6"],
    chats: [
      {
        uid: "uid6",
        time: "2010-10-10 14:45",
        msg: "Hi everyone from the 10 Feb intake. Welcome onboard!"
      }
    ]
  },
  {
    id: "r7",
    name: "",
    users: ["uid0", "uid6"],
    chats: [
      {
        uid: "uid6",
        time: "2010-10-10 14:45",
        msg: "Hi everyone from the 10 Feb intake. Welcome onboard!"
      }
    ]
  },
  {
    id: "r8",
    name: "",
    users: ["uid0", "uid6"],
    chats: [
      {
        uid: "uid6",
        time: "2010-10-10 14:45",
        msg: "Hi everyone from the 10 Feb intake. Welcome onboard!"
      }
    ]
  },
  {
    id: "r9",
    name: "",
    users: ["uid0", "uid6"],
    chats: [
      {
        uid: "uid6",
        time: "2010-10-10 14:45",
        msg: "Hi everyone from the 10 Feb intake. Welcome onboard!"
      }
    ]
  },
  {
    id: "r10",
    name: "",
    users: ["uid0", "uid6"],
    chats: [
      {
        uid: "uid6",
        time: "2010-10-10 14:45",
        msg: "Hi everyone from the 10 Feb intake. Welcome onboard!"
      }
    ]
  }
];

export const users = {
  uid0: {
    name: "Daniel",
    img: "https://react.semantic-ui.com/images/avatar/small/daniel.jpg"
  },
  uid1: {
    name: "Stevie",
    img: "https://react.semantic-ui.com/images/avatar/small/stevie.jpg"
  },
  uid2: {
    name: "Elliot",
    img: "https://react.semantic-ui.com/images/avatar/small/elliot.jpg"
  },
  uid3: {
    name: "Matt",
    img: "https://react.semantic-ui.com/images/avatar/small/matt.jpg"
  },
  uid4: {
    name: "Christian",
    img: "https://react.semantic-ui.com/images/avatar/small/christian.jpg"
  },
  uid5: {
    name: "Tom",
    img: "https://react.semantic-ui.com/images/avatar/small/tom.jpg"
  },
  uid6: {
    name: "Jenny",
    img: "https://react.semantic-ui.com/images/avatar/small/jenny.jpg"
  }
};
