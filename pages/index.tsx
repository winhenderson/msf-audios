import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import FileList from "@/components/FileList";
import Button from "@/components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudArrowDown,
  faEllipsisVertical,
  faPodcast,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { UsefulInfo } from "@/lib/types";
import { downloadAll, getUsefulInfo } from "@/lib/utils";
import { useState } from "react";

type Props = { usefulInfo: Array<UsefulInfo> };

export const getServerSideProps = (async (context) => {
  const usefulInfo = await getUsefulInfo();
  return { props: { usefulInfo } };
}) satisfies GetServerSideProps<Props>;

export function Page({
  usefulInfo,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [downloading, setDownloading] = useState(false);
  const [podcastInfoShown, setPodcastInfoShown] = useState(true);

  return (
    <>
      <div
        className={`p-2 pt-4 flex flex-col items-center xs:px-4 sm:w-3/4 m-auto max-w-[1000px] ${
          podcastInfoShown && "blur-sm"
        }`}
      >
        <h1 className="w-full text-5xl text-teal-950 text-center border-b-teal-500 border-b font-extrabold p-2 mb-2">
          MSF Teachings
        </h1>

        <div className="flex w-full gap-2 flex-col xs:flex-row my-2">
          <Button
            type="button"
            buttonType="button"
            onClick={async () => {
              setDownloading(true);
              // TODO: disable button
              await downloadAll(usefulInfo);
              setDownloading(false);
            }}
          >
            {downloading ? (
              "Downloading..."
            ) : (
              <>
                <span>Download All</span>
                <FontAwesomeIcon icon={faCloudArrowDown} className="ml-2" />
              </>
            )}
          </Button>
          <Button
            type="button"
            buttonType="button"
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.href}api/podcast`
              );
              setPodcastInfoShown(true);
            }}
          >
            Podcast
            <FontAwesomeIcon icon={faPodcast} className="ml-2" />
          </Button>
        </div>

        <FileList usefulInfo={usefulInfo} />
      </div>
      {podcastInfoShown && (
        <div className="w-2/3 bg-gradient-to-br flex flex-col from-slate-200 to-teal-600 drop-shadow-lg p-8 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 text-teal-950 rounded-xl">
          <h2 className="font-bold text-lg mb-4">
            The URL for the MSF Teachings podcast is copied to your clipboard.
          </h2>
          <div className="flex justify-between font-bold mb-4">
            <div>
              <h3>Apple Podcasts</h3>
              <ul className="text-teal-900 font-medium list-disc list-inside pl-2">
                <li>Open the Podcast app</li>
                <li>In the menu bar of your computer open the "File" tab</li>
                <li>Select "Follow a Show by URL"</li>
                <li>In the popup paste in the URL</li>
                <li>Enjoy!</li>
              </ul>
            </div>
            <div>
              <h3>Google Podcasts</h3>
              <ul className="text-teal-900 font-medium list-disc list-inside pl-2">
                <li>Open the Google Podcasts app</li>
                <li>At the bottom, tap "Activity" and then "Subscriptions"</li>
                <li>
                  Tap "More" <FontAwesomeIcon icon={faEllipsisVertical} />
                </li>
                <li>Paste in the URL</li>
                <li>Tap "Subscribe"</li>
                <li>Enjoy!</li>
              </ul>
            </div>
          </div>
          <Button
            type="button"
            buttonType="button"
            className="shadow-teal-800"
            onClick={() => {
              setPodcastInfoShown(false);
            }}
          >
            Close
          </Button>
        </div>
      )}
    </>
  );
}
export default Page;
