import React from "react";
import cx from "classnames";

type CommonProps = {
  className?: string;
  small?: boolean;
  children: React.ReactNode;
};

type Props =
  | ({ type: "button"; onClick(): void } & CommonProps)
  | ({ type: "external"; href: string } & CommonProps);

const Button: React.FC<Props> = ({ className, small = false, ...props }) => {
  const classes = cx(
    `text-opacity-95 flex items-center justify-center uppercase font-bold tracking-wide  transition-colors`,
    className,
    "shadow-sm shadow-gray-300",
    small
      ? "rounded-full w-10 h-10 text-teal-900 bg-gray-50 hover:text-opacity-70"
      : "text-white rounded-lg w-full h-12 bg-gradient-to-br from-teal-700 to-teal-950 hover:from-teal-700 hover:to-teal-900 hover:text-opacity-80"
  );

  if (props.type === "button") {
    return (
      <button
        className={classes}
        onClick={(e) => {
          e.preventDefault();
          props.onClick();
        }}
        id={small ? "download file" : ""}
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
