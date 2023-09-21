import React from "react";

const File: React.FC<{ path: string }> = ({ path }) => {
  // console.log(path);
  return (
    <li>
      <a href={`/api/_download/${path}`}>{path}</a>
    </li>
  );
};

export default File;
