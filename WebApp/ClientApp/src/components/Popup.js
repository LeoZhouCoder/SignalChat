import React from "react";
import BasicList from "./BasicList";

export default function Popup({ children, width, onClose }) {
  return (
    <div className="flexBox maxParent center-v popup" onClick={() => onClose()}>
      <BasicList
        className="popup-content"
        style={{ width: width, height:"auto" }}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </BasicList>
    </div>
  );
}
