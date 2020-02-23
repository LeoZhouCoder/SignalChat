import React, { Component } from "react";
import { Avatar } from "./Avatar";
import { RowList } from "./RowList";

import { chatUsers } from "../mockData/chats";

export function EditMemberList({ selectedUsers, style }) {
  return (
    <RowList style={style}>
      {selectedUsers.map((user, i) => {
        const userProfile = chatUsers.find(u => u.id === user);
        console.log("[EditMemberList]:", user, userProfile);
        return (
          <Avatar
            key={i}
            src={userProfile ? userProfile.profilePhoto : ""}
            style={{ margin: ".1em", width: "2em" }}
          />
        );
      })}
    </RowList>
  );
}
