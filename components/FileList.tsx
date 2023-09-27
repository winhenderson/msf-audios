import React from "react";
import AudioFile from "./AudioFile";
import { UsefulInfo } from "@/lib/types";

type Props = {
  usefulInfo: UsefulInfo;
};

const FileList: React.FC<Props> = ({ usefulInfo }) => {
  return (
    <ul className="divide-y w-full divide-gray-200">
      {usefulInfo.map((info) => (
        <AudioFile
          fileName={info.fileName}
          key={crypto.randomUUID()}
          size={info.size}
        />
      ))}
    </ul>
  );
};

export default FileList;
