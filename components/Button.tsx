import React from "react";

type Props = {
  onClick(): void;
  children: React.ReactNode;
  className?: string;
};

const Button: React.FC<Props> = ({ onClick, children, className }) => {
  return (
    <button
      className={`w-full h-12 bg-gradient-to-br text-gray-50 from-teal-700 to-teal-950 rounded-lg flex items-center justify-center uppercase font-bold ${className}`}
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
