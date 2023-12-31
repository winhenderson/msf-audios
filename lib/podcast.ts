import { UsefulInfo } from "./types";
import { getData } from "./utils";

export function podcastXML(usefulInfo: Array<UsefulInfo>): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <rss
    version="2.0"
    xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
    xmlns:podcast="https://podcastindex.org/namespace/1.0"
    xmlns:atom="http://www.w3.org/2005/Atom"
  >
    <channel>
      <atom:link
        href="https://audios.marketstreetfellowship.com"
        rel="self"
        type="application/rss+xml"
      />
      <title>MSF Teachings</title>
      <itunes:subtitle>Teachings from some great people at MSF</itunes:subtitle>
      <link>https://audios.marketstreetfellowship.com</link>
      <language>en</language>
      <itunes:author>MSF</itunes:author>
      <description>Teachings from some great people at MSF</description>
      <itunes:summary>Teachings from some great people at MSF</itunes:summary>
      <itunes:explicit>false</itunes:explicit>
      <itunes:type>episodic</itunes:type>
      <itunes:owner>
        <itunes:name>Jared Henderson</itunes:name>
        <itunes:email>jared.thomas.henderson@gmail.com</itunes:email>
      </itunes:owner>
      <itunes:image href="https://msf-audios.nyc3.digitaloceanspaces.com/MSF_Podcast.png" />
      <image>
        <url>https://msf-audios.nyc3.digitaloceanspaces.com/MSF_Podcast.png</url>
        <title>MSF Teachings</title>
        <link>https://audios.marketstreetfellowship.com/api/podcast</link>
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
    url="https://${
      process.env.CLOUD_STORAGE_BUCKET
    }.nyc3.digitaloceanspaces.com/${encodeURIComponent(fileName)}"
    length="${size}"
    type="audio/mpeg"
  />
  <itunes:author>${info.speaker}</itunes:author>
  <itunes:summary>Teaching on "${info.cleanName}" by ${
    info.speaker
  }</itunes:summary>
  <itunes:subtitle>Teaching on "${info.cleanName}" by ${
    info.speaker
  }</itunes:subtitle>
  <description>Teaching on "${info.cleanName}" by ${info.speaker}</description>
  <guid isPermaLink="true">https://${
    process.env.CLOUD_STORAGE_BUCKET
  }.nyc3.digitaloceanspaces.com/${encodeURIComponent(fileName)}</guid>
  <pubDate>${new Date(info.createdDate).toUTCString()}</pubDate>
  <itunes:duration>${Math.round(info.lengthInSeconds)}</itunes:duration>
  <itunes:explicit>false</itunes:explicit>
  <itunes:episodeType>full</itunes:episodeType>
</item>`;
}
