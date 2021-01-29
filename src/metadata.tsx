import dayjs from "dayjs";

export interface PostMetadata {
  title: string;
  date: number;
}

export function parseMetadata(data: any): PostMetadata {
  return {
    title: data.title,
    date: dayjs(data.date).unix(),
  };
}
