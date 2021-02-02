import { getPostPreviews, PageData } from "src/data";
import Link from "next/link";
import dayjs from "dayjs";
import { PostMetadata } from "src/metadata";
import Head from "next/head";

const posts = getPostPreviews();

const BlogPostPreview: React.FC<PageData<PostMetadata>> = ({
  link,
  metadata: { title, date },
  component: Component,
  ...props
}) => {
  return (
    <li className="py-12">
      <article className="space-y-2 xl:grid xl:grid-cols-4 xl:space-y-0 xl:items-baseline">
        <dl>
          <dd className="text-base leading-6 font-medium text-gray-500">
            {dayjs.unix(date).format("MMMM DD, YYYY")}
          </dd>
        </dl>
        <div className="space-y-5 xl:col-span-3">
          <div className="space-y-6">
            <h2 className="text-2xl leading-8 font-bold tracking-tight cursor-pointer">
              <Link href={link}>
                <a className="text-gray-800">{title}</a>
              </Link>
            </h2>
            <div className="prose max-w-none text-gray-500">
              <Component />
            </div>
          </div>
          <div className="text-base leading-6 font-medium">
            <Link href={link}>
              <a className="text-blue-500 hover:text-blue-600 cursor-pointer">
                Read more →
              </a>
            </Link>
          </div>
        </div>
      </article>
    </li>
  );
};

const Index: React.FC<{}> = ({}) => {
  return (
    <>
      <Head>
        <title>Writing | Jamie Brynes</title>
      </Head>
      <div className="divide-y divide-gray-200">
        <div className="pt-6 pb-8 space-y-5">
          <h1 className="text-6xl font-extrabold leading-14 text-gray-900 tracking-tight">
            Writing
          </h1>
          <p className="text-lg leading-7 text-gray-500">
            Thoughts, project updates, and anything else!
          </p>
        </div>
        <ul className="divide-y divide-gray-200">
          {posts.map((post) => (
            <BlogPostPreview {...post} key={post.metadata.title} />
          ))}
        </ul>
      </div>
    </>
  );
};

export default Index;
