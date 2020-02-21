import React from "react";
import { Avatar } from "./Avatar";

export function List({
  component: Component,
  list,
  onClickItem,
  selectedData,
  collapsed,
  placeHolder,
}) {
  if (list.length === 0) {
    return (
      <div className="list column center maxParent center-v">
        <div className="flexBox column maxParent center-v secondary padding">{placeHolder}</div>
      </div>
    );
  }
  console.log("[List] render");
  return (
    <div className="list column center">
      {list.map((data, i) => {
        return (
          <Component
            key={i}
            onClickItem={onClickItem}
            data={data}
            selected={selectedData === data}
            collapsed={collapsed}
          />
        );
      })}
    </div>
  );
}

export function ListItem({
  data,
  img,
  selected,
  collapsed,
  children,
  onClickItem,
  icon
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
        <Avatar src={img} icon={icon} />
      </div>
      {content}
    </div>
  );
}
