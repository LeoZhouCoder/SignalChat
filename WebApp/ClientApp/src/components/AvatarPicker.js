import React from "react";
import Avatar from "./Avatar";
import BasicList from "./BasicList";

export default function AvatarPicker({
  avatars,
  onClickItem,
  selectIndex = -1
}) {
  return (
    <BasicList style={{ maxHeight: "20em", padding: "1em" }} type="rowWrap">
      {avatars.map((avatar, i) => (
        <Avatar
          key={i}
          src={avatar}
          selected={i === selectIndex}
          style={{ padding: "0.1em", width: "4em", alignSelf: "center" }}
          onClick={() => {
            if (onClickItem) onClickItem(i);
          }}
        />
      ))}
    </BasicList>
  );
}
