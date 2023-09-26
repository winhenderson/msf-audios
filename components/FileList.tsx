import { DateString } from "@/pages";
import React from "react";
import AudioFile from "./AudioFile";

type Props = {
  usefulInfo: Array<{
    fileName: string;
    lastModified: DateString;
    size: number;
  }>;
};

const FileList: React.FC<Props> = ({ usefulInfo }) => {
  return (
    <ul className="divide-y w-full divide-gray-200">
      {usefulInfo.map((info) => (
        <AudioFile
          fileName={info.fileName}
          key={crypto.randomUUID()}
          lastModified={info.lastModified}
          size={info.size}
        />
      ))}
    </ul>
  );
};

export default FileList;
