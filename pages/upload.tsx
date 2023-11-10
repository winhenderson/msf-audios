import React, { useState, DragEvent } from "react";
import {
  faCloudArrowUp,
  faFileArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "@/components/Button";
import { upload } from "@/lib/utils";
import Input from "@/components/Input";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

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
    <div className="m-auto w-full p-3 pt-4 flex flex-col items-center xs:px-4 sm:w-3/4 max-w-[1000px] gap-8">
      <h1 className="w-full text-5xl text-teal-950 text-center border-b-teal-500 border-b font-extrabold p-2 mb-2">
        Upload Teaching
      </h1>

      {uploading ? (
        <div className="text-teal-950 text-2xl text-bold p-4">Uploading...</div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          onDragOver={handledragover}
          onDragLeave={handledragleave}
          onDrop={handledrop}
          className="flex flex-col items-center"
        >
          <div className="flex flex-col gap-4">
            <label
              htmlFor="dropzone-file"
              className={`flex flex-col items-center justify-center p-12 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-teal-50 bg-opacity-40  text-teal-950 ${
                file && "bg-teal-100 p-4"
              }`}
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
              onChange={handlefilechange}
              required
            />

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

              <Button type="button" onClick={onSubmit} className="mt-4">
                Upload File
                <FontAwesomeIcon icon={faFileArrowUp} className="ml-2" />
              </Button>
            </section>
          </div>

          <Button
            onClick={() => signOut()}
            type="button"
            className="w-44 mt-4 bg-gray-800 bg-none"
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
        </form>
      )}
    </div>
  );

  async function onSubmit() {
    setUploading(true);
    await upload(file, speaker, title, seconds, createdDate, additionalInfo);
    window.location.href = "/";
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
