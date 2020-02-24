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

export function AvatarMultiple({ photos, style, selected, onClick }) {
  photos = photos || [];
  const len = photos.length;
  const width = len > 4 ? "30%" : len > 1 ? "45%" : "100%";
  const padding = len > 1 ? "2%" : "0";
  return (
    <div style={{ width: "4em", ...style }} onClick={onClick}>
      <div className={`avatar ${selected ? "selected" : ""}`}>
        <div
          style={{
            display: "flex",
            flexFlow: "row wrap",
            width: "100%",
            justifyContent: "center",
            alignContent: "center"
          }}
        >
          {photos.map((photo, i) => (
            <Avatar
              key={i}
              src={photo}
              style={{ width: width, padding: padding }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
