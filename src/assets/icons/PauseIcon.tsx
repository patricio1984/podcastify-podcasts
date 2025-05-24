import React from "react";
import { IconProps } from "../../types";

const PauseIcon: React.FC<IconProps> = ({
  className,
  onClick,
  "aria-label": ariaLabel,
  width = "13",
  height = "15",
}) => (
  <svg
    className={className}
    onClick={onClick}
    aria-label={ariaLabel}
    width={width}
    height={height}
    viewBox="0 0 13 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.14286 15C3.32143 15 4.28571 14.0357 4.28571 12.8571V2.14286C4.28571 0.964286 3.32143 0 2.14286 0C0.964286 0 0 0.964286 0 2.14286V12.8571C0 14.0357 0.964286 15 2.14286 15ZM8.57143 2.14286V12.8571C8.57143 14.0357 9.53571 15 10.7143 15C11.8929 15 12.8571 14.0357 12.8571 12.8571V2.14286C12.8571 0.964286 11.8929 0 10.7143 0C9.53571 0 8.57143 0.964286 8.57143 2.14286Z"
      fill="currentColor"
    />
  </svg>
);

export default PauseIcon;
