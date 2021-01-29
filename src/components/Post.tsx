import dayjs from "dayjs";
import { parseMetadata, PostMetadata } from "src/metadata";
import PageContainer from "./PageContainer";

interface Props {
  meta: any;
}

const Post: React.FC<Props> = ({ meta, children }) => {
  const parsedMeta = parseMetadata(meta);
  return (
    <PageContainer title={parsedMeta.title}>
      <div className="divide-y xl:divide-y-0 divide-gray-200 xl:grid xl:grid-cols-5 xl:gap-x-6 pb-16 xl:pb-20">
        <div className="pt-6 pb-10 xl:pt-11 xl:border-b xl:border-gray-200">
          <p className="text-base font-semibold text-gray-700 mb-1">
            Published on:
          </p>
          <p className="text-gray-500">
            {dayjs.unix(parsedMeta.date).format("MMM DD, YYYY")}
          </p>
        </div>
        <div className="divide-y divide-gray-200 xl:pb-0 xl:col-span-4 xl:row-span-2">
          <div className="prose max-w-none pt-10 pb-8">{children}</div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Post;
