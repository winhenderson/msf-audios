import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import * as cloud from "@friends-library/cloud";
import File from "@/components/File";

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
  console.log("filenames", fileNames.length);
  const usefulInfo = [];
  for (let i = 0; i < fileNames.length; i++) {
    console.log("in here!");
    let foo = {
      fileName: fileNames[i],
      lastModified:
        data[i].LastModified?.toISOString() ?? new Date().toISOString(),
      size: data[i].ContentLength ?? 0,
    };
    console.log("foo:", foo);
    usefulInfo.push(foo);
  }
  console.log(":::", usefulInfo);
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
  console.info({ usefulInfo });
  return (
    <>
      <ul className="flex flex-col w-3/4">
        <li className="flex  h-14 justify-between items-center mb-2 border-b-gray-400 border-b-2 border-b-solid px-4 text-lg">
          <span>Name</span>
          <div className="flex justify-around basis-1/3">
            <span className="-ml-6">Last Modified</span>
            <span className="-ml-1">Size</span>
          </div>
        </li>
        {usefulInfo.map((info) => (
          <File
            path={info.fileName}
            key={crypto.randomUUID()}
            lastModified={info.lastModified}
            size={info.size}
          />
        ))}
      </ul>
    </>
  );
}
export default Page;
