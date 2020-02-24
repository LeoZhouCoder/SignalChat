import React from "react";

export default function Popup({ children, width, onClose }) {
  return (
    <div className="flexBox maxParent center-v popup" onClick={() => onClose()}>
      <div
        className="popupContent"
        style={{ width: width }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flexBox column list center maxWidth">{children}</div>
      </div>
    </div>
  );
}