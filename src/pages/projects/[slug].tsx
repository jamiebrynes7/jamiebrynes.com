import PageContainer from "@components/PageContainer";
import dayjs from "dayjs";
import { readdirSync } from "fs";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { ParsedUrlQuery } from "querystring";
import { getPostPreviews, getProjectBySlug, PageData } from "src/data";
import { PostMetadata } from "src/metadata";

const pagePreviews = getPostPreviews();

const RelatedPost: React.FC<PageData<PostMetadata>> = ({
  metadata,
  link,
  component: Component,
}) => {
  return (
    <Link href={link}>
      <div className="flex flex-col rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
        <span className="text-xs -mb-4">
          {dayjs.unix(metadata.date).format("MMMM DD, YYYY")}
        </span>
        <h4>{metadata.title}</h4>
        <Component />
      </div>
    </Link>
  );
};

const Project: React.FC<Props> = ({ slug }) => {
  const { metadata, component: Component } = getProjectBySlug(slug);

  const projectTag = `@projects/${slug}`;
  const relatedPosts = pagePreviews.filter(
    (metadata) =>
      metadata.metadata.tags !== undefined &&
      metadata.metadata.tags.indexOf(projectTag) != -1
  );

  return (
    <PageContainer title={metadata.title}>
      <div className="pb-16 xl:pb-20">
        <div className="prose dark:prose-dark max-w-none pt-10 pb-8">
          <Component />
          {relatedPosts.length !== 0 && (
            <>
              <hr />
              <h2>Related Writing</h2>
              <div className="space-y-4">
                {relatedPosts.map((post) => (
                  <RelatedPost {...post} key={post.metadata.title} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default Project;

interface Props {
  slug: string;
}

interface Params extends ParsedUrlQuery {
  slug: string;
}

export const getStaticProps: GetStaticProps<Props, Params> = async ({
  params,
}) => {
  return {
    props: {
      slug: params.slug,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const projects = readdirSync("content/projects");

  return {
    paths: projects.map((prj) => {
      return {
        params: {
          slug: prj,
        },
      };
    }),
    fallback: false,
  };
};
