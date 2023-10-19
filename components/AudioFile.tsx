import Image from "next/image";
import React from "react";
import Button from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowDown } from "@fortawesome/free-solid-svg-icons";
import { download, getData } from "@/lib/utils";
import { UsefulInfo } from "@/lib/types";

const AudioFile: React.FC<{ usefulInfo: UsefulInfo }> = ({ usefulInfo }) => {
  return (
    <li
      className="flex py-4 px-2 hover:text-teal-600 text-teal-950 hover:bg-teal-50 hover:transition-colors"
      onClick={() => download(usefulInfo.fileName)}
    >
      <div className="w-12 h-12 min-w-max">
        <Image
          src="/msf-logo.png"
          height={48}
          width={48}
          alt="msf logo"
          className="flex-none rounded-full mr-2"
        />
      </div>

      <div className="min-w-0 flex-auto mr-2">
        <p className="text-md font-semibold leading-6">
          {usefulInfo.cleanName}
        </p>
        <p className="mt-1 text-xs leading-5 text-gray-500">
          {`${usefulInfo.month}/${usefulInfo.day}/20${usefulInfo.year}`}
        </p>
      </div>

      <div
        className={`text-gray-500 text-[10px] xs:grid grid-rows-2 hidden mr-2 place-content-center uppercase tracking-wide xs:mr-4`}
      >
        <span>Size:</span>
        <span>Length:</span>
      </div>

      <div className="text-gray-600 font-bold text-xs grid grid-rows-2 mr-4 text-right place-content-center">
        <span>{(usefulInfo.size / 1000000).toFixed(1)} MB</span>
        <span>{usefulInfo.durationString}</span>
      </div>

      <Button
        type="button"
        buttonType="button"
        onClick={() => download(usefulInfo.fileName)}
        small
      >
        <FontAwesomeIcon icon={faCloudArrowDown} />
      </Button>
    </li>
  );
};

export default AudioFile;
