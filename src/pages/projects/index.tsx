import { getProjectsPreview, PageData } from "src/data";
import Link from "next/link";
import { ProjectMetadata } from "src/metadata";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Head from "next/head";
import { faHammer, faSnowflake } from "@fortawesome/free-solid-svg-icons";

const projects = getProjectsPreview();

const ProjectStatus: React.FC<{ status: "active" | "maintenance" }> = ({
  status,
}) => {
  const icon = status == "active" ? faHammer : faSnowflake;
  const color = status == "active" ? "text-green-600" : "text-yellow-600";
  const text = status == "active" ? "ACTIVE" : "MAINTENANCE";
  return (
    <span className={color + " text-sm font-semibold"}>
      <FontAwesomeIcon icon={icon} /> {text}
    </span>
  );
};

const ProjectPreview: React.FC<PageData<ProjectMetadata>> = ({
  link,
  metadata: { title, status, cardImage },
  component: Component,
}) => {
  return (
    <>
      <div className="p-4 xl:w-1/3 md:w-1/2">
        <div className="h-full border-2 border-gray-200 dark:border-gray-800 border-opacity-60 rounded-lg overflow-hidden relative">
          <img
            className="lg:h-48 md:h-36 w-full object-cover object-center"
            src={cardImage}
            alt="blog"
          />
          <div className="p-6">
            <ProjectStatus status={status} />
            <h1 className="title-font text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
              {title}
            </h1>
            <div className="leading-relaxed mb-6 prose dark:prose-dark">
              <Component />
            </div>
          </div>
          <div className="flex items-center flex-wrap mt-4 mb-2 absolute bottom-1 right-4">
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
          </div>
        </div>
      </div>
    </>
    // <Link href={link}>
    //   <div className="max-w-md rounded overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
    //     <img className="w-full" src={cardImage} />
    //     <div className="px-6 py-4">
    //       <div className="text-gray-800 dark:text-gray-200 font-bold text-xl mb-2">
    //         {title}
    //       </div>
    //       <div className="prose dark:prose-dark text-gray-500 dark:text-gray-400">
    //         <Component />
    //       </div>
    //     </div>
    //     <div className="px-6 pt-6 pb-4 flex justify-between">
    //       <ProjectStatus status={status} />
    //       <Link href={link}>
    //         <a className="text-blue-500 dark:text-blue-400 hover:text-blue-600 cursor-pointer">
    //           Read more →
    //         </a>
    //       </Link>
    //     </div>
    //   </div>
    // </Link>
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
        <div className="pt-12 flex flex-wrap -m-4">
          {projects.map((prj) => (
            <ProjectPreview {...prj} key={prj.metadata.title} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Index;
