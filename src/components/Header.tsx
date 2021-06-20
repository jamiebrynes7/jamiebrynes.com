import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import Brand from "./Brand";

const DarkModeToggle: React.FC = () => {
  const [toggled, setToggled] = useState(false);

  useEffect(() => {
    if ("theme" in localStorage) {
      setToggled(localStorage.theme === "dark");
    } else {
      setToggled(
        window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
      );
    }
  }, []);

  useEffect(() => {
    if (toggled) {
      localStorage.theme = "dark";
      document.documentElement.classList.add("dark");
    } else {
      localStorage.theme = "light";
      document.documentElement.classList.remove("dark");
    }
  }, [toggled]);

  return (
    <div
      onClick={() => setToggled(!toggled)}
      className="relative inline-block w-16 h-8 align-middle select-none transition duration-200 ease-in rounded-full bg-gray-300 dark:bg-gray-700 cursor-pointer"
    >
      {!toggled && (
        <>
          <div className="absolute block w-6 h-6 top-1 left-1 rounded-full bg-gray-500 dark:bg-gray-900 border-4 border-gray-100 cursor-pointer"></div>
          <span className="absolute right-1">☀</span>
        </>
      )}
      {toggled && (
        <>
          <span className="absolute left-1">🌙</span>
          <div className="absolute block w-6 h-6 top-1 right-1 rounded-full bg-gray-500 dark:bg-gray-800 border-4 border-gray-100 cursor-pointer"></div>
        </>
      )}
    </div>
  );
};

const HeaderLink: React.FC<{ url: string; display: string }> = ({
  url,
  display,
}) => {
  return (
    <Link href={url}>
      <a className="block font-semibold lg:inline-block hover:text-blue-500 dark:hover:text-blue-300 duration-300 mr-6 last:mr-0">
        {display}
      </a>
    </Link>
  );
};

const Header: React.FC = () => {
  const [isMobileMenuOpen, toggleMobileMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onRouteChangeComplete = (url, { shallow }) => {
      toggleMobileMenu(false);
    };
    router.events.on("routeChangeComplete", onRouteChangeComplete);

    return () => {
      router.events.off("routeChangeComplete", onRouteChangeComplete);
    };
  });
  return (
    <>
      <header className="mb-6 lg:mb-12">
        <div className="m-auto py-2 items-center justify-between flex lg:h-16 lg:py-4 lg:mb-20">
          <div className="flex items-center flex-shrink-0">
            <Link href="/">
              <a className="text-gray-500 dark:text-gray-300 dark:hover:text-blue-300 hover:text-blue-500">
                <FontAwesomeIcon icon={faHome} height="32px" width="32px" />
              </a>
            </Link>
          </div>
          <nav className="hidden md:block items-center text-gray-500 dark:text-gray-400 lg:flex lg:w-auto">
            <div className="text-lg flex lg:flex-grow">
              <HeaderLink url="/posts" display="Writing" />
              <HeaderLink url="/projects" display="Projects" />
              <HeaderLink url="/resume" display="Resume" />
              <DarkModeToggle />
            </div>
          </nav>
          <div
            className="block md:hidden text-gray-400 dark:text-gray-500"
            onClick={() => toggleMobileMenu(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen && (
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
            {!isMobileMenuOpen && (
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="pb-4 pt-2 pl-1 space-y-2 border-b border-gray-700 text-gray-500 dark:text-gray-400">
            <HeaderLink url="/posts" display="Writing" />
            <HeaderLink url="/projects" display="Projects" />
            <HeaderLink url="/resume" display="Resume" />
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
