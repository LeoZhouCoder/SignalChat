import React from "react";
import { connect } from "react-redux";
import SelectableUser from "./SelectableUser";

import { getUserProfile } from "../redux/chatActions";

function SelectUserList({
  selectedUsers,
  searchKey,
  onClickItem,
  allUsers,
  currentUser
}) {
  return (
    <div
      style={{
        width: "100%",
        overflow: "hidden",
        padding: "0 1em 1em 1em",
        minHeight: "10em"
      }}
    >
      <div
        style={{
          display: "flex",
          flexFlow: "column",
          overflowY: "scroll",
          height: "100%"
        }}
      >
        <div style={{ display: "flex", width: "100%", flexFlow: "column" }}>
          {allUsers.map((uid, i) => {
            const user = getUserProfile(uid);
            const re = new RegExp(searchKey, "i");
            const isMatch = user ? re.test(user.name) : false;
            if (!isMatch) return null;
            const selected = selectedUsers.includes(uid) || currentUser === uid;
            const unselectable =
              (selected && selectedUsers.length <= 3) || currentUser === uid;
            return (
              <SelectableUser
                key={i}
                user={user}
                selected={selected}
                unselectable={unselectable}
                onClickItem={() => {
                  if (onClickItem) onClickItem(uid);
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    allUsers: state.chatReducer.allUsers,
    users: state.chatReducer.users
  };
};

export default connect(mapStateToProps)(SelectUserList);
