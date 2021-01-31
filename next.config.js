const { createLoader } = require("simple-functional-loader");
const { remarkPrism } = require("@mapbox/rehype-prism");
const rehypePrism = require("@mapbox/rehype-prism");

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

const getContent = (src, _module) => {
  let content = null;

  if (_module.resource.includes("pages\\posts")) {
    content = wrapPostContent(src);
  } else if (_module.resource.includes("pages\\projects")) {
    content = wrapProjectContent(src);
  } else if (_module.resource.includes("pages\\resume")) {
    content = wrapStandalonePage(src);
  } else {
    console.warn(`mdx file found in unknown context: ${this._module.context}`);
    content = "";
  }

  return content;
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
    oneOf: [
      {
        resourceQuery: /preview/,
        use: [
          opts.defaultLoaders.babel,
          {
            loader: "@mdx-js/loader",
            options: {},
          },
          createLoader(function (src) {
            console.log("In preview!");
            if (src.includes("<!--more-->")) {
              const [preview] = src.split("<!--more-->");
              return this.callback(null, preview);
            }

            const [preview] = src.split("<!--/excerpt-->");
            return this.callback(null, preview.replace("<!--excerpt-->", ""));
          }),
        ],
      },
      {
        use: [
          opts.defaultLoaders.babel,
          {
            loader: "@mdx-js/loader",
            options: {
              rehypePlugins: [rehypePrism],
            },
          },
          createLoader(function (src) {
            const content = getContent(src, this._module);

            if (content.includes("<!--more-->")) {
              return this.callback(
                null,
                content.split("<!--more-->").join("\n")
              );
            }

            return this.callback(
              null,
              content.replace(/<!--excerpt-->.*<!--\/excerpt-->/s, "")
            );
          }),
        ],
      },
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
