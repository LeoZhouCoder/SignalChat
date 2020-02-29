import React from "react";
import Avatar from "./Avatar";
import { getUserProfile } from "../redux/chatActions";
import BasicList from "./BasicList";

export default function UserRowList({ users, style }) {
  users = users || [];
  return (
    <BasicList style={style} type="row">
      {users.map((uid, i) => {
        const user = getUserProfile(uid);
        return (
          <Avatar
            key={i}
            src={user ? user.profilePhoto : ""}
            style={{ margin: ".1em", width: "2em" }}
          />
        );
      })}
    </BasicList>
  );
}
