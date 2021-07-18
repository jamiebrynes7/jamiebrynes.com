import { getPostBySlug, getProjectBySlug } from "src/data";

const InternalLink: React.FC<{
  type: "blog" | "project";
  slug: string;
  title: string;
}> = ({ type, slug, title }) => {
  let link: string = "";

  switch (type) {
    case "blog":
      link = getPostBySlug(slug).link;
      break;
    case "project":
      link = getProjectBySlug(slug).link;
      break;
    default:
      throw new Error(`Unknown internal link type: ${type}`);
  }
  return <a href={link}>{title}</a>;
};

export default InternalLink;
