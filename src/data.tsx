import { join } from "path";
import {
  parsePostMetadata,
  parseProjectMetadata,
  PostMetadata,
  ProjectMetadata,
} from "./metadata";

const postCtx = require.context("./../content/posts", true, /\.mdx$/);
const prjCtx = require.context("./../content/projects", true, /\.mdx$/);

export interface PageData<TMetadata> {
  link: string;
  component: any;
  metadata: TMetadata;
}

function importAll<TMetadata>(
  ctx: __WebpackModuleApi.RequireContext,
  prefix: string,
  parseMetadata: (data: any) => TMetadata
): PageData<TMetadata>[] {
  return ctx.keys().map((filename) => ({
    link: `/${prefix}${filename.substr(1).replace(/\/index\.mdx$/, "")}`,
    metadata: parseMetadata(ctx(filename).meta),
    component: ctx(filename).default,
  }));
}

export function getPostPreviews(): PageData<PostMetadata>[] {
  return importAll(
    require.context("./../content/posts?preview", true, /\.mdx$/),
    "posts",
    parsePostMetadata
  ).sort((first, second) => second.metadata.date - first.metadata.date);
}

export function getPostBySlug(slug: string): PageData<PostMetadata> {
  const fileName = `./${slug}/index.mdx`;
  const { default: component, meta } = postCtx(fileName);

  return {
    link: `/posts/${slug}`,
    component: component,
    metadata: parsePostMetadata(meta),
  };
}

export function getProjectsPreview(): PageData<ProjectMetadata>[] {
  return importAll(
    require.context("./../content/projects?preview", true, /\.mdx$/),
    "projects",
    parseProjectMetadata
  );
}

export function getProjectBySlug(slug: string): PageData<ProjectMetadata> {
  const fileName = `./${slug}/index.mdx`;

  const { default: component, meta } = prjCtx(fileName);

  return {
    link: `/projects/${slug}`,
    component: component,
    metadata: parseProjectMetadata(meta),
  };
}
