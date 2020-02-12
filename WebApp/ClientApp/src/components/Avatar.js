import React from "react";

export function Avatar({ src }) {
  return (
    <div className="imgBox">
      <div className="imgBoxContent">
        <img alt="" src={src} />
      </div>
    </div>
  );
}
