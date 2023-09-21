import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const url = `https://msf-audios.nyc3.digitaloceanspaces.com/${req.query.filename}`;
  const { data } = await axios.get<Readable>(url, {
    responseType: "stream",
  });

  res.setHeader(
    "content-disposition",
    `attachment; filename="${req.query.filename}"`
  );

  data.pipe(res);
  console.log(data);
}

export default handler;
