import axios, {
  AxiosResponse,
  RawAxiosResponseHeaders,
  AxiosResponseHeaders,
} from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";

const File: React.FC<{ path: string }> = ({ path }) => {
  const url = `https://msf-audios.nyc3.digitaloceanspaces.com/${path}`;
  // const { download } = useDownloadFile(async () =>
  //   blobMapper(await axios.get(url))
  // );

  // console.log(download());
  return (
    <li>
      <button
        onClick={(e) =>
          axios({
            url: url,
            method: "GET",
            responseType: "blob", // important
          }).then((response) => {
            const blob = new Blob([response.data], {
              type: response.data.type,
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            const contentDisposition = response.headers["content-disposition"];
            let fileName = path;
            if (contentDisposition) {
              const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
              if (fileNameMatch.length === 2) fileName = fileNameMatch[1];
            }
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
          })
        }
      >
        {path}
      </button>
    </li>
  );
};

export default File;

interface DownloadableResponse {
  blob: Blob;
  filename: string;
}
interface FileDownload {
  download: () => void;
}

export const useDownloadFile = (
  request: () => Promise<DownloadableResponse>
): FileDownload => {
  const anchorRef = useRef<HTMLAnchorElement | null>(null);
  const [url, setUrl] = useState("");

  useEffect(() => {
    const anchor = document.createElement("a");
    anchor.style.display = "none";
    anchorRef.current = anchor;
    document.body.appendChild(anchor);

    return () => {
      document.body.removeChild(anchor);
    };
  }, []);

  useEffect(() => {
    const toRevoke = url;
    return () => {
      if (toRevoke) {
        URL.revokeObjectURL(toRevoke);
      }
    };
  }, [url]);

  const download = useCallback(() => {
    request()
      .then(({ blob, filename }) => {
        console.log("filename::::", filename);
        const url = URL.createObjectURL(blob);
        setUrl(url);
        if (anchorRef.current) {
          anchorRef.current.href = url;
          anchorRef.current.download = filename;
          anchorRef.current.click();
        }
      })
      .catch(() => {
        // Handle error here
      });
  }, [request]);

  return { download };
};

const blobMapper = (
  response: AxiosResponse<BlobPart>
): DownloadableResponse => ({
  blob: new Blob([response.data]),
  filename: getFilenameFromHeaders(response.headers),
});

const CONTENT_DISPOSITION_HEADER = "content-disposition";

export const getFilenameFromHeaders = (
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders
): string => {
  const headerLine = headers[CONTENT_DISPOSITION_HEADER];
  if (!headerLine) {
    throw new Error(`could not find '${CONTENT_DISPOSITION_HEADER}' header`);
  }

  try {
    return headerLine.split("filename=")[1].replace(/"/g, "");
  } catch {
    throw new Error(`could not parse '${CONTENT_DISPOSITION_HEADER}' header`);
  }
};
