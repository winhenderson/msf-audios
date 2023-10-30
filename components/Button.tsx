import React from "react";
import cx from "classnames";

type CommonProps = {
  className?: string;
  small?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
};

type Props =
  | ({
      type: "button";
      buttonType: "submit" | "button";
      onClick(): void;
    } & CommonProps)
  | ({ type: "external"; href: string } & CommonProps);

const Button: React.FC<Props> = ({
  className,
  small = false,
  disabled = false,
  ...props
}) => {
  const classes = cx(
    `text-opacity-95 flex items-center justify-center uppercase font-bold tracking-wide  transition-colors`,
    className,
    "shadow-sm shadow-gray-300",
    small
      ? "rounded-full w-10 h-10 text-teal-900 bg-gray-50 hover:text-opacity-70"
      : "text-white rounded-lg w-full h-12 bg-gradient-to-br from-teal-700 to-teal-950 hover:from-teal-700 hover:to-teal-900 hover:text-opacity-80",
    disabled && !small && "opacity-30 cursor-progress",
    disabled && small && "cursor-progress"
  );

  if (props.type === "button") {
    return (
      <button
        className={classes}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          props.onClick();
        }}
        id={small ? "download file" : ""}
        type={props.buttonType}
        disabled={disabled}
      >
        {props.children}
      </button>
    );
  }
  return (
    <a href={props.href} className={classes}>
      {props.children}
    </a>
  );
};

export default Button;
