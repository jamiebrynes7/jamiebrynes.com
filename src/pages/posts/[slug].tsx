import PageContainer from "@components/PageContainer";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import { readdirSync } from "fs";
import { GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { getPostBySlug } from "src/data";

const Post: React.FC<Props> = ({ slug }) => {
  const { metadata, component: Component } = getPostBySlug(slug);
  const url = `https://jamiebrynes.com/posts/${slug}`;
  const twitterIntent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    metadata.title
  )}&url=${encodeURIComponent(url)}&via=jamiebrynes`;

  const emailIntent = `mailto:?subject=${encodeURIComponent(
    metadata.title
  )}&body=${encodeURIComponent(url)}`;
  return (
    <PageContainer title={metadata.title}>
      <div className="divide-y xl:divide-y-0 divide-gray-200 xl:grid xl:grid-cols-5 xl:gap-x-6 pb-16 xl:pb-20">
        <div>
          <div className="pt-6 pb-6 pl-2 xl:border-b xl:border-gray-200">
            <p className="text-base font-semibold text-gray-700 mb-1">
              Published on:
            </p>
            <p className="text-gray-500">
              {dayjs.unix(metadata.date).format("MMM DD, YYYY")}
            </p>
          </div>
          <div className="pt-6 pb-6 pl-2 xl:border-b xl:border-gray-200">
            <p className="text-base font-semibold text-gray-700 mb-1">
              Share on:
            </p>
            <span className="text-gray-500 space-x-4">
              <a
                className="hover:text-blue-500"
                href={twitterIntent}
                target="_blank"
                rel="noopener"
              >
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a
                className="hover:text-blue-500"
                href={emailIntent}
                target="_blank"
                rel="noopener"
              >
                <FontAwesomeIcon icon={faEnvelope} />
              </a>
            </span>
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

export default Post;

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
  const posts = readdirSync("content/posts");

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post,
        },
      };
    }),
    fallback: false,
  };
};
