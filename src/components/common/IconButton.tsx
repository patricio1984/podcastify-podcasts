import React from "react";
import clsx from "clsx";

interface IconButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  className?: string;
  ariaLabel: string;
  ariaPressed?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({
  onClick,
  children,
  className,
  ariaLabel,
  ariaPressed,
  type = "button",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx(
        "flex items-center justify-center transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-brand/50",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default IconButton;
