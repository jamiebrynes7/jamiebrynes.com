import { getProjectsPreview, PageData } from "src/data";
import Link from "next/link";
import { ProjectMetadata } from "src/metadata";
import Head from "next/head";

const projects = getProjectsPreview();

const ProjectPreview: React.FC<PageData<ProjectMetadata>> = ({
  link,
  metadata: { title, status, techStack },
  component: Component,
}) => {
  return (
    <>
      <div className="p-4 lg:w-1/2">
        <div className="h-full bg-gray-100 dark:bg-transparent dark:border dark:border-gray-700 bg-opacity-75 px-8 pt-16 pb-24 rounded-lg text-center overflow-hidden relative">
          <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 dark:text-gray-500 mb-1 uppercase">
            {status}
          </h2>
          <h1 className="title-font sm:text-2xl text-xl font-medium text-gray-900 dark:text-gray-100 mb-3">
            {title}
          </h1>
          <div className="leading-relaxed mb-6 prose dark:prose-dark">
            <Component />
          </div>
          <Link href={link}>
            <a className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 inline-flex items-center md:mb-2 lg:mb-0">
              Learn More
              <svg
                className="w-4 h-4 ml-2"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </a>
          </Link>
          <div className="text-center my-2 leading-none flex justify-center absolute bottom-0 left-0 w-full py-4 text-gray-500 dark:text-grey-500 space-x-3 text-sm tracking-wide">
            {techStack
              .flatMap((item) => [item, "•"])
              .slice(0, -1)
              .map((item) => (
                <span>{item}</span>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

const Index: React.FC<{}> = ({}) => {
  return (
    <>
      <Head>
        <title>Projects | Jamie Brynes</title>
      </Head>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="pt-6 pb-8 space-y-5">
          <h1 className="text-6xl font-extrabold leading-14 text-gray-900 dark:text-gray-100 tracking-tight">
            Projects
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            What I'm currently working on or maintaining
          </p>
        </div>
        <div className="pt-12 flex items-stretch flex-col lg:flex-row lg:flex-wrap -m-4">
          {projects.map((prj) => (
            <ProjectPreview {...prj} key={prj.metadata.title} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Index;
