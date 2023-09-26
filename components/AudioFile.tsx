import { DateString } from "@/pages";
import Image from "next/image";
import React from "react";
import Button from "./Button";

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
  // const nameLetters = name.split("");

  return (
    <li
      className="flex py-4 hover:text-teal-600 text-teal-950"
      onClick={() => download(fileName)}
    >
      <div className="flex min-w-0 gap-x-4">
        <Image
          src="/msf-logo.png"
          height={48}
          width={48}
          alt="msf logo"
          className=" flex-none rounded-full bg-gray-50 mr-2"
        />
      </div>
      <div className="min-w-0 flex-auto">
        <p className="text-md font-medium leading-6">{audioName}</p>
        <p className="mt-1 text-xs leading-5 text-gray-500">
          {`${createdDate.month}/${createdDate.day}/20${createdDate.year}`}
        </p>
      </div>
      {/* <div className="basis-1/4 mr-2 hidden sm:flex">
        <Button onClick={() => download(fileName)} />
      </div> */}
      {/* <button
        onClick={(e) => {
          e.preventDefault();
          download(path);
        }}
      >
        {path}
      </button>
      {/* <div className="text-gray-500 flex justify-around basis-1/3"> */}
      {/* <div>
        <span>{finalString}</span>
        <span>{(size / 1000000).toFixed(1)} MB</span>
      </div> */}
    </li>
  );
};

export default AudioFile;

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
