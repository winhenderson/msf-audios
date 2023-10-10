import type { NextApiRequest, NextApiResponse } from "next";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ url: string }>
) {
  const client = new S3Client({
    region: "nyc3",
    endpoint: "https://nyc3.digitaloceanspaces.com",
    credentials: {
      accessKeyId: process.env.CLOUD_STORAGE_KEY ?? "",
      secretAccessKey: process.env.CLOUD_STORAGE_SECRET ?? "",
    },
  });

  // console.log("here is the json", req.body);
  const json = req.body;

  const command = new PutObjectCommand({
    Bucket: "msf-audios",
    Key: json.filename,
    ContentType: "audio/mpeg",
    ACL: "public-read",
    ContentLength: 29466,
  });

  const url = await getSignedUrl(client, command, { expiresIn: 60 * 60 });
  res.status(200).json({ url });
}
