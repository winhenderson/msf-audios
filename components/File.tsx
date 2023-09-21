import axios from "axios";
import React from "react";

const File: React.FC<{ path: string }> = ({ path }) => {
  const url = `https://msf-audios.nyc3.digitaloceanspaces.com/${path}`;
  return (
    <li>
      <button
        onClick={(e) =>
          axios({
            url: url,
            method: "GET",
            responseType: "blob",
          }).then((response) => {
            const blob = new Blob([response.data], {
              type: response.data.type,
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            const contentDisposition = response.headers["content-disposition"];
            let fileName = path;
            if (contentDisposition) {
              const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
              if (fileNameMatch.length === 2) fileName = fileNameMatch[1];
            }
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
          })
        }
      >
        {path}
      </button>
    </li>
  );
};

export default File;
