import React from "react";

export function Avatar({ src, style }) {
  return (
    <div style={{ width: "4em", ...style }}>
      <div className="avatar">
        <div className="square center-v">
          <img alt={src} src={src} />
        </div>
      </div>
    </div>
  );
}
