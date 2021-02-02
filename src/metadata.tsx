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
  githubSlug: string;
  tech: {
    name: string;
    url: string;
  }[];
  cardImage: string;
}

const projectSchema = joi.object({
  title: joi.string().required(),
  githubSlug: joi
    .string()
    .pattern(/(.*)\/(.*)/)
    .required(),
  tech: joi.array().items(
    joi.object({
      name: joi.string().required(),
      url: joi.string().uri().required(),
    })
  ),
  cardImage: joi.string().required(),
});

export function parseProjectMetadata(data: any): ProjectMetadata {
  joi.assert(data, projectSchema);
  return data as ProjectMetadata;
}
