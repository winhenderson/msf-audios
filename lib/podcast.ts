import { UsefulInfo } from "./types";
import { getData } from "./utils";

export function podcastXML(usefulInfo: UsefulInfo): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <rss
    version="2.0"
    xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
    xmlns:podcast="https://podcastindex.org/namespace/1.0"
    xmlns:atom="http://www.w3.org/2005/Atom"
  >
    <channel>
      <atom:link
        href="https://msf-audios.vercel.app/podcast.rss"
        rel="self"
        type="application/rss+xml"
      />
      <title>MSF Sunday Morning Teachings</title>
      <itunes:subtitle>Taught by Jason and Jared Henderson</itunes:subtitle>
      <link>https://msf-audios.vercel.app/podcast.rss</link>
      <language>en</language>
      <itunes:author>MSF</itunes:author>
      <description>MSF Sunday Morning Teachings</description>
      <itunes:summary>MSF Sunday Morning Teachings</itunes:summary>
      <itunes:explicit>false</itunes:explicit>
      <itunes:type>episodic</itunes:type>
      <itunes:owner>
        <itunes:name>Jared Henderson</itunes:name>
        <itunes:email>jared.thomas.henderson@gmail.com</itunes:email>
      </itunes:owner>
      <itunes:image href="https://msf-audios.nyc3.digitaloceanspaces.com/MSF_Podcast.png" />
      <image>
        <url>https://msf-audios.nyc3.digitaloceanspaces.com/MSF_Podcast.png</url>
        <title>MSF Sunday Morning Teachings</title>
        <link>https://msf-audios.vercel.app/podcast.rss</link>
      </image>
      <itunes:category text="Religion &amp; Spirituality">
        <itunes:category text="Christianity" />
      </itunes:category>
      ${usefulInfo
        .map(({ fileName, size }) => episode(fileName, size))
        .join("")}
    </channel>
  </rss>`;
}

function episode(fileName: string, size: number): string {
  const info = getData(fileName, size);
  return `<item>
  <title>${info.cleanName}</title>
  <enclosure
    url="https://msf-audios.nyc3.digitaloceanspaces.com/${encodeURIComponent(
      fileName
    )}
    length="${size}"
    type="audio/mpeg"
  />
  <itunes:author>Jason Henderson</itunes:author>
  <itunes:summary>Sunday morning teaching on "${
    info.cleanName
  }" by Jason Henderson</itunes:summary>
  <itunes:subtitle>Sunday morning teaching on "${
    info.cleanName
  }" by Jason Henderson</itunes:subtitle>
  <description>Sunday morning teaching on "${
    info.cleanName
  }" by Jason Henderson</description>
  <guid isPermaLink="true">https://msf-audios.nyc3.digitaloceanspaces.com/${encodeURIComponent(
    fileName
  )}</guid>
  <pubDate>${info.createdDate.toUTCString()}</pubDate>
  <itunes:duration>${Math.round(info.lengthInSeconds)}</itunes:duration>
  <itunes:explicit>false</itunes:explicit>
  <itunes:episodeType>full</itunes:episodeType>
</item>`;
}
