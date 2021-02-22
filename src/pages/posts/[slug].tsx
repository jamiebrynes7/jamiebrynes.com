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
  return (
    <PageContainer
      title={metadata.title}
      subtitle={
        <p className="text-base leading-6 font-medium text-gray-500">
          {dayjs.unix(metadata.date).format("MMMM DD, YYYY")}
        </p>
      }
    >
      <div className="pb-16 xl:pb-20">
        <div className="prose max-w-none pt-10 pb-8">
          <Component />
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
