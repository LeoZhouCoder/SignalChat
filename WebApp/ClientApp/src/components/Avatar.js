import React from "react";
import { Icon } from "semantic-ui-react";

export function Avatar({ src, icon, size = "big" }) {
  let content;
  if (src) {
    content = <img alt="" src={src} />;
  } else {
    content = <Icon name={icon} size={size} color="grey" />;
  }
  return (
    <div className={"avatar " + size}>
      <div className="square center-v">{content}</div>
    </div>
  );
}
