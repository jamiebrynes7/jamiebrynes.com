import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PageContainer from "./PageContainer";

interface Props {
  meta: any;
}

const Project: React.FC<Props> = ({ meta, children }) => {
  const githubLink = `https://github.com/${meta.githubSlug}`;
  return (
    <PageContainer title={meta.title}>
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
              {meta.githubSlug}
            </a>
          </div>
          <div>
            <p className="text-gray-700 font-semibold">Tech Stack</p>
            <ul className="list-disc mt-2 list-inside">
              {meta.tech.map(({ name, url }) => (
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
          <div className="prose max-w-none pt-10 pb-8">{children}</div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Project;
