import JSZip from "jszip";
import { listObjects, metaData } from "@friends-library/cloud";
import { MetaData, UsefulInfo } from "./types";
import saveAs from "file-saver";

export async function downloadAll(usefulInfo: Array<UsefulInfo>) {
  const zip = new JSZip();
  const promises: Array<Promise<[Blob, string]>> = [];
  for (const { fileName, cleanName } of usefulInfo) {
    const url = `${process.env.NEXT_PUBLIC_CLOUD_DOWNLOAD_ENDPOINT}/${fileName}`;
    promises.push(
      fetch(url)
        .then((res) => res.blob())
        .then((blob) => [blob, cleanName])
    );
  }

  const files = await Promise.all(promises);
  for (const [blob, cleanName] of files) {
    zip.file(`${cleanName}.mp3`, blob);
  }

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, "MSF-Teachings.zip");
}

export function download(path: string, cleanName: string): void {
  const downloadUrl = `${process.env.NEXT_PUBLIC_CLOUD_DOWNLOAD_ENDPOINT}/${path}`;
  fetch(downloadUrl).then(async (response) => {
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const contentDisposition = response.headers.get("content-disposition");
    let fileName = cleanName;
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="(.+)"/) ?? [];
      if (fileNameMatch.length === 2) fileName = fileNameMatch[1];
    }
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  });
}

export function getData(fileName: string, fileSize: number): UsefulInfo {
  const shortenedFileName = fileName.replace(".mp3", "");
  const splitByUnderscores = shortenedFileName.split("_");
  const createdDateDigits = splitByUnderscores[0].split("");
  const createdDate = {
    year: Number(createdDateDigits.splice(0, 2).join("")),
    month: Number(Number(createdDateDigits.splice(0, 2).join("")).toFixed(0)),
    day: Number(createdDateDigits.splice(0, 2).join("")),
  };
  const audioName = splitByUnderscores[1].split("-").join(" ");
  const speaker = splitByUnderscores[2].split("-").join(" ");
  const totalSeconds = Number(splitByUnderscores[3]);
  const hours = Number(Math.floor(totalSeconds / 3600).toFixed(0));
  let minutes = Math.floor((totalSeconds - hours * 60 * 60) / 60).toFixed(0);
  if (hours) {
    minutes = minutes.toString().padStart(2, "0");
  }
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  const extraInfo =
    splitByUnderscores.length === 5
      ? splitByUnderscores[4].split("-").join(" ")
      : null;

  return {
    cleanName: audioName,
    fileName: fileName,
    size: fileSize,
    lengthInSeconds: totalSeconds,
    createdDate: new Date(
      createdDate.year + 2000,
      createdDate.month - 1,
      createdDate.day,
      12
    ).toISOString(),
    year: createdDate.year,
    month: createdDate.month,
    day: createdDate.day,
    durationString: `${hours ? `${hours}:` : ""}${minutes}:${seconds}`,
    speaker: speaker,
    extraInfo: extraInfo,
  };
}

export async function getUsefulInfo(): Promise<Array<UsefulInfo>> {
  const fileNames = await listObjects("");
  const promisedData: MetaData[] = [];
  for (const file of fileNames) {
    if (!file.endsWith(".png")) {
      promisedData.push(metaData(file));
    }
  }
  const data = await Promise.all(promisedData);
  const usefulInfo = [];
  for (let i = 0; i < promisedData.length; i++) {
    usefulInfo.push(await getData(fileNames[i], data[i].ContentLength ?? 0));
  }
  usefulInfo.reverse();
  return usefulInfo;
}

export async function upload(
  file: File | undefined,
  speaker: string,
  title: string,
  seconds: string,
  createdDate: string,
  additionalInfo: string | null
) {
  if (!file || !speaker || !title || !seconds) {
    return;
  }

  const date = new Date(createdDate);
  // TODO: encodeURIComponent
  let namedFile = new File(
    [file],
    `${date.getFullYear() - 2000}${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}_${title
      .split(" ")
      .join("-")}_${speaker.split(" ").join("-")}_${seconds}${
      additionalInfo !== "" ? `_${additionalInfo}` : ""
    }.mp3`
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
}
