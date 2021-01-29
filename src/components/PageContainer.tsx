interface Props {
  title: string;
}

const PageContainer: React.FC<Props> = ({ title, children }) => {
  return (
    <article className="xl:divide-y xl:divide-gray-200">
      <header className="pt-6 xl:pb-10">
        <div className="space-y-1 lg:text-center">
          <h1 className="text-3xl leading-9 font-extrabold text-gray-800 tracking-tight sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">
            {title}
          </h1>
        </div>
      </header>
      {children}
    </article>
  );
};

export default PageContainer;
