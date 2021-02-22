import { getProjectsPreview, PageData } from "src/data";
import Link from "next/link";
import { ProjectMetadata } from "src/metadata";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Head from "next/head";
import { faHammer, faSnowflake } from "@fortawesome/free-solid-svg-icons";
import { stat } from "fs";

const projects = getProjectsPreview();

const ProjectStatus: React.FC<{ status: "active" | "maintenance" }> = ({
  status,
}) => {
  const icon = status == "active" ? faHammer : faSnowflake;
  const color = status == "active" ? "text-green-600" : "text-yellow-600";
  const text = status == "active" ? "Active" : "Maintained";
  return (
    <span className={color + " text-sm"}>
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
    <Link href={link}>
      <div className="max-w-md rounded overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
        <img className="w-full" src={cardImage} />
        <div className="px-6 py-4">
          <div className="text-gray-800 font-bold text-xl mb-2">{title}</div>
          <div className="prose text-gray-500">
            <Component />
          </div>
        </div>
        <div className="px-6 pt-6 pb-4 flex justify-between">
          <ProjectStatus status={status} />
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
      <Head>
        <title>Projects | Jamie Brynes</title>
      </Head>
      <div className="divide-y divide-gray-200">
        <div className="pt-6 pb-8 space-y-5">
          <h1 className="text-6xl font-extrabold leading-14 text-gray-900 tracking-tight">
            Projects
          </h1>
          <p className="text-lg leading-7 text-gray-500">
            What I'm currently working on or maintaining
          </p>
        </div>
        <div className="pt-12 grid items-center justify-items-center grid-cols-1 xl:grid-cols-3 gap-4">
          {projects.map((prj) => (
            <ProjectPreview {...prj} key={prj.metadata.title} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Index;
