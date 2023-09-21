import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import * as cloud from "@friends-library/cloud";
import File from "@/components/File";

type Props = {
  files: string[];
};

export const getServerSideProps = (async (context) => {
  const fileNames = await cloud.listObjects("");
  for (const file of fileNames) {
    const data = await cloud.metaData(file);
    // console.log(data);
  }
  return { props: { files: fileNames } };
}) satisfies GetServerSideProps<Props>;

export default function Page({
  files,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <div>Howdy!</div>
      <ul>
        {files.map((file) => (
          <File path={file} key={crypto.randomUUID()} />
        ))}
      </ul>
    </>
  );
}
