import React from "react";
import { Icon } from "semantic-ui-react";
import { Avatar } from "./Avatar";
import { chatUsers } from "../mockData/chats";

export function SelectUserList({ selectedUsers, searchKey, onClickItem }) {
  return (
    <div
      style={{
        width: "100%",
        overflow: "hidden",
        padding: "0 1em 1em 1em",
        minHeight: "8em",
        height: "20em"
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
          {chatUsers.map((user, i) => {
            const re = new RegExp(searchKey, "i");
            const isMatch = re.test(user.name);
            if (!isMatch) return null;
            const selected = selectedUsers.includes(user.id);
            const unselectable = selected && selectedUsers.length < 3;
            if (selected) {
              console.log("[SelectUserList]:", unselectable, selectedUsers);
            }

            return (
              <SelectableUser
                key={i}
                user={user}
                selected={selected}
                unselectable={unselectable}
                onClickItem={() => onClickItem(user)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function SelectableUser({ user, selected, unselectable, onClickItem }) {
  const { name, profilePhoto } = user;
  return (
    <div
      className={`divider ${unselectable ? "" : "pointer"}`}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        paddingTop: ".5em",
        paddingBottom: ".5em"
      }}
      onClick={() => {
        if (!unselectable) onClickItem();
      }}
    >
      <Avatar
        src={profilePhoto}
        style={{ width: "3em", paddingRight: "1em" }}
      />
      <div className="single text_center extendable unselect">{name}</div>
      <Icon
        name={selected ? "check circle" : "circle outline"}
        size="large"
        color={selected && !unselectable ? "green" : "grey"}
      />
    </div>
  );
}
