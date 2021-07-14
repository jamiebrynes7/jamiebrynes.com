import PageContainer from "@components/PageContainer";
import { readdirSync } from "fs";
import { GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { getProjectBySlug } from "src/data";

const Project: React.FC<Props> = ({ slug }) => {
  const { metadata, component: Component } = getProjectBySlug(slug);
  return (
    <PageContainer title={metadata.title}>
      <div className="pb-16 xl:pb-20">
        <div className="prose dark:prose-dark max-w-none pt-10 pb-8">
          <Component />
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
