import dayjs from "dayjs";
import joi from "joi";

export interface PostMetadata {
  title: string;
  date: number;
}

const postSchema = joi.object({
  title: joi.string().required(),
  date: joi.date().required(),
});

export function parsePostMetadata(data: any): PostMetadata {
  joi.assert(data, postSchema);

  return {
    title: data.title,
    date: dayjs(data.date).unix(),
  };
}

export interface ProjectMetadata {
  title: string;
  status: "maintenance" | "active";
  githubSlug: string;
  techStack: string[];
}

const projectSchema = joi.object({
  title: joi.string().required(),
  status: joi.string().valid("maintenance", "active").required(),
  githubSlug: joi
    .string()
    .pattern(/(.*)\/(.*)/)
    .required(),
  techStack: joi.array().items(joi.string()).required(),
});

export function parseProjectMetadata(data: any): ProjectMetadata {
  joi.assert(data, projectSchema);
  return data as ProjectMetadata;
}
