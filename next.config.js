const { createLoader } = require("simple-functional-loader");

const wrapPostContent = (src) => {
  return [
    'import Post from "@components/Post";',
    "",
    src,
    "export default Post;",
  ].join("\n");
};

const wrapProjectContent = (src) => {
  return [
    'import Project from "@components/Project";',
    "",
    src,
    "export default Project;",
  ].join("\n");
};

const wrapStandalonePage = (src) => {
  return [
    'import Page from "@components/Page";',
    "",
    src,
    "export default Page;",
  ].join("\n");
};

const imageRule = {
  test: /\.(svg|png|jpe?g|gif|mp4)$/i,
  use: [
    {
      loader: "file-loader",
      options: {
        publicPath: "/_assets",
        name: "static/media/[name].[hash].[ext]",
      },
    },
  ],
};

const mdx = (opts) => {
  return {
    test: /\.mdx$/,
    use: [
      opts.defaultLoaders.babel,
      {
        loader: "@mdx-js/loader",
        options: {},
      },
      createLoader(function (src) {
        let content = null;

        if (this._module.resource.includes("pages\\posts")) {
          content = wrapPostContent(src);
        } else if (this._module.resource.includes("pages\\projects")) {
          content = wrapProjectContent(src);
        } else if (this._module.resource.includes("pages\\resume")) {
          content = wrapStandalonePage(src);
        } else {
          console.warn(
            `mdx file found in unknown context: ${this._module.context}`
          );
          content = "";
        }

        if (content.includes("<!--more-->")) {
          return this.callback(null, content.split("<!--more-->").join("\n"));
        }

        return this.callback(
          null,
          content.replace(/<!--excerpt-->.*<!--\/excerpt-->/s, "")
        );
      }),
    ],
  };
};

module.exports = {
  pageExtensions: ["ts", "tsx", "mdx"],
  webpack: (config, options) => {
    config.module.rules.push(imageRule);
    config.module.rules.push(mdx(options));

    return config;
  },
};
