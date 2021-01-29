import dayjs from "dayjs";

export interface PostMetadata {
  title: string;
  date: number;
}

export function parsePostMetadata(data: any): PostMetadata {
  return {
    title: data.title,
    date: dayjs(data.date).unix(),
  };
}

export interface ProjectMetadata {
  title: string;
  githubSlug: string;
  tech: {
    name: string;
    url: string;
  }[];
}

export function parseProjectMetadata(data: any): ProjectMetadata {
  return data;
}
