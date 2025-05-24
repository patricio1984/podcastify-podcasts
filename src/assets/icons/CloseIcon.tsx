import React from "react";
import { IconProps } from "../../types";

const CloseIcon: React.FC<IconProps> = ({
  className,
  onClick,
  "aria-label": ariaLabel,
  width = "20",
  height = "20",
}) => (
  <svg
    className={className}
    onClick={onClick}
    aria-label={ariaLabel}
    width={width}
    height={height}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18.9699 0L20.0007 1.0308L1.0308 19.9993L0 18.9692L18.9699 0Z"
      fill="white"
    />
    <path
      d="M1.0308 0L20.0007 18.9685L18.9699 20L0 1.03153L1.0308 0Z"
      fill="white"
    />
  </svg>
);

export default CloseIcon;
