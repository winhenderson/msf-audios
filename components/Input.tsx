import React, { HTMLInputTypeAttribute, ReactNode, useId } from "react";

type Props = {
  type: HTMLInputTypeAttribute;
  value: string;
  setValue(newValue: string): void;
  required?: boolean;
  children: ReactNode;
  className?: string;
};

const Input: React.FC<Props> = ({
  type,
  value,
  setValue,
  required = false,
  children,
  className,
}) => {
  const id = useId();

  return (
    <div className={`flex flex-col text-teal-950 gap-2 ${className}`}>
      <label
        htmlFor={id}
        className="text-xs uppercase font-semibold text-teal-800"
      >
        {children}:
      </label>
      <input
        autoFocus={children === "Title" && true}
        type={type}
        id={id}
        className="bg-gradient-to-br from-slate-200/25 to-teal-200/25 drop-shadow-sm bg-opacity-30 rounded-lg p-4 focus:outline-none focus:ring-teal-300 focus:ring-2 focus:ring-offset-2 border-[1px] border-teal-900/25"
        value={value}
        onChange={(e) => {
          e.preventDefault();
          setValue(e.target.value);
        }}
        required={required}
      />
    </div>
  );
};

export default Input;
