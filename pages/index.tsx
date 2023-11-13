import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import FileList from "@/components/FileList";
import Button from "@/components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowDown } from "@fortawesome/free-solid-svg-icons";
import { UsefulInfo } from "@/lib/types";
import { downloadAll, getUsefulInfo } from "@/lib/utils";
import { useState } from "react";
import PodcastButton from "@/components/PodcastButton";
// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import "@fortawesome/fontawesome-svg-core/styles.css";
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; /* eslint-disable import/first */

type Props = { usefulInfo: Array<UsefulInfo> };

export const getServerSideProps = (async (context) => {
  const usefulInfo = await getUsefulInfo();
  return { props: { usefulInfo } };
}) satisfies GetServerSideProps<Props>;

export function Page({
  usefulInfo,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [downloading, setDownloading] = useState(false);

  return (
    <>
      <div
        className={`p-2 pt-4 flex flex-col items-center xs:px-4 sm:w-3/4 m-auto max-w-[1000px]`}
      >
        <h1 className="w-full text-5xl text-teal-950 text-center border-b-teal-500 border-b font-extrabold p-2 mb-2">
          MSF Teachings
        </h1>

        <div className="flex justify-center w-full gap-2 lg:gap-4 flex-col md:flex-row my-2">
          <Button
            type="button"
            className="md:w-48 lg:w-56"
            onClick={async () => {
              setDownloading(true);
              await downloadAll(usefulInfo);
              setDownloading(false);
            }}
            disabled={downloading}
          >
            {downloading ? (
              "Downloading..."
            ) : (
              <>
                <FontAwesomeIcon icon={faCloudArrowDown} className="mr-2" />
                <span>Download All</span>
              </>
            )}
          </Button>
          <div className="flex gap-[6px] md:gap-2 lg:gap-4">
            <PodcastButton type="apple"></PodcastButton>
            <PodcastButton type="spotify"></PodcastButton>
          </div>
        </div>

        <FileList usefulInfo={usefulInfo} />
      </div>
    </>
  );
}
export default Page;
