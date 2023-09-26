import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowDown } from "@fortawesome/free-solid-svg-icons";

type Props = {
  onClick(): void;
};

const Button: React.FC<Props> = ({ onClick }) => {
  return (
    <button
      className="w-32 h-12 bg-gradient-to-br from-gray-100 to-gray-300 rounded-lg flex items-center justify-center border border-gray-300"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      <FontAwesomeIcon icon={faCloudArrowDown} />
    </button>
  );
};

export default Button;
