import React from "react";

const File: React.FC<{ path: string }> = ({ path }) => {
  return (
    <li>
      <a href={`https://msf-audios.nyc3.digitaloceanspaces.com/${path}`}>
        {path}
      </a>
    </li>
  );
};

export default File;
