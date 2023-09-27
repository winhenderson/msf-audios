import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import FileList from "@/components/FileList";
import Button from "@/components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowDown } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { UsefulInfo } from "@/lib/types";
import { downloadAll, getUsefulInfo } from "@/lib/utils";

type Props = { usefulInfo: UsefulInfo };

export const getServerSideProps = (async (context) => {
  const usefulInfo = await getUsefulInfo();
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
        {/* eslint-disable-next-line */}
        <a
          href="./podcast.rss"
          type="application/rss+xml"
          className="w-full bg-teal-900 text-white text-center"
        >
          Podcast
        </a>
      </div>
    </div>
  );
}
export default Page;
