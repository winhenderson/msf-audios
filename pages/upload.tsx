import React, { useState, DragEvent } from "react";
import {
  faCloudArrowUp,
  faFileArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "@/components/Button";
import { upload } from "@/lib/utils";

const Upload: React.FC = () => {
  const today = new Date();
  const [file, setFile] = useState<File>();
  const [createdDate, setCreatedDate] = useState(
    today.toISOString().slice(0, 10)
  );
  const [seconds, setSeconds] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [title, setTitle] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  return (
    <div className="p-2 pt-4 flex flex-col items-center xs:px-4 sm:w-3/4 m-auto max-w-[1000px]">
      <h1 className="w-full text-5xl text-teal-950 text-center border-b-teal-500 border-b font-extrabold p-2 mb-2">
        Upload Teaching
      </h1>

      <form
        onSubmit={(e) => e.preventDefault()}
        onDragOver={handledragover}
        onDragLeave={handledragleave}
        onDrop={handledrop}
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
              onChange={handlefilechange}
              required
            />
          </label>

          <section className={`${!file && "hidden"} flex flex-col gap-4`}>
            <div className="flex flex-col text-teal-950 gap-2">
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

            <div className="flex flex-col text-teal-950 gap-2">
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

            <div className="flex flex-col text-teal-950 gap-2">
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

            <div className="flex flex-col text-teal-950 gap-2">
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

            <div className="flex flex-col text-teal-950 gap-2">
              <label
                className="text-xs uppercase font-semibold text-teal-800"
                htmlFor="additional"
              >
                Additional Information:
              </label>
              <input
                type="text"
                id="additional"
                value={additionalInfo}
                onChange={(e) => {
                  e.preventDefault();
                  setAdditionalInfo(e.target.value);
                }}
                className="bg-gradient-to-br from-teal-700/25 to-teal-950/25 bg-opacity-30 rounded-lg p-4 focus:outline-none focus:ring-teal-300 focus:ring-2 focus:ring-offset-2"
              />
            </div>

            <Button
              type="button"
              buttonType="submit"
              onClick={() => {
                upload(
                  file,
                  speaker,
                  title,
                  seconds,
                  createdDate,
                  additionalInfo
                );
                clearState();
              }}
              className="mt-4"
            >
              upload file
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
    setAdditionalInfo("");
  }

  function handledragover(event: DragEvent) {
    event.preventDefault();
  }

  function handledragleave(event: DragEvent) {
    event.preventDefault();
  }

  function handledrop(event: DragEvent) {
    event.preventDefault();

    // fetch the files
    const droppedfiles = Array.from(event.dataTransfer.files);
    setFile(droppedfiles[0]);
  }

  function handlefilechange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  }
};

export default Upload;
