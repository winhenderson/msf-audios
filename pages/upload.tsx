import React, { useState, DragEvent } from "react";
import {
  faCloudArrowUp,
  faFileArrowUp,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "@/components/Button";
import { upload } from "@/lib/utils";
import Input from "@/components/Input";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import cx from "classnames";

const Upload: React.FC = () => {
  const today = new Date();
  const [file, setFile] = useState<File>();
  const [createdDate, setCreatedDate] = useState(
    today.toISOString().slice(0, 10)
  );
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [title, setTitle] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const { data: session } = useSession();

  const authenticatedEmails = [
    "winhenderson@gmail.com",
    "henderjay@gmail.com",
    "jared@netrivet.com",
  ];
  if (!authenticatedEmails.includes(session?.user?.email ?? "")) {
    return (
      <div className="bg-teal-50 w-screen h-screen">
        <div className="rounded-lg shadow-lg shadow-teal-800/25 absolute left-1/2 top-20 -translate-x-1/2 w-3/4 flex flex-col items-center bg-gradient-to-br from-teal-500 via-teal-200 to-teal-950 p-10 sm:w-96">
          <Image
            src="/github-mark.png"
            width={100}
            height={100}
            alt="GitHub invertocat logo"
          />
          <h3 className="text-xl mb-4 font-bold text-teal-950">
            Sign in with GitHub
          </h3>
          <Button
            onClick={() => signIn("github")}
            className="shadow-teal-800"
            type="button"
          >
            Sign in
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="m-auto p-3 pt-4 flex flex-col items-center xs:px-4 sm:w-3/4 max-w-[1000px] gap-8">
      <h1 className="w-full text-5xl text-teal-950 text-center border-b-teal-500 border-b font-extrabold p-2 mb-2">
        Upload Teaching
      </h1>

      {uploading ? (
        <div className="p-4 flex flex-col items-center text-teal-950">
          <div className="text-2xl font-bold ">Uploading</div>
          <FontAwesomeIcon icon={faSpinner} className="text-xl animate-spin" />
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="flex flex-col items-center px-2 w-full max-w-[500px]"
        >
          <div className="flex flex-col gap-4 w-full">
            <label
              htmlFor="dropzone-file"
              className={cx(
                `flex flex-col items-center justify-center p-12 border-teal-900/25 rounded-lg cursor-pointer bg-opacity-40 text-teal-950`,
                file
                  ? "bg-teal-100 py-6 border-solid border"
                  : "border-dashed border-2",
                isDraggingOver ? "bg-teal-200" : "bg-teal-50"
              )}
            >
              <div className="flex flex-col items-center justify-center">
                {!file && (
                  <>
                    <FontAwesomeIcon
                      icon={faCloudArrowUp}
                      className="w-16 h-16"
                    />
                    <div className="text-sm opacity-70">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </div>
                  </>
                )}
                <div className="opacity-40 text-xs font-medium uppercase">
                  {file?.name}
                </div>
              </div>
            </label>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              required
            />

            <section className={`${!file ? "hidden" : ""} flex flex-col gap-4`}>
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

              <div className="flex gap-2">
                <Input
                  type="number"
                  value={minutes}
                  setValue={setMinutes}
                  required
                  className="w-1/3 grow"
                >
                  Minutes
                </Input>

                <Input
                  type="number"
                  value={seconds}
                  setValue={setSeconds}
                  required
                  className="w-1/3 grow"
                >
                  Seconds
                </Input>
              </div>

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
            </section>
          </div>

          <div className="mt-4 w-full flex flex-col gap-2 xs:flex-row">
            <Button
              type="button"
              onClick={onSubmit}
              className={`${!file && "hidden"}`}
            >
              <FontAwesomeIcon icon={faFileArrowUp} className="mr-2" />
              Upload File
            </Button>
            <Button
              onClick={() => signOut()}
              type="button"
              className={`bg-gray-800 bg-none ${!file && "mt-6"}`}
            >
              <Image
                src={session?.user?.image ?? ""}
                width={27}
                height={27}
                alt="github avatar"
                className="mr-2 rounded-full"
              />
              Sign Out
            </Button>
          </div>
        </form>
      )}
    </div>
  );

  async function onSubmit() {
    if (!title || !createdDate || !minutes || !seconds || !speaker || !file) {
      window.alert("Please fill out all required fields.");
      return;
    }
    setUploading(true);
    await upload(
      file,
      speaker,
      title.replace(/-/g, "–"),
      (Number(minutes) * 60 + Number(seconds)).toString(),
      createdDate,
      additionalInfo.replace(/-/g, "–")
    );
    window.location.href = "/";
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    // fetch the files
    const droppedfiles = Array.from(event.dataTransfer.files);
    setFile(droppedfiles[0]);
    setIsDraggingOver(false);
  }

  function handleDragOver(event: DragEvent<HTMLFormElement>): void {
    event.preventDefault();
    setIsDraggingOver(true);
  }

  function handleDragLeave(event: DragEvent<HTMLFormElement>): void {
    event.preventDefault();
    setIsDraggingOver(false);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  }
};

export default Upload;
