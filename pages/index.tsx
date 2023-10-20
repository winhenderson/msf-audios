import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import FileList from "@/components/FileList";
import Button from "@/components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowDown, faPodcast } from "@fortawesome/free-solid-svg-icons";
import { UsefulInfo } from "@/lib/types";
import { downloadAll, getUsefulInfo } from "@/lib/utils";

type Props = { usefulInfo: Array<UsefulInfo> };

export const getServerSideProps = (async (context) => {
  const usefulInfo = await getUsefulInfo();
  return { props: { usefulInfo } };
}) satisfies GetServerSideProps<Props>;

export function Page({
  usefulInfo,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="p-2 pt-4 flex flex-col items-center xs:px-4 sm:w-3/4 m-auto max-w-[1000px]">
      <h1 className="w-full text-5xl text-teal-950 text-center border-b-teal-500 border-b font-extrabold p-2 mb-2">
        MSF Teachings
      </h1>

      <div className="flex w-full gap-2 flex-col xs:flex-row mb-2">
        <Button
          type="button"
          buttonType="button"
          onClick={() => downloadAll(usefulInfo)}
          className="mt-2"
        >
          Download All
          <FontAwesomeIcon icon={faCloudArrowDown} className="ml-2" />
        </Button>
        <Button type="external" href="/api/podcast" className="mt-2">
          Podcast
          <FontAwesomeIcon icon={faPodcast} className="ml-2" />
        </Button>
      </div>

      <FileList usefulInfo={usefulInfo} />
    </div>
  );
}
export default Page;
