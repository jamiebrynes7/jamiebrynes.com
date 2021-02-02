import Head from "next/head";
import Link from "next/link";
import Brand from "./Brand";

const HeaderLink: React.FC<{ url: string; display: string }> = ({
  url,
  display,
}) => {
  return (
    <Link href={url}>
      <a className="block font-semibold lg:inline-block hover:text-blue-500 duration-300 mr-6">
        {display}
      </a>
    </Link>
  );
};

const Header: React.FC = () => {
  return (
    <>
      <header>
        <div className="m-auto mb-12 lg:items-center lg:justify-between lg:flex lg:h-16 lg:py-4 lg:mb-20">
          <div className="flex items-center flex-shrink-0">
            <Link href="/">
              <a className="text-gray-500 hover:text-blue-500">
                <Brand height={48} width={48} />
              </a>
            </Link>
          </div>
          <nav className="block items-center text-gray-500 lg:flex lg:w-auto">
            <div className="text-lg lg:flex-grow">
              <HeaderLink url="/posts" display="Writing" />
              <HeaderLink url="/projects" display="Projects" />
              <HeaderLink url="/resume" display="Resume" />
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
