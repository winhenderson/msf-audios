import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import * as cloud from "@friends-library/cloud";
import FileList from "@/components/FileList";
import Button from "@/components/Button";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowDown } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export type MetaData = ReturnType<typeof cloud.metaData>;

export type DateString = string;
export type UsefulInfo = Array<{
  fileName: string;
  lastModified: DateString;
  size: number;
}>;

type Props = { usefulInfo: UsefulInfo };

export const getServerSideProps = (async (context) => {
  const fileNames = await cloud.listObjects("");
  const promisedData: MetaData[] = [];
  for (const file of fileNames) {
    if (!file.endsWith(".png")) {
      promisedData.push(cloud.metaData(file));
    }
  }
  const data = await Promise.all(promisedData);
  const usefulInfo = [];
  for (let i = 0; i < promisedData.length; i++) {
    usefulInfo.push({
      fileName: fileNames[i],
      lastModified:
        data[i].LastModified?.toISOString() ?? new Date().toISOString(),
      size: data[i].ContentLength ?? 0,
    });
  }
  usefulInfo.reverse();
  return { props: { usefulInfo } };
}) satisfies GetServerSideProps<Props>;

//
//
//
//
//

export function Page({
  usefulInfo,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="p-2 pt-4 flex flex-col items-center xs:px-4 sm:w-3/4 m-auto max-w-[1000px]">
      <h1 className="w-full text-5xl text-teal-950 text-center border-b-teal-500 border-b font-extrabold p-2 mb-2">
        Sunday Teachings
      </h1>
      <FileList usefulInfo={usefulInfo} />
      <div className="flex w-full gap-2">
        <Button onClick={() => downloadAll(usefulInfo)} className="mt-2">
          Download All
          <FontAwesomeIcon icon={faCloudArrowDown} className="ml-2" />
        </Button>
        {/* <Button onClick={() => } className="mt-2">
          Podcast
          <FontAwesomeIcon icon={faPodcast} className="ml-2" />
        </Button> */}
        <Link
          href="./podcast.rss"
          type="application/rss+xml"
          className="w-full bg-teal-900 text-white text-center"
        >
          Podcast
        </Link>
      </div>
    </div>
  );
}
export default Page;

async function downloadAll(usefulInfo: UsefulInfo) {
  const zip = new JSZip();
  for (const { fileName } of usefulInfo) {
    const url = `https://msf-audios.nyc3.digitaloceanspaces.com/${fileName}`;
    zip.file(fileName, url);
  }
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, "msf-sunday-teachings.zip");
}
