import React from "react";

const placements = {
  'top-left': { top: 0, left: 0 },
  'top-center': { top: 0, left: '50%', transform: 'translateX(-50%)' },
  'top-right': { top: 0, right: 0 },
  'bottom-left': { bottom: 0, left: 0 },
  'bottom-center': { bottom: 0, left: '50%', transform: 'translateX(-50%)' },
  'bottom-right': { bottom: 0, right: 0 },
};

export const ToastContainer = ({
  hasToasts,
  placement,
  ...props
}) => (
  <div
    className="react-toast-notifications__container"
    css={{
      boxSizing: 'border-box',
      maxHeight: '100%',
      overflow: 'hidden',
      padding: gutter,
      pointerEvents: hasToasts ? null : 'none',
      position: 'fixed',
      zIndex: 1000,
      ...placements[placement],
    }}
    {...props}
  />
);