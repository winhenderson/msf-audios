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
      onClick={() => download(usefulInfo.fileName, usefulInfo.cleanName)}
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

      <div className="flex justify-between grow">
        <div className="flex flex-col w-2/5 xs:w-auto">
          <p className="text-lg font-bold">{usefulInfo.cleanName}</p>

          {usefulInfo.extraInfo && (
            <p className="text-teal-900 text-xs font-medium text-opacity-60 leading-3">
              {usefulInfo.extraInfo}
            </p>
          )}

          <p className="mt-1 text-xs leading-5 text-gray-500">
            {`${usefulInfo.month}/${usefulInfo.day}/20${usefulInfo.year}`}
          </p>
        </div>

        <div className="text-teal-950 text-opacity-60 font-bold text-xs flex flex-col text-right place-content-center gap-1 mr-2 xs:mr-4">
          <p>{(usefulInfo.size / 1000000).toFixed(1)} MB</p>
          <p>{usefulInfo.durationString}</p>
          <p>{usefulInfo.speaker}</p>
        </div>
      </div>

      <Button
        type="button"
        buttonType="button"
        onClick={() => download(usefulInfo.fileName, usefulInfo.cleanName)}
        small
      >
        <FontAwesomeIcon icon={faCloudArrowDown} />
      </Button>
    </li>
  );
};

export default AudioFile;
