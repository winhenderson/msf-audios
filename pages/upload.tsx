import React, { useState, DragEvent, useEffect } from "react";
import {
  faCloudArrowUp,
  faFileArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "@/components/Button";
import { S3 } from "aws-sdk";

const Upload: React.FC = () => {
  const [dragIsOver, setDragIsOver] = useState(false);
  const [file, setFile] = useState<File>();
  const [upload, setUpload] = useState<S3.ManagedUpload | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    return upload?.abort();
  }, []);

  useEffect(() => {
    setProgress(0);
    setUpload(null);
  }, [file]);

  return (
    <div className="p-2 pt-4 flex flex-col items-center xs:px-4 sm:w-3/4 m-auto max-w-[1000px]">
      <h1 className="w-full text-5xl text-teal-950 text-center border-b-teal-500 border-b font-extrabold p-2 mb-2">
        Upload Teachings
      </h1>

      <form
        onSubmit={(e) => e.preventDefault()}
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
            {!file && (
              <>
                <FontAwesomeIcon icon={faCloudArrowUp} className="w-16 h-16" />
                <div className="mb-2 text-sm opacity-70">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </div>
              </>
            )}
            <div className="opacity-40 text-xs font-medium uppercase">
              {file?.name}
            </div>
          </div>
          <input
            id="dropzone-file"
            type="file"
            // multiple
            className="opacity-0"
            onChange={handleChange}
          />
        </label>
        <Button
          type="button"
          onClick={async () => {
            console.log(file);
            if (!file) {
              return;
            }
            const res = await fetch("/api/upload", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ filename: file.name }),
            });
            const json = await res.json();

            fetch(json.url, {
              method: "PUT",
              body: file,
              headers: {
                "Content-Type": "audio/mpeg",
                "x-amz-acl": "public-read",
              },
            });
            // console.log(json.url);
          }}
          className="mt-4"
        >
          Upload File
          <FontAwesomeIcon icon={faFileArrowUp} className="ml-2" />
        </Button>
      </form>
    </div>
  );

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    setDragIsOver(true);
  }

  function handleDragLeave(event: DragEvent) {
    event.preventDefault();
    setDragIsOver(false);
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    setDragIsOver(false);

    // Fetch the files
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFile(droppedFiles[0]);

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
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  }
};

export default Upload;
