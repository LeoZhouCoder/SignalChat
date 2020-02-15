import React from "react";
import { Icon } from "semantic-ui-react";

export const TopBar = ({ name, icon, actionHandler }) => {
  return (
    <div className="topBar">
      <div className="title single">{name}</div>
      <Icon name={icon} color="grey" size="large" onClick={() => actionHandler()} />
    </div>
  );
};
