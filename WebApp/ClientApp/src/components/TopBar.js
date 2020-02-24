import React from "react";
import { Icon } from "semantic-ui-react";

export const TopBar = ({ name, icon, onClickBtn, isBack = false }) => {
  return (
    <div className="flexBox maxWidth padding divider">
      {isBack && (
        <Icon
          name="angle left"
          size="large"
          onClick={() => onClickBtn("back")}
        />
      )}
      <div className="title single">{name}</div>
      {icon && (
        <Icon
          style={{ marginLeft: "auto" }}
          name={icon}
          color="grey"
          size="large"
          onClick={() => onClickBtn("action")}
        />
      )}
    </div>
  );
};
