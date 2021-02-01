const { createLoader } = require("simple-functional-loader");
const rehypePrism = require("@mapbox/rehype-prism");

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
            if (src.includes("<!--more-->")) {
              return this.callback(null, src.split("<!--more-->").join("\n"));
            }

            return this.callback(
              null,
              src.replace(/<!--excerpt-->.*<!--\/excerpt-->/s, "")
            );
          }),
        ],
      },
    ],
  };
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
  pageExtensions: ["ts", "tsx", "mdx"],
  webpack: (config, options) => {
    config.module.rules.push(imageRule);
    config.module.rules.push(mdx(options));

    return config;
  },
});
