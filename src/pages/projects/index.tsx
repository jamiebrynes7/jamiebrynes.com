import { getProjectsPreview, PageData } from "src/data";
import Link from "next/link";
import { ProjectMetadata } from "src/metadata";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const projects = getProjectsPreview();

const ProjectPreview: React.FC<PageData<ProjectMetadata>> = ({
  link,
  metadata: { title, githubSlug, cardImage },
  component: Component,
}) => {
  const githubLink = `https://github.com/${githubSlug}`;

  return (
    <Link href={link}>
      <div className="max-w-md rounded overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
        <img className="w-full" src={cardImage} />
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{title}</div>
          <div className="prose text-gray-500">
            <Component />
          </div>
        </div>
        <div className="px-6 pt-6 pb-4 flex justify-between">
          <a
            href={githubLink}
            className="text-gray-600 hover:text-blue-500 text-lg"
          >
            <FontAwesomeIcon icon={faGithub} />
          </a>
          <Link href={link}>
            <a className="text-blue-500 hover:text-blue-600 cursor-pointer">
              Read more →
            </a>
          </Link>
        </div>
      </div>
    </Link>
  );
};

const Index: React.FC<{}> = ({}) => {
  return (
    <>
      <div className="divide-y divide-gray-200">
        <div className="pt-6 pb-8 space-y-5">
          <h1 className="text-6xl font-extrabold leading-14 text-gray-900 tracking-tight">
            Projects
          </h1>
          <p className="text-lg leading-7 text-gray-500">
            What I'm currently working on or maintaining
          </p>
        </div>
        <div className="pt-12 grid items-center justify-items-center grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 lg:gap-4">
          {projects.map((prj) => (
            <ProjectPreview {...prj} key={prj.metadata.title} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Index;
