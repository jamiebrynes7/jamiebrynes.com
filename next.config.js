const { createLoader } = require("simple-functional-loader");
const rehypePrism = require("@mapbox/rehype-prism");
const rehypeSlug = require("rehype-slug");

const imageRule = {
  test: /\.(svg|png|jpe?g|gif|mp4)$/i,
  use: [
    {
      loader: "file-loader",
      options: {
        publicPath: "/_next",
        name: "static/media/[name].[hash].[ext]",
      },
    },
  ],
};

const mdx = (opts) => {
  const common = [
    opts.defaultLoaders.babel,
    {
      loader: "@mdx-js/loader",
      options: {
        rehypePlugins: [rehypePrism, rehypeSlug],
      },
    },
  ];

  const moreIndicator = "<!--more-->";

  return {
    test: /\.mdx$/,
    oneOf: [
      {
        resourceQuery: /preview/,
        use: [
          ...common,
          createLoader(function (src) {
            if (src.includes(moreIndicator)) {
              const [preview] = src.split(moreIndicator);
              return this.callback(null, preview);
            }

            const [preview] = src.split("<!--/excerpt-->");
            return this.callback(null, preview.replace("<!--excerpt-->", ""));
          }),
        ],
      },
      {
        use: [
          ...common,
          createLoader(function (src) {
            const firstOccurance = src.indexOf(moreIndicator);

            if (firstOccurance != -1) {
              const content = [
                src.substring(0, firstOccurance),
                src.substring(firstOccurance + moreIndicator.length),
              ].join("\n");

              return this.callback(null, content);
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
  webpack5: false,
});
