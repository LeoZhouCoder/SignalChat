import React from "react";

export function Avatar({ src, small }) {
  return (
    <div className={"imgBox " + (small ? "imgBoxSmall" : "imgBoxNormal")}>
      <div className="imgBoxContent">
        <img alt="" src={src} />
      </div>
    </div>
  );
}
