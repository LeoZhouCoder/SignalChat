import React from "react";
import { Avatar } from "./Avatar";
import { ColumnList } from "./ColumnList";

export function AvatarPicker({ avatars, onClickItem, selectId = -1 }) {
  return (
    <ColumnList style={{ padding: "1em", maxHeight: "20em" }}>
      <div style={{ display: "flex", flexFlow: "row wrap" }}>
        {avatars.map((avatar, i) => (
          <Avatar
            key={i}
            src={avatar}
            selected={i === selectId}
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
