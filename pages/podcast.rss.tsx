import type { GetServerSideProps } from "next";
import { podcastXML } from "@/lib/podcast";
import { getUsefulInfo } from "@/lib/utils";

export const getServerSideProps = (async (context) => {
  const usefulInfo = await getUsefulInfo();
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
