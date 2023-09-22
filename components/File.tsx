import { DateString } from "@/pages";
import React from "react";

type Props = {
  path: string;
  lastModified: DateString;
  size: number;
};

const File: React.FC<Props> = ({ path, lastModified, size }) => {
  const date = new Date(lastModified);
  const dateString = date.toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const timeString = date.toLocaleTimeString("en-us", {
    hour: "numeric",
    minute: "2-digit",
  });
  const finalString = `${dateString} ${timeString}`;

  return (
    <li className="flex  h-14 shadow-md mb-1 text-left px-4  justify-between items-center hover:bg-gray-100">
      <button
        onClick={(e) => {
          e.preventDefault();
          download(path);
        }}
      >
        {path}
      </button>
      <div className="text-gray-500 flex justify-around basis-1/3">
        <span>{finalString}</span>
        <span>{(size / 1000000).toFixed(1)} MB</span>
      </div>
    </li>
  );
};

export default File;

function download(path: string) {
  const url = `https://msf-audios.nyc3.digitaloceanspaces.com/${path}`;
  fetch(url).then(async (response) => {
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const contentDisposition = response.headers.get("content-disposition");
    let fileName = path;
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="(.+)"/) ?? [];
      if (fileNameMatch.length === 2) fileName = fileNameMatch[1];
    }
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  });
}
