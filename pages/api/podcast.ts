import type { NextApiRequest, NextApiResponse } from "next";
import { podcastXML } from "@/lib/podcast";
import { getUsefulInfo } from "@/lib/utils";

type ResponseData = {
  podcastInfo: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const usefulInfo = await getUsefulInfo();
  const podcastString = podcastXML(usefulInfo);

  const cacheMaxAgeUntilStaleSeconds = 60 * 60; // 1 minute
  const cacheMaxAgeStaleDataReturnSeconds = 60 * 60 * 60; // 60 minutes
  res.setHeader(
    "Cache-Control",
    `public, s-maxage=${cacheMaxAgeUntilStaleSeconds}, stale-while-revalidate=${cacheMaxAgeStaleDataReturnSeconds}`
  );

  res.setHeader("Content-Type", "application/rss+xml");
  res.write(podcastString);
  res.end();
}
