import React, { useState, DragEvent, useEffect } from "react";
import {
  faCloudArrowUp,
  faFileArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "@/components/Button";

const Upload: React.FC = () => {
  const today = new Date();
  const [file, setFile] = useState<File>();
  const [createdDate, setCreatedDate] = useState(
    today.toISOString().slice(0, 10)
  );
  const [seconds, setSeconds] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [title, setTitle] = useState("");

  return (
    <div className="p-2 pt-4 flex flex-col items-center xs:px-4 sm:w-3/4 m-auto max-w-[1000px]">
      <h1 className="w-full text-5xl text-teal-950 text-center border-b-teal-500 border-b font-extrabold p-2 mb-2">
        Upload Teaching
      </h1>

      <form
        onSubmit={(e) => e.preventDefault()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="mt-8"
      >
        <div className="flex flex-col gap-4">
          <label
            htmlFor="dropzone-file"
            className={`flex flex-col items-center justify-center px-8 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-teal-50 bg-opacity-40  text-teal-950 ${
              file ? "bg-teal-100 p-4" : "bg-teal-50 py-10"
            }`}
          >
            <div className="flex flex-col items-center justify-center pt-5">
              {!file && (
                <>
                  <FontAwesomeIcon
                    icon={faCloudArrowUp}
                    className="w-16 h-16"
                  />
                  <div className="mb-2 text-sm opacity-70">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
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
              className="opacity-0"
              onChange={handleFileChange}
              required
            />
          </label>

          <section className={`${!file && "hidden"} flex flex-col gap-4`}>
            <div
              className={`${
                file === undefined && "hidden"
              } flex flex-col text-teal-950 gap-2`}
            >
              <label
                htmlFor="title"
                className="text-xs uppercase font-semibold text-teal-800"
              >
                Title:
              </label>
              <input
                type="text"
                id="title"
                className="bg-gradient-to-br from-teal-700/25 to-teal-950/25 bg-opacity-30 rounded-lg p-4 focus:outline-none focus:ring-teal-300 focus:ring-2 focus:ring-offset-2"
                value={title}
                onChange={(e) => {
                  e.preventDefault();
                  setTitle(e.target.value);
                }}
                required
              />
            </div>

            <div
              className={`${
                file === undefined && "hidden"
              } flex flex-col text-teal-950 gap-2`}
            >
              <label
                htmlFor="created-date"
                className="text-xs uppercase font-semibold text-teal-800"
              >
                Date of Teaching:
              </label>
              <input
                type="date"
                id="created-date"
                className="bg-gradient-to-br from-teal-700/25 to-teal-950/25 bg-opacity-30 rounded-lg p-4 focus:outline-none focus:ring-teal-300 focus:ring-2 focus:ring-offset-2"
                value={createdDate}
                onChange={(e) => {
                  e.preventDefault();
                  setCreatedDate(e.target.value);
                }}
                required
              />
            </div>

            <div
              className={`${
                file === undefined && "hidden"
              } flex flex-col text-teal-950 gap-2`}
            >
              <label
                className="text-xs uppercase font-semibold text-teal-800"
                htmlFor="length-in-seconds"
              >
                Length in Seconds:
              </label>
              <input
                type="number"
                id="length-in-seconds"
                value={seconds}
                onChange={(e) => {
                  e.preventDefault();
                  setSeconds(e.target.value);
                }}
                className="bg-gradient-to-br from-teal-700/25 to-teal-950/25 bg-opacity-30 rounded-lg p-4 focus:outline-none focus:ring-teal-300 focus:ring-2 focus:ring-offset-2"
                required
              />
            </div>

            <div
              className={`${
                file === undefined && "hidden"
              } flex flex-col text-teal-950 gap-2`}
            >
              <label
                className="text-xs uppercase font-semibold text-teal-800"
                htmlFor="speaker"
              >
                Speaker:
              </label>
              <input
                type="text"
                id="speaker"
                value={speaker}
                onChange={(e) => {
                  e.preventDefault();
                  setSpeaker(e.target.value);
                }}
                className="bg-gradient-to-br from-teal-700/25 to-teal-950/25 bg-opacity-30 rounded-lg p-4 focus:outline-none focus:ring-teal-300 focus:ring-2 focus:ring-offset-2"
                required
              />
            </div>

            <Button
              type="button"
              buttonType="submit"
              onClick={async () => {
                if (!file || !speaker || !title || !seconds) {
                  return;
                }

                const date = new Date(createdDate);
                let namedFile = new File(
                  [file],
                  `${date.getFullYear() - 2000}${(date.getMonth() + 1)
                    .toString()
                    .padStart(2, "0")}${date
                    .getDate()
                    .toString()
                    .padStart(2, "0")}_${title.split(" ").join("-")}_${speaker
                    .split(" ")
                    .join("-")}_${seconds}.mp3`
                );

                const res = await fetch("/api/upload", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    filename: namedFile.name,
                    length: namedFile.length,
                  }),
                });
                const json = await res.json();

                fetch(json.url, {
                  method: "PUT",
                  body: namedFile,
                  headers: {
                    "Content-Type": "audio/mpeg",
                    "x-amz-acl": "public-read",
                  },
                });

                clearState();
              }}
              className="mt-4"
            >
              Upload File
              <FontAwesomeIcon icon={faFileArrowUp} className="ml-2" />
            </Button>
          </section>
        </div>
      </form>
    </div>
  );

  function clearState() {
    setCreatedDate(new Date().toISOString().slice(0, 10));
    setFile(undefined);
    setSeconds("");
    setSpeaker("");
    setTitle("");
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
  }

  function handleDragLeave(event: DragEvent) {
    event.preventDefault();
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();

    // Fetch the files
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFile(droppedFiles[0]);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  }
};

export default Upload;
