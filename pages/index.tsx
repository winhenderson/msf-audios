import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import FileList from "@/components/FileList";
import Button from "@/components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faCloudArrowDown,
  faEllipsisVertical,
  faPodcast,
} from "@fortawesome/free-solid-svg-icons";
import { faApple, faGoogle } from "@fortawesome/free-brands-svg-icons";
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
  const [podcastInfoShown, setPodcastInfoShown] = useState(false);

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
              await downloadAll(usefulInfo);
              setDownloading(false);
            }}
            disabled={downloading}
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
        <div
          className="w-screen h-screen absolute top-0"
          onClick={() => setPodcastInfoShown(false)}
        >
          <div
            className="w-2/3 bg-gradient-to-br flex flex-col from-slate-200 to-teal-100 drop-shadow-lg p-8 fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 text-teal-950 rounded-xl gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="font-bold text-2xl mb-4 text-center">
              How To Use the Podcast
            </h1>

            <div className="flex flex-col justify-between sm:flex-row font-bold mb-4 gap-4 sm:gap-6 text-opacity-90 text-teal-950">
              <details className="basis-1/2">
                <summary className="flex justify-between items-center">
                  <span>
                    <FontAwesomeIcon icon={faApple} className="mr-2 text-xl" />{" "}
                    Apple Podcasts
                  </span>{" "}
                  <FontAwesomeIcon icon={faChevronDown} />
                </summary>
                <ol className="text-teal-900 text-sm font-medium list-decimal pl-2 ml-3">
                  <li>Open the Podcasts app</li>
                  <li>Tap "Library"</li>
                  <li>Tap "Edit" and then tap "Add a Show by URL"</li>
                  <li>Paste in the URL</li>
                  <li>Tap "Follow"</li>
                </ol>
              </details>
              <details className="basis-1/2">
                <summary className="flex justify-between items-center">
                  <span>
                    <FontAwesomeIcon icon={faGoogle} className="mr-2" />
                    Google Podcasts
                  </span>{" "}
                  <FontAwesomeIcon icon={faChevronDown} />
                </summary>
                <ol className="text-teal-900 font-medium text-sm list-decimal pl-2 ml-3">
                  <li>Open the Google Podcasts app</li>
                  <li>
                    At the bottom, tap "Activity" and then "Subscriptions"
                  </li>
                  <li>
                    Tap "More" <FontAwesomeIcon icon={faEllipsisVertical} />
                  </li>
                  <li>Paste in the URL</li>
                  <li>Tap "Subscribe"</li>
                </ol>
              </details>
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
        </div>
      )}
    </>
  );
}
export default Page;
