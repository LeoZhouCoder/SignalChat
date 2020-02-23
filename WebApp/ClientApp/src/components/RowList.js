import React from "react";

export function RowList({ children,style }) {
  return (
    <div
      style={{
        width: "100%",
        overflow: "hidden",
        padding: "1em",
        ...style
      }}
    >
      <div style={{ display: "flex", "overflowX": "scroll" }}>
        <div style={{ display: "flex" }}>{children}</div>
      </div>
    </div>
  );
}
