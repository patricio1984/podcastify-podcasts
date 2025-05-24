import React from "react";
import { IconProps } from "../../types";

const ChevronRightIcon: React.FC<IconProps> = ({
  className,
  onClick,
  "aria-label": ariaLabel,
  width = "11",
  height = "20",
}) => (
  <svg
    className={className}
    onClick={onClick}
    aria-label={ariaLabel}
    width={width}
    height={height}
    viewBox="0 0 11 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.22653 19.91C1.50452 19.91 1.78251 19.8016 1.99426 19.5859L10.6815 10.7371C11.1061 10.3047 11.1061 9.60561 10.6815 9.17313L1.99426 0.324363C1.56967 -0.108121 0.883382 -0.108121 0.458794 0.324363C0.0342045 0.756846 0.0342045 1.4559 0.458794 1.88838L8.37829 9.95514L0.458794 18.0219C0.0342045 18.4544 0.0342045 19.1534 0.458794 19.5859C0.670545 19.8016 0.948537 19.91 1.22653 19.91Z"
      fill="#AAAAAA"
    />
  </svg>
);

export default ChevronRightIcon;
