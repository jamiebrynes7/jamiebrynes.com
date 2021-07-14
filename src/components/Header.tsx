import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import { useEffect, useState } from "react";

const DarkModeToggle: React.FC<{ position?: string }> = ({ position }) => {
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

  const icon = toggled ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  );

  return (
    <button
      onClick={() => setToggled(!toggled)}
      className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 focus:outline-none flex justify-center items-center"
    >
      {icon}
    </button>
  );
};

const SearchButton: React.FC<{}> = () => {
  return (
    <button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 focus:outline-none flex justify-center items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </button>
  );
};

const HeaderLink: React.FC<{ url: string; display: string }> = ({
  url,
  display,
}) => {
  return (
    <Link href={url}>
      <a className="block font-semibold text-lg text-gray-500 dark:text-gray-400 lg:inline-block hover:text-blue-500 dark:hover:text-blue-300 duration-300 mr-6 last:mr-0">
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
          <nav className="hidden md:flex items-center flex-shrink-0 ">
            <HeaderLink url="/" display="Home" />
            <HeaderLink url="/posts" display="Writing" />
            <HeaderLink url="/projects" display="Projects" />
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            {/* <SearchButton /> */}
            <DarkModeToggle />
          </div>
          <h1 className="block md:hidden font-bold text-gray-800 dark:text-gray-200 text-xl">
            Jamie Brynes
          </h1>
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
          <div className="block md:hidden pb-4 pt-2 space-y-2 border-b border-gray-500 text-gray-500 dark:text-gray-400">
            <HeaderLink url="/posts" display="Writing" />
            <HeaderLink url="/projects" display="Projects" />
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
