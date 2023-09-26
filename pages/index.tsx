import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import * as cloud from "@friends-library/cloud";
import FileList from "@/components/FileList";

export type metaData = ReturnType<typeof cloud.metaData>;

export type DateString = string;

type Props = {
  usefulInfo: Array<{
    fileName: string;
    lastModified: DateString;
    size: number;
  }>;
};

export const getServerSideProps = (async (context) => {
  const fileNames = await cloud.listObjects("");
  const promisedData: metaData[] = [];
  for (const file of fileNames) {
    promisedData.push(cloud.metaData(file));
  }
  const data = await Promise.all(promisedData);
  const usefulInfo = [];
  for (let i = 0; i < fileNames.length; i++) {
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
    <div className="px-2 flex flex-col items-center xs:px-4 sm:w-3/4 m-auto">
      <h1 className="w-full text-4xl text-teal-950 text-center border-b-teal-700 border-b font-bold pb-2 pt-4 mb-2">
        Sunday Teachings
      </h1>
      <FileList usefulInfo={usefulInfo} />
    </div>
  );
}
export default Page;
