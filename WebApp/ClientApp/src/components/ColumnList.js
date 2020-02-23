import React from "react";

export function ColumnList({ children }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        padding: "1em"
      }}
    >
      <div style={{ display: "flex", "overflow-x": "scroll" }}>
        <div style={{ display: "flex" }}>{children}</div>
      </div>
    </div>
  );
}
