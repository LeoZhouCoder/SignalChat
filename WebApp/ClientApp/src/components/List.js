import React from "react";
import { AvatarMultiple } from "./Avatar";

export function ListItem({
  data,
  photos,
  selected,
  collapsed,
  children,
  onClickItem
}) {
  let content = collapsed ? null : children;
  return (
    <div
      className={`flexBox maxWidth padding pointer center-v divider ${
        selected ? "selected" : ""
      }`}
      onClick={() => onClickItem(data)}
    >
      <div className="flexBox column center-v">
        <AvatarMultiple photos={photos} />
      </div>
      {content}
    </div>
  );
}
