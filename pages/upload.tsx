import React from "react";
import FileDrop from "@/components/FileDrop";

const Upload: React.FC = () => {
  return (
    <div className="p-2 pt-4 flex flex-col items-center xs:px-4 sm:w-3/4 m-auto max-w-[1000px]">
      <h1 className="w-full text-5xl text-teal-950 text-center border-b-teal-500 border-b font-extrabold p-2 mb-2">
        Upload Teachings
      </h1>

      <FileDrop />
    </div>
  );
};

export default Upload;
