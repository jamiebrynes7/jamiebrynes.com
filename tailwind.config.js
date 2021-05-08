function codeModifications(color, backgroundColor) {
  return {
    code: {
      color: color,
      backgroundColor: backgroundColor,
      borderRadius: "0.25rem",
      padding: "0.2rem 0.25rem",
      fontWeight: "400",
      "--tw-bg-opacity": "1",
    },
    "code::before": {
      content: '""',
    },
    "code::after": {
      content: '""',
    },
    "pre code": {
      backgroundColor: "unset",
    },
    "pre code::before": {
      content: "unset",
    },
    "pre code::after": {
      content: "unset",
    },
  };
}

module.exports = {
  purge: ["./src/pages/**/*.tsx", "./src/components/*.tsx"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      typography: (theme) => ({
        dark: {
          css: [
            {
              color: theme("colors.gray.400"),
              '[class~="lead"]': {
                color: theme("colors.gray.300"),
              },
              a: {
                color: theme("colors.white"),
              },
              strong: {
                color: theme("colors.white"),
              },
              "ol > li::before": {
                color: theme("colors.gray.400"),
              },
              "ul > li::before": {
                backgroundColor: theme("colors.gray.600"),
              },
              hr: {
                borderColor: theme("colors.gray.200"),
              },
              blockquote: {
                color: theme("colors.gray.200"),
                borderLeftColor: theme("colors.gray.600"),
              },
              h1: {
                color: theme("colors.white"),
              },
              h2: {
                color: theme("colors.white"),
              },
              h3: {
                color: theme("colors.white"),
              },
              h4: {
                color: theme("colors.white"),
              },
              "figure figcaption": {
                color: theme("colors.gray.400"),
              },
              "a code": {
                color: theme("colors.white"),
              },
              pre: {
                color: theme("colors.gray.200"),
                backgroundColor: theme("colors.gray.800"),
              },
              thead: {
                color: theme("colors.white"),
                borderBottomColor: theme("colors.gray.400"),
              },
              "tbody tr": {
                borderBottomColor: theme("colors.gray.600"),
              },
              ...codeModifications(
                theme("colors.gray.200"),
                "rgba(255, 255, 255, 0.15)"
              ),
            },
          ],
        },
        DEFAULT: {
          css: [
            {
              ...codeModifications(
                theme("colors.gray.800"),
                "rgba(0, 0, 0, 0.1)"
              ),
            },
          ],
        },
      }),
    },
  },
  variants: {
    extend: {
      margin: ["last"],
      typography: ["dark"],
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
