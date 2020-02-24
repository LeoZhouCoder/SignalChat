import React from "react";

export function ColumnList({ className, style, children, onClick }) {
  return (
    <div
      className={className}
      style={{ display: "flex", width: "100%", overflow: "hidden", ...style }}
      onClick={e => {
        if (onClick) onClick(e);
      }}
    >
      <div style={{ display: "flex", overflowY: "scroll" }}>{children}</div>
    </div>
  );
}
