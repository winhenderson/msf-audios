import React, { HTMLInputTypeAttribute, ReactNode } from "react";

type Props = {
  type: HTMLInputTypeAttribute;
  value: string;
  setValue(newValue: string): void;
  required?: boolean;
  children: ReactNode;
};

const Input: React.FC<Props> = ({
  type,
  value,
  setValue,
  required = false,
  children,
}) => {
  const id = crypto.randomUUID();
  return (
    <div className="flex flex-col text-teal-950 gap-2">
      <label
        htmlFor={id}
        className="text-xs uppercase font-semibold text-teal-800"
      >
        {children}:
      </label>
      <input
        type={type}
        id={id}
        className="bg-gradient-to-br from-teal-700/25 to-teal-950/25 bg-opacity-30 rounded-lg p-4 focus:outline-none focus:ring-teal-300 focus:ring-2 focus:ring-offset-2"
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
