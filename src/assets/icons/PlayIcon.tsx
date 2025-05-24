import React from "react";
import { IconProps } from "../../types";

const PlayIcon: React.FC<IconProps> = ({
  className,
  onClick,
  "aria-label": ariaLabel,
  width = "24",
  height = "27",
}) => (
  <svg
    className={className}
    onClick={onClick}
    aria-label={ariaLabel}
    width={width}
    height={height}
    viewBox="0 0 24 27"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.5079 11.5055L4.46176 0.836722C2.99551 -0.0296981 0.75 0.811088 0.75 2.95407V24.2865C0.75 26.209 2.83659 27.3676 4.46176 26.4038L22.5079 15.7402C24.1177 14.7917 24.1228 12.4539 22.5079 11.5055Z"
      fill="currentColor"
    />
  </svg>
);

export default PlayIcon;
