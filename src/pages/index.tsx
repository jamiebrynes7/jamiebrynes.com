import dayjs from "dayjs";
import { GetStaticProps } from "next";
import { getPostPreviews, getProjects, PreviewData } from "src/data";
import Link from "next/link";
import { PostMetadata, ProjectMetadata } from "src/metadata";

interface Props {
  projects: PreviewData<ProjectMetadata>[];
}

const posts = getPostPreviews().slice(0, 5);
const projects = getProjects();

const PostList: React.FC<{ posts: PreviewData<PostMetadata>[] }> = ({
  posts,
}) => {
  return (
    <>
      <div className="space-y-5">
        {posts.map((post) => {
          return (
            <div key={post.link}>
              <p className="text-sm leading-6 font-medium text-gray-500">
                {dayjs.unix(post.metadata.date).format("MMM DD, YYYY")}
              </p>
              <div className="xl:flex xl:justify-between xl:items-center">
                <h5 className="text-lg leading-8 font-bold tracking-tight text-gray-700 cursor-pointer">
                  <Link href={post.link}>
                    <a>{post.metadata.title}</a>
                  </Link>
                </h5>
                <div className="text-base leading-6 font-medium">
                  <Link href={post.link}>
                    <a className="text-blue-500 hover:text-blue-600 cursor-pointer">
                      Read →
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

const ProjectList: React.FC<{ projects: PreviewData<ProjectMetadata>[] }> = ({
  projects,
}) => {
  return (
    <>
      <div className="space-y-10">
        {projects.map((prj) => {
          return (
            <div key={prj.link}>
              <div className="xl:flex xl:justify-between xl:items-center">
                <h5 className="text-lg leading-8 font-bold tracking-tight text-gray-700 cursor-pointer">
                  <Link href={prj.link}>
                    <a>{prj.metadata.title}</a>
                  </Link>
                </h5>
                <div className="text-base leading-6 font-medium">
                  <Link href={prj.link}>
                    <a className="text-blue-500 hover:text-blue-600 cursor-pointer">
                      Read →
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

const Index: React.FC<Props> = ({}) => {
  return (
    <>
      <h1 className="text-6xl font-extrabold text-gray-800 mb-4">
        Jamie Brynes
      </h1>
      <h2 className="text-3xl text-gray-700 font-serif lg:w-2/3 mb-4">
        Designs and builds software that makes people more efficient in what
        they do.
      </h2>
      <h3 className="text-xl text-gray-600 lg:w-2/3">
        Software Engineer at{" "}
        <a
          className="text-blue-500 hover:text-blue-600 duration-300"
          href="https://improbable.io"
        >
          Improbable
        </a>
        .
      </h3>
      <div className="xl:grid xl:grid-cols-2 xl:gap-12 mt-32">
        <div>
          <h4 className="text-2xl text-gray-600 font-bold pb-2 border-gray-200 border-b mb-5">
            Latest Writing
          </h4>
          <PostList posts={posts} />
        </div>
        <div>
          <h4 className="text-2xl text-gray-600 font-bold pb-2 border-gray-200 border-b mb-5">
            Selected Projects
          </h4>
          <ProjectList projects={projects} />
        </div>
      </div>
    </>
  );
};

export default Index;
