export type MetaData = Promise<{
  LastModified?: Date | undefined;
  ContentLength?: number | undefined;
  ETag?: string | undefined;
  ContentType?: string | undefined;
}>;

export type DateString = string;

export type UsefulInfo = {
  cleanName: string;
  size: number;
  lengthInSeconds: number;
  durationString: string;
  createdDate: string;
  year: number;
  month: number;
  day: number;
  fileName: string;
  speaker: string;
  extraInfo: string | null;
};
