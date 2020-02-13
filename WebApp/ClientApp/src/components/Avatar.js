import React from "react";

export function Avatar({ src, size="normal" }) {
  return (
    <div className={"avatar " + size}>
      <div className="square">
        <img alt="" src={src} />
      </div>
    </div>
  );
}
