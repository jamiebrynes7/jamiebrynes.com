import Page from "@components/Page";
import React from "react";

const Resume: React.FC<{}> = ({}) => {
  const ResumeContent = require("content/resume.mdx").default;
  return (
    <Page title="Resume">
      <ResumeContent />
    </Page>
  );
};

export default Resume;
