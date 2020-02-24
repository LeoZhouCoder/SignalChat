import React from "react";

import { Avatar } from "./Avatar";
import { RowList } from "./RowList";
import { getUserProfile } from "../redux/chatActions";

export function EditMemberList({ selectedUsers, style }) {
  return (
    <RowList style={style}>
      {selectedUsers.map((uid, i) => {
        let profile = getUserProfile(uid);
        return (
          <Avatar
            key={i}
            src={profile ? profile.profilePhoto : ""}
            style={{ margin: ".1em", width: "2em" }}
          />
        );
      })}
    </RowList>
  );
}
