import React from "react";
import { Icon } from "semantic-ui-react";

export function Avatar({ src, icon, width = "4em" }) {
  let content;
  if (src) {
    content = <img alt="" src={src} />;
  } else {
    content = <Icon name={icon} color="grey" />;
  }
  return (
    <div className="avatar" style={{ width: width }}>
      <div className="square center-v">{content}</div>
    </div>
  );
}
