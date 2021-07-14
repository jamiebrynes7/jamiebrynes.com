const SectionContainer: React.FC<{}> = ({ children }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 xl:max-w-5xl xl:px-0">
      {children}
    </div>
  );
};

export default SectionContainer;
