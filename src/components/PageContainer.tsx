import Head from "next/head";

interface Props {
  title: string;
  subtitle?: JSX.Element;
}

const PageContainer: React.FC<Props> = ({ title, children, subtitle }) => {
  return (
    <>
      <Head>
        <title>{title} | Jamie Brynes</title>
      </Head>
      <article className="divide-y divide-gray-200 dark:divide-gray-700">
        <header className="pt-6 pb-6 xl:pb-10">
          <div className="space-y-1 xl:text-center">
            {subtitle}
            <h1 className="text-3xl leading-9 font-extrabold text-gray-800 dark:text-gray-200 tracking-tight sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">
              {title}
            </h1>
          </div>
        </header>
        {children}
      </article>
    </>
  );
};

export default PageContainer;
