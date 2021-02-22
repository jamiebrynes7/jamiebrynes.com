import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedin,
  faTwitter,
  IconDefinition,
} from "@fortawesome/free-brands-svg-icons";

const FooterLink: React.FC<{ url: string; icon: IconDefinition }> = ({
  url,
  icon,
}) => {
  return (
    <a className="mr-4 last:mr-0 hover:text-blue-500 duration-300" href={url}>
      <FontAwesomeIcon icon={icon} />
    </a>
  );
};

const Footer: React.FC<{}> = () => {
  return (
    <footer className="items-center justify-between mt-16 h-16 flex flex-row-reverse">
      <div className="flex text-gray-500 dark:text-gray-400 text-md xl:text-xl text-center justify-center">
        <FooterLink
          url="https://www.github.com/jamiebrynes7"
          icon={faGithub}
        ></FooterLink>
        <FooterLink
          url="https://www.twitter.com/jamiebrynes"
          icon={faTwitter}
        ></FooterLink>
        <FooterLink
          url="https://www.linkedin.com/in/jamiesonbrynes/"
          icon={faLinkedin}
        ></FooterLink>
      </div>
      <div className="text-sm xl:text-md text-gray-500 dark:text-gray-400 font-semibold text-center flex">
        Jamie Brynes &copy; 2021
      </div>
    </footer>
  );
};

export default Footer;
