import React from "react";
import { Icon } from "semantic-ui-react";
import Avatar from "./Avatar";

export default function SelectableUser({
  user,
  selected,
  unselectable,
  onClickItem
}) {
  const name = user ? user.name : "";
  const profilePhoto = user ? user.profilePhoto : "";
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
