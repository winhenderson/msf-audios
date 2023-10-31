import React from "react";
import Button from "./Button";
import cx from "classnames";
import Image from "next/image";

type Props = {
  type: "spotify" | "apple";
};

const PodcastButton: React.FC<Props> = ({ type }) => {
  return (
    <Button
      href={
        type === "apple"
          ? "https://podcasts.apple.com/us/podcast/msf-teachings/id1714317230"
          : ""
      }
      className={cx(
        "bg-none bg-white hover:bg-gray-50 flex gap-2 min-w-fit px-2 tracking-normal normal-case"
      )}
    >
      <Image
        src={type === "apple" ? "/apple.png" : "/spotify.png"}
        alt={`Listen on ${type}`}
        width={35}
        height={35}
      />
      <div className="flex flex-col justify-center w-full">
        <p className="-mb-1 text-[10px] xs:text-[11px] xs:-mb-[7px] font-semibold text-gray-400">
          Listen on
        </p>
        <p
          className={cx(
            type === "apple"
              ? "text-black text-md xs:text-lg font-medium"
              : "text-green-400 text-xl xs:text-2xl font-spotify font-semibold"
          )}
        >
          {type === "apple" ? (
            "Apple Podcasts"
          ) : (
            <span>
              Spotify<span className="text-[6px] align-top">®</span>
            </span>
          )}
        </p>
      </div>
    </Button>
  );
};

export default PodcastButton;
