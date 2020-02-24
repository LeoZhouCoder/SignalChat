import React from "react";
import Avatar from "./Avatar";
import ColumnList from "./ColumnList";

export default function AvatarPicker({ avatars, onClickItem, selectIndex = -1 }) {
  return (
    <ColumnList style={{ padding: "1em", maxHeight: "20em" }}>
      <div style={{ display: "flex", flexFlow: "row wrap" }}>
        {avatars.map((avatar, i) => (
          <Avatar
            key={i}
            src={avatar}
            selected={i === selectIndex}
            style={{ padding: "0.3em", width: "4em", alignSelf: "center" }}
            onClick={() => {
              if (onClickItem) onClickItem(i);
            }}
          />
        ))}
      </div>
    </ColumnList>
  );
}
