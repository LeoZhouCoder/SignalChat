import React from "react";

export function Popup({ children, width, onClose }) {
  return (
    <div className="flexBox maxParent center-v popup" onClick={() => onClose()}>
      <div
        className="flexBox popupContent user"
        style={{ width: width }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flexBox column list center maxWidth">
          <div className="scrollList">{children}</div>
        </div>
      </div>
    </div>
  );
}
