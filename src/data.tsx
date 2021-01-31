import {
  parsePostMetadata,
  parseProjectMetadata,
  PostMetadata,
  ProjectMetadata,
} from "./metadata";

function importAll<TMetadata>(
  ctx: __WebpackModuleApi.RequireContext,
  prefix: string,
  parseMetadata: (data: any) => TMetadata
): PreviewData<TMetadata>[] {
  return ctx.keys().map((filename) => ({
    link: `/${prefix}${filename.substr(1).replace(/\/index\.mdx$/, "")}`,
    metadata: parseMetadata(ctx(filename).meta),
    component: ctx(filename).default,
  }));
}

export function getPostPreviews(): PreviewData<PostMetadata>[] {
  const ctx = require.context("./pages/posts/?preview", true, /\.mdx$/);
  return importAll(ctx, "posts", parsePostMetadata).sort(
    (first, second) => second.metadata.date - first.metadata.date
  );
}

export function getProjects(): PreviewData<ProjectMetadata>[] {
  const ctx = require.context("./pages/projects", true, /\.mdx$/);
  return importAll(ctx, "projects", parseProjectMetadata);
}

export interface PreviewData<TMetadata> {
  link: string;
  metadata: TMetadata;
  component: any;
}
