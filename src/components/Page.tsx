import PageContainer from "./PageContainer";

interface Props {
  title: string;
}

const Page: React.FC<Props> = ({ title, children }) => {
  return (
    <PageContainer title={title}>
      <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:pb-0">
        <div className="prose dark:prose-dark max-w-none pt-10 pb-8">
          {children}
        </div>
      </div>
    </PageContainer>
  );
};

export default Page;
