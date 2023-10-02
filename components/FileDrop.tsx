import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { DragEvent, useState } from "react";

const FileDrop: React.FC = () => {
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

  return (
    <form
      onSubmit={(e) => e.preventDefault}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <label
        htmlFor="dropzone-file"
        className={`flex flex-col items-center justify-center p-8 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-emerald-50 bg-opacity-40 hover:bg-opacity-90 text-teal-950 hover:text-opacity-80`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <FontAwesomeIcon icon={faCloudArrowUp} className="w-16 h-16" />
          <button className="mb-2 text-sm opacity-50">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </button>
        </div>
        <input id="dropzone-file" type="file" className="hidden" />
      </label>
    </form>
  );
};

export default FileDrop;
