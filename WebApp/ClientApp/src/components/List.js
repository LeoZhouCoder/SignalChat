import React from "react";
import { Avatar } from "./Avatar";

export function List({
  component: Component,
  list,
  onClickItem,
  selectedItem,
  collapsed
}) {
  return (
    <div className="list column center">
      {list.map((data, i) => {
        return (
          <Component
            key={i}
            onClickItem={onClickItem}
            data={data}
            selected={selectedItem && data.id === selectedItem.id}
            collapsed={collapsed}
          />
        );
      })}
    </div>
  );
}

export function ContactContent({ data, selected, collapsed, onClickItem }) {
  const { name } = data;
  return (
    <ListItem
      data={data}
      selected={selected}
      collapsed={collapsed}
      onClickItem={onClickItem}
    >
      <div className="flexBox row extendable center space">
        <div className="subtitle single text_center unselect">{name}</div>
      </div>
    </ListItem>
  );
}

export function ChatContent({ data, selected, collapsed, onClickItem }) {
  const { name, time, msg } = data;
  return (
    <ListItem
      data={data}
      selected={selected}
      collapsed={collapsed}
      onClickItem={onClickItem}
    >
      <div className="flexBox row extendable center space">
        <div className="subtitle single extendable unselect">{name}</div>
        <div className="secondary unselect">{time}</div>
        <div className="single maxWidth secondary unselect">{msg}</div>
      </div>
    </ListItem>
  );
}

function ListItem({ data, selected, collapsed, children, onClickItem }) {
  const { img } = data;
  let content = collapsed ? null : children;
  return (
    <div
      className={`flexBox maxWidth padding pointer center-v divider ${
        selected ? "selected" : ""
      }`}
      onClick={() => onClickItem(data)}
    >
      <div className="flexBox column center-v">
        <Avatar src={img} />
      </div>
      {content}
    </div>
  );
}
