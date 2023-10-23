import React, { useState, DragEvent } from "react";
import {
  faCloudArrowUp,
  faFileArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "@/components/Button";
import { upload } from "@/lib/utils";
import Input from "@/components/Input";

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
  const [uploading, setUploading] = useState(false);

  return (
    <div className="p-2 pt-4 flex flex-col items-center xs:px-4 sm:w-3/4 m-auto max-w-[1000px]">
      <h1 className="w-full text-5xl text-teal-950 text-center border-b-teal-500 border-b font-extrabold p-2 mb-2">
        Upload Teaching
      </h1>

      {uploading ? (
        <div className="text-teal-950 text-2xl text-bold p-4">Uploading...</div>
      ) : (
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
              <Input type="text" value={title} setValue={setTitle} required>
                Title
              </Input>

              <Input
                type="date"
                value={createdDate}
                setValue={setCreatedDate}
                required
              >
                Teaching Date
              </Input>

              <Input
                type="number"
                value={seconds}
                setValue={setSeconds}
                required
              >
                Length in Seconds
              </Input>

              <Input type="text" value={speaker} setValue={setSpeaker} required>
                Speaker
              </Input>

              <Input
                type="text"
                value={additionalInfo}
                setValue={setAdditionalInfo}
              >
                Additional Information
              </Input>

              <Button
                type="button"
                buttonType="submit"
                onClick={async () => {
                  setUploading(true);
                  await upload(
                    file,
                    speaker,
                    title,
                    seconds,
                    createdDate,
                    additionalInfo
                  );
                  setTimeout(() => {
                    window.location.href = "/";
                  }, 5000);
                }}
                className="mt-4"
              >
                upload file
                <FontAwesomeIcon icon={faFileArrowUp} className="ml-2" />
              </Button>
            </section>
          </div>
        </form>
      )}
    </div>
  );

  // function clearState() {
  //   setCreatedDate(new Date().toISOString().slice(0, 10));
  //   setFile(undefined);
  //   setSeconds("");
  //   setSpeaker("");
  //   setTitle("");
  //   setAdditionalInfo("");
  // }

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
