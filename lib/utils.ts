import JSZip from "jszip";
import { listObjects, metaData } from "@friends-library/cloud";
import { MetaData, UsefulInfo } from "./types";
import saveAs from "file-saver";
import createEstimator, { FetchDataReader } from "mp3-duration-estimate";

export async function downloadAll(usefulInfo: Array<UsefulInfo>) {
  const zip = new JSZip();
  for (const { fileName } of usefulInfo) {
    const url = `https://msf-audios.nyc3.digitaloceanspaces.com/${fileName}`;
    zip.file(fileName, url);
  }
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, "msf-sunday-teachings.zip");
}

export function download(path: string): void {
  const downloadUrl = `https://msf-audios.nyc3.digitaloceanspaces.com/${path}`;
  fetch(downloadUrl).then(async (response) => {
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const contentDisposition = response.headers.get("content-disposition");
    let fileName = path;
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

export async function getData(
  fileName: string,
  fileSize: number
): Promise<UsefulInfo> {
  const shortenedFileName = fileName.replace(".mp3", "");
  const underscoredFileName = shortenedFileName
    .split("")
    .map((letter) => (letter === " " ? "_" : letter))
    .join("");
  const splitFileName = underscoredFileName.split("_");
  const createdDateDigits = splitFileName.splice(0, 1)[0].split("");
  const createdDate = {
    year: Number(createdDateDigits.splice(0, 2).join("")),
    month: Number(Number(createdDateDigits.splice(0, 2).join("")).toFixed(0)),
    day: Number(createdDateDigits.splice(0, 2).join("")),
  };
  const audioName = splitFileName.join(" ");

  const { totalSeconds, seconds, minutes } = await getAudioDuration(fileName);

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
    durationString: `${minutes}:${seconds}`,
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
    // usefulInfo.push({
    //   fileName: fileNames[i],
    //   size: data[i].ContentLength ?? 0,
    // });
    usefulInfo.push(await getData(fileNames[i], data[i].ContentLength ?? 0));
  }
  usefulInfo.reverse();
  return usefulInfo;
}

async function getAudioDuration(
  fileName: string
): Promise<{ totalSeconds: number; seconds: number; minutes: number }> {
  const estimator = createEstimator(new FetchDataReader(fetch));
  const duration = await estimator(
    `https://msf-audios.nyc3.digitaloceanspaces.com/${fileName}`
  );
  console.log(`${fileName}: ${duration / 60}`);
  return {
    totalSeconds: duration,
    seconds: Number((duration % 60).toFixed(0)),
    minutes: Math.floor(duration / 60),
  };
}
