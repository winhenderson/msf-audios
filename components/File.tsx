import React from "react";

const File: React.FC<{ path: string }> = ({ path }) => {
  return (
    <li>
      <a>{path}</a>
    </li>
  );
};

export default File;
