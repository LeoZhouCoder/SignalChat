import React from "react";

import Avatar from "./Avatar";
import { RowList } from "./RowList";
import { getUserProfile } from "../redux/chatActions";

export function UserRowList({ users, style }) {
  users = users || [];
  return (
    <RowList style={style}>
      {users.map((uid, i) => {
        let user = getUserProfile(uid);
        return (
          <Avatar
            key={i}
            src={user ? user.profilePhoto : ""}
            style={{ margin: ".1em", width: "2em" }}
          />
        );
      })}
    </RowList>
  );
}
