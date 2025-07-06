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

function linkModifications(color, hoverColor) {
  return {
    a: {
      color: color,
    },
    "a:hover": {
      color: hoverColor,
    },
    "a code": {
      color: color,
    },
    "a:hover code": {
      color: hoverColor,
    },
  };
}

module.exports = {
  content: ['layouts/**/*.html'],
  darkMode: "class",
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: [
            {
              "figcaption": {
                textAlign: "center",
                fontStyle: "italic",
              },
              ...codeModifications(
                theme("colors.gray.800"),
                "rgba(0, 0, 0, 0.1)"
              ),
              ...linkModifications(
                theme("colors.blue.500"),
                theme("colors.blue.600")
              ),
            },
          ]
        },
        invert: {
          css: [
            {
              ...codeModifications(
                theme("colors.gray.200"),
                "rgba(255, 255, 255, 0.15)"
              ),
              ...linkModifications(
                theme("colors.blue.400"),
                theme("colors.blue.300")
              ),
            },
          ]
        }
      })
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
