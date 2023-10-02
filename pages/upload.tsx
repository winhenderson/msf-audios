import React, { useState, DragEvent } from "react";
import {
  faCloudArrowUp,
  faFileArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "@/components/Button";
import { upload } from "@/lib/utils";

const Upload: React.FC = () => {
  const [dragIsOver, setDragIsOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  // Define the event handlers
  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    setDragIsOver(true);
  };

  const handleDragLeave = (event: DragEvent) => {
    event.preventDefault();
    setDragIsOver(false);
  };

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    setDragIsOver(false);

    // Here we'll handle the dropped files
    // Fetch the files
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles(droppedFiles);
    console.log({ files });

    // Use FileReader to read file content
    droppedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        console.log(reader.result);
      };

      reader.onerror = () => {
        console.error("There was an issue reading the file.");
      };

      reader.readAsDataURL(file);
      return reader;
    });
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  }

  return (
    <div className="p-2 pt-4 flex flex-col items-center xs:px-4 sm:w-3/4 m-auto max-w-[1000px]">
      <h1 className="w-full text-5xl text-teal-950 text-center border-b-teal-500 border-b font-extrabold p-2 mb-2">
        Upload Teachings
      </h1>

      <form
        onSubmit={(e) => e.preventDefault}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="mt-8"
      >
        <label
          htmlFor="dropzone-file"
          className={`flex flex-col items-center justify-center p-8 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-teal-50 bg-opacity-40 hover:bg-opacity-90 text-teal-950 hover:text-opacity-80`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <FontAwesomeIcon icon={faCloudArrowUp} className="w-16 h-16" />
            <button className="mb-2 text-sm opacity-70 font-semibold">
              {files.length > 0 ? (
                "Add another file"
              ) : (
                <div>
                  <span className="font-semibold">"Click to upload"</span> or
                  drag and drop
                </div>
              )}
            </button>
            {files.length > 0 && (
              <div className="mt-4">
                {" "}
                {files.map((file) => {
                  return (
                    <div className="opacity-40 text-xs font-medium  uppercase ">
                      {file.name}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="opacity-0"
            onChange={handleChange}
          />
        </label>
        <Button type="button" onClick={() => upload()} className="mt-4">
          Upload {files.length === 1 ? "File" : "Files"}{" "}
          <FontAwesomeIcon icon={faFileArrowUp} className="ml-2" />
        </Button>
      </form>
    </div>
  );
};

export default Upload;
