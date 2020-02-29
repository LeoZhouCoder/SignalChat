import React from "react";
import { connect } from "react-redux";
import SelectableUser from "./SelectableUser";
import BasicList from "./BasicList";

import { getUserProfile } from "../redux/chatActions";

function SelectUserList({
  selectedUsers,
  searchKey,
  onClickItem,
  allUsers,
  currentUser
}) {
  return (
    <BasicList
      style={{
        padding: "0 1em 1em 1em",
        height:"20em",
      }}
    >
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
    </BasicList>
  );
}

const mapStateToProps = state => {
  return {
    allUsers: state.chatReducer.allUsers,
    users: state.chatReducer.users
  };
};

export default connect(mapStateToProps)(SelectUserList);
