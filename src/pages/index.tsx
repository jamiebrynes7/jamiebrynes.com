import dayjs from "dayjs";
import { getPostPreviews, getProjectsPreview, PageData } from "src/data";
import Link from "next/link";
import { PostMetadata, ProjectMetadata } from "src/metadata";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import socials from "../socials.json";

interface Props {
  projects: PageData<ProjectMetadata>[];
}

const posts = getPostPreviews().slice(0, 5);
const projects = getProjectsPreview().slice(0, 5);

const PostList: React.FC<{ posts: PageData<PostMetadata>[] }> = ({ posts }) => {
  return (
    <>
      <div className="space-y-5">
        {posts.map((post) => {
          return (
            <div key={post.link}>
              <p className="text-sm leading-6 font-medium text-gray-500 dark:text-gray-400">
                {dayjs.unix(post.metadata.date).format("MMM DD, YYYY")}
              </p>
              <div className="xl:flex xl:justify-between xl:items-center">
                <h5 className="text-lg leading-8 font-bold tracking-tight text-gray-700 dark:text-gray-300 cursor-pointer">
                  <Link href={post.link}>
                    <a>{post.metadata.title}</a>
                  </Link>
                </h5>
                <div className="text-base leading-6 font-medium">
                  <Link href={post.link}>
                    <a className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 cursor-pointer">
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

const ProjectList: React.FC<{ projects: PageData<ProjectMetadata>[] }> = ({
  projects,
}) => {
  return (
    <>
      <div className="space-y-5">
        {projects.map((prj) => {
          return (
            <div key={prj.link}>
              <div className="text-sm leading-6 font-medium text-gray-500 dark:text-gray-400">
                <FontAwesomeIcon icon={faGithub} />
                <span> {prj.metadata.githubSlug}</span>
              </div>
              <div className="xl:flex xl:justify-between xl:items-center">
                <h5 className="text-lg leading-8 font-bold tracking-tight text-gray-700 dark:text-gray-300 cursor-pointer">
                  <Link href={prj.link}>
                    <a>{prj.metadata.title}</a>
                  </Link>
                </h5>
                <div className="text-base leading-6 font-medium">
                  <Link href={prj.link}>
                    <a className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 cursor-pointer">
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

const HeroLink: React.FC<{ url: string }> = ({ url, children }) => {
  return (
    <a
      className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 duration-300"
      href={url}
    >
      {children}
    </a>
  );
};

const Index: React.FC<Props> = ({ }) => {
  return (
    <>
      <div className="mt-16 lg:mt-0 lg:flex lg:flex-row-reverse lg:justify-between lg:items-center">
        <img
          className="rounded-full w-1/3 mb-6 lg:mb-0 lg:w-72 lg:h-72"
          src="/profile-pic.jpg"
        />
        <div className="lg:w-2/3">
          <h1 className="text-6xl font-extrabold text-gray-800 dark:text-gray-200 mb-4">
            Jamie Brynes
          </h1>
          <h2 className="text-3xl text-gray-700 dark:text-gray-300 font-serif mb-4">
            Software Engineer at{" "}
            <HeroLink url="https://www.hyperexponential.com/">hyperexponential</HeroLink>
          </h2>
          <h3 className="text-xl text-gray-600 dark:text-gray-400">
            <span>You can find me on</span>
            <HeroLink url={socials.github}> GitHub,</HeroLink>
            <HeroLink url={socials.twitter}> Twitter,</HeroLink>
            <span> or</span>
            <HeroLink url={socials.linkedin}> LinkedIn</HeroLink>
            <br />
            <span>... come say 👋!</span>
          </h3>
        </div>
      </div>
      <div className="xl:grid xl:grid-cols-2 xl:gap-12 mt-16 lg:mt-32">
        <div>
          <h4 className="text-2xl text-gray-600 dark:text-gray-300 font-bold pb-2 border-gray-200 dark:border-gray-700 border-b mb-5">
            Latest Writing
          </h4>
          <PostList posts={posts} />
        </div>
        <div className="mt-16 xl:mt-0">
          <h4 className="text-2xl text-gray-600 dark:text-gray-300 font-bold pb-2 border-gray-200 dark:border-gray-700 border-b mb-5">
            Selected Projects
          </h4>
          <ProjectList projects={projects} />
        </div>
      </div>
    </>
  );
};

export default Index;
