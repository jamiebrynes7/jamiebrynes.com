import { parseMetadata, PostMetadata } from "./metadata";

function importAll(ctx: __WebpackModuleApi.RequireContext): PostPreviewData[] {
  return ctx.keys().map((filename) => ({
    link: `/posts${filename.substr(1).replace(/\/index\.mdx$/, "")}`,
    metadata: parseMetadata(ctx(filename).meta),
  }));
}

export function getPostPreviews(): PostPreviewData[] {
  return importAll(require.context("./pages/posts", true, /\.mdx$/)).sort(
    (first, second) => first.metadata.date - second.metadata.date
  );
}

export interface PostPreviewData {
  link: string;
  metadata: PostMetadata;
}
