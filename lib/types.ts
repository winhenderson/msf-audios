export type MetaData = Promise<{
  LastModified?: Date | undefined;
  ContentLength?: number | undefined;
  ETag?: string | undefined;
  ContentType?: string | undefined;
}>;

export type DateString = string;

export type UsefulInfo = Array<{
  fileName: string;
  size: number;
}>;
