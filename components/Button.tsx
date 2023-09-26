import React from "react";
import cx from "classnames";

type Props = {
  onClick(): void;
  children: React.ReactNode;
  className?: string;
  small?: boolean;
};

const Button: React.FC<Props> = ({
  onClick,
  children,
  className,
  small = false,
}) => {
  return (
    <button
      className={cx(
        `text-white text-opacity-95 flex items-center justify-center uppercase font-bold tracking-wide  transition-colors`,
        className,
        "shadow-sm shadow-gray-300",
        small
          ? "rounded-full w-10 h-10 text-teal-900 bg-gray-50 hover:text-opacity-70"
          : "rounded-lg w-full h-12 bg-gradient-to-br from-teal-700 to-teal-950 hover:from-teal-700 hover:to-teal-900 hover:text-opacity-80"
      )}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      {children}
    </button>
  );
};

export default Button;
