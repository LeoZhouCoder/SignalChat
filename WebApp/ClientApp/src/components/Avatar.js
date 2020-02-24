import React from "react";

export default function Avatar({ src, style, selected, onClick }) {
  return (
    <div style={{ width: "4em", ...style }} onClick={onClick}>
      <div className={`avatar ${selected ? "selected" : ""}`}>
        <div className="square center-v">
          <img alt={src} src={src} />
        </div>
      </div>
    </div>
  );
}
