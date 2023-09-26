import { DateString } from "@/pages";
import Image from "next/image";
import React from "react";
import Button from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowDown } from "@fortawesome/free-solid-svg-icons";

type Props = {
  fileName: string;
  lastModified: DateString;
  size: number;
};

const AudioFile: React.FC<Props> = ({ fileName, lastModified, size }) => {
  const shortenedFileName = fileName.replace(".mp3", "");
  const underscoredFileName = shortenedFileName
    .split("")
    .map((letter) => (letter === " " ? "_" : letter))
    .join("");
  const splitFileName = underscoredFileName.split("_");
  const createdDateDigits = splitFileName.splice(0, 1)[0].split("");
  const createdDate = {
    year: createdDateDigits.splice(0, 2).join(""),
    month: Number(createdDateDigits.splice(0, 2).join("")).toFixed(0),
    day: createdDateDigits.splice(0, 2).join(""),
  };
  const audioName = splitFileName.join(" ");

  // hacky, assumes that the bitrate won't ever change
  const totalSeconds = (size * 8) / 56000;
  const seconds = (totalSeconds % 60).toFixed(0);
  const minutes = Math.floor(totalSeconds / 60);

  return (
    <li
      className="flex py-4 px-2 hover:text-teal-600 text-teal-950 hover:bg-teal-50 hover:transition-colors"
      onClick={() => download(fileName)}
    >
      <div className="flex min-w-0 gap-x-4">
        <Image
          src="/msf-logo.png"
          height={48}
          width={48}
          alt="msf logo"
          className=" flex-none rounded-full mr-2"
        />
      </div>

      <div className="min-w-0 flex-auto">
        <p className="text-md font-semibold leading-6">{audioName}</p>
        <p className="mt-1 text-xs leading-5 text-gray-500">
          {`${createdDate.month}/${createdDate.day}/20${createdDate.year}`}
        </p>
      </div>

      <div className="text-gray-500 text-[10px] grid grid-rows-2 mr-4 place-content-center uppercase tracking-wide">
        <span>Size:</span>
        <span>Length:</span>
      </div>

      <div className="text-gray-600 font-bold text-xs grid grid-rows-2 mr-4 text-right place-content-center">
        <span>{(size / 1000000).toFixed(1)} MB</span>
        <span>{`${minutes}:${seconds}`}</span>
      </div>

      <Button onClick={() => download(fileName)} small>
        <FontAwesomeIcon icon={faCloudArrowDown} />
      </Button>
    </li>
  );
};

export default AudioFile;

function download(path: string) {
  const downloadUrl = `https://msf-audios.nyc3.digitaloceanspaces.com/${path}`;
  fetch(downloadUrl).then(async (response) => {
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
