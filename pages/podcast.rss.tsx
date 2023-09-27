import type { GetServerSideProps } from "next";
import * as cloud from "@friends-library/cloud";
import { podcastXML } from "@/lib/podcast";
import { MetaData } from ".";

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
  for (let i = 0; i < data.length; i++) {
    usefulInfo.push({
      fileName: fileNames[i],
      lastModified:
        data[i].LastModified?.toISOString() ?? new Date().toISOString(),
      size: data[i].ContentLength ?? 0,
    });
  }
  usefulInfo.reverse();
  const podcastString = podcastXML(usefulInfo);

  const cacheMaxAgeUntilStaleSeconds = 60 * 60; // 1 minute
  const cacheMaxAgeStaleDataReturnSeconds = 60 * 60 * 60; // 60 minutes
  context.res.setHeader(
    "Cache-Control",
    `public, s-maxage=${cacheMaxAgeUntilStaleSeconds}, stale-while-revalidate=${cacheMaxAgeStaleDataReturnSeconds}`
  );

  context.res.setHeader("Content-Type", "application/rss+xml");
  context.res.write(podcastString);
  context.res.end();

  return { props: {} };
}) satisfies GetServerSideProps<{}>;

export default function RssPage() {}
