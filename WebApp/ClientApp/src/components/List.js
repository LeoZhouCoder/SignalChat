import React from "react";
import { AvatarMultiple } from "./Avatar";

export function List({
  component: Component,
  list,
  onClickItem,
  selectedData,
  collapsed,
  placeHolder
}) {
  if (!list || list.length === 0) {
    return (
      <div className="list column center maxParent center-v">
        <div className="flexBox column maxParent center-v secondary padding">
          {placeHolder}
        </div>
      </div>
    );
  }
  return (
    <div className="list column center extendable">
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
