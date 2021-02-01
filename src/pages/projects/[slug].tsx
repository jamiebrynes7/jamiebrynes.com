import PageContainer from "@components/PageContainer";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { readdirSync } from "fs";
import { GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { getProjectBySlug } from "src/data";

const Project: React.FC<Props> = ({ slug }) => {
  const { metadata, component: Component } = getProjectBySlug(slug);
  const githubLink = `https://github.com/${metadata.githubSlug}`;
  return (
    <PageContainer title={metadata.title}>
      <div className="divide-y xl:divide-y-0 divide-gray-200 xl:grid xl:grid-cols-5 xl:gap-x-6 pb-16 xl:pb-20">
        <div className="pt-6 pb-10 xl:pt-11 xl:border-b xl:border-gray-200 space-y-5">
          <div>
            <p className="text-gray-700 font-semibold">
              <FontAwesomeIcon icon={faGithub} />
              <span> GitHub:</span>
            </p>
            <a
              className="text-sm text-gray-600 hover:text-blue-500"
              href={githubLink}
            >
              {metadata.githubSlug}
            </a>
          </div>
          <div>
            <p className="text-gray-700 font-semibold">Tech Stack</p>
            <ul className="list-disc mt-2 list-inside">
              {metadata.tech.map(({ name, url }) => (
                <li key={name}>
                  <a className="text-gray-500 hover:text-blue-500" href={url}>
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="divide-y divide-gray-200 xl:pb-0 xl:col-span-4 xl:row-span-2">
          <div className="prose max-w-none pt-10 pb-8">
            <Component />
          </div>
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
