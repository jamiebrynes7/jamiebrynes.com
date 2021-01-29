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
    <footer className="items-center justify-between mt-16 lg:h-16 lg:flex lg:flex-row-reverse">
      <div className="flex text-gray-800 text-xl text-center justify-center">
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
      <div className="text-gray-500 font-semibold text-center mt-2 lg:mt-0 lg:flex">
        Jamie Brynes &copy; 2021
      </div>
    </footer>
  );
};

export default Footer;
