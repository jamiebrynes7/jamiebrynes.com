---
title: Website Rewrite
date: "2021-07-14"
tags: 
 - "@projects/personal-website"
---

As an engineer, nothing is more distracting than new and shiny tech. That's one of the reasons I decided to rewrite my website using [NextJS](http://nextjs.org/) and [TailwindCSS](https://tailwindcss.com/). In this post, I cover what motivated me to rewrite this website and some of features I built during the process.

<!--more-->

Previously, I used [Zola](https://www.getzola.org/) to generate the last iteration of this site. There were a few reasons for a rewrite:

- **Experimentation**. I wanted to learn how to use React and NextJ as a way of extending my skillset.
- **Expressiveness**. I wanted a type-safe and fully featured language for templating. Zola uses the [Tera](https://tera.netlify.app/) engine for templating, which is perfectly fine, but I prefer something a little more structured and composable.
- **Maintainability**. Writing custom components with interactivity is simpler in NextJS. In Zola, I would write a Tera shortcode that generates some HTML and some then plain old Javascript would hook into that HTML on page load. Whereas in NextJS, I can write a React component which marries the structure and logic cleanly. This is easier to isolate and reason about.
- **Fun**. I wanted to use [TailwindCSS](https://tailwindcss.com/) as the backing CSS framework. Since that involved rewriting all my templates already, why not go one step further and rewrite _everything_! This is, after all, a personal project.

In the sections below, I'll cover some of the features I built during this process. Hopefully someone will find them useful if they take on a similar endeavour.

## Tailwind CSS

As stated above, using Tailwind CSS for my styling framework was a key rationale for the rewrite.

One of the first choices I had was to decide how to use it in conjunction with React. There appears to be a wealth of libraries for managing styling in React components, much of the discourse about the various pros and cons goes over my head.

In the end, I decided to try the simplest way forward, annotate components with Tailwind utilities, and see how things go. As it turns out, this has been largely fine. I've been using [Tailwind's JIT mode](https://tailwindcss.com/docs/just-in-time-mode) since its introduction and have found it to be _superb_. Its quick, easy, and reliable.

I also use the [Typography plugin](https://github.com/tailwindlabs/tailwindcss-typography) to make the generated Markdown look pretty. I did, however, have a few customizations for this plugin:

1. Complete restyling of `inline code` blocks.
2. Adding some color to link elements.
3. Adding support for a dark mode. I largely followed [Adam Wathan's guide on GitHub](https://github.com/tailwindlabs/tailwindcss-typography/issues/69#issuecomment-752946920). (see below for more on the [Dark Mode Toggle](#dark-mode-toggle)).

You can checkout my [`tailwind.config.js`](https://github.com/jamiebrynes7/website/blob/master/tailwind.config.js) for the full details of these customizations.

## MDX & Authoring Content

Quite early on, I settled on [mdx](https://mdxjs.com/) for authoring content. This allows you to augment Markdown with React components. This brings a world of extensibility to this authoring content.

For example:

<Callout type="info">

I can have callout blocks like these. I can put **Markdown** _inside_, and it renders just fine!

</Callout>

There are a number of ways to integrate mdx into NextJS, but I broadly followed [the Tailwind's blog](https://blog.tailwindcss.com/building-the-tailwind-blog) in terms of how I reason about the content structure and the resulting configuration.

I wanted content to be stored separately from the website source:

```
content/
├─ posts/
│  ├─ a-post/
│  │  ├─ index.mdx
│  │  ├─ an-image.png
├─ projects/
src/
├─ pages/
├─ components/
```

I then utilize Webpack's [loaders](https://webpack.js.org/loaders/) and [resource queries](https://webpack.js.org/configuration/module/#ruleoneof) to load images, transform mdx, and generate page previews.

Let's breakdown how the `mdx` parsing works in my `next.config.js` file.

```js
const mdx = (opts) => {
  const common = [
    opts.defaultLoaders.babel,
    {
      loader: "@mdx-js/loader",
      options: {
        rehypePlugins: [rehypePrism],
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
```

This snippet defines two different loading rules for loading `.mdx` files.

1. The first rule is triggered if the `require` statement has a `preview` parameter in the resource query. This rule truncates the post after the first `<!--more-->` or extracts any content between `<!--excerpt--> <!--/excerpt-->` tags.

   For example:

   ```ts
   export function getPostPreviews(): PageData<PostMetadata>[] {
     return importAll(
       require.context("./../content/posts?preview", true, /\.mdx$/),
       "posts",
       parsePostMetadata
     ).sort((first, second) => second.metadata.date - first.metadata.date);
   }
   ```

2. The second rule is triggered as the fallback case. It will sanitize the post by removing any `<!--more-->` or `<!--excerpt-->` tags.

## Dark Mode Toggle

This website comes replete with a dark mode toggle (as everything should!). I had a few requirements for this:

- it should default to the user's OS preference
- the user should manually be able to toggle the theme
- if a user toggles the theme, this should be remembered

My initial attempt did this entirely within NextJS and the React framework. However, as this would execute _after_ the page load, you would get a flash if the user had it set to 'dark', either through the OS or stored preference.

My solution was to inject a small script in my [`_document.tsx`](https://nextjs.org/docs/advanced-features/custom-document) to read the initial preference and apply the theme. This is executed when the `<script>` tag is parsed in the `<body>` and thus runs before first render. This eliminates the flashing issue.

This script is as follows:

```js
if (
  localStorage.theme === "dark" ||
  (!("theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}
```

We then have a dark mode toggle in the header which applies any changes from the user.

```tsx
const DarkModeToggle: React.FC = () => {
  const [toggled, setToggled] = useState(false);

  useEffect(() => {
    if ("theme" in localStorage) {
      setToggled(localStorage.theme === "dark");
    } else {
      setToggled(
        window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
      );
    }
  }, []);

  useEffect(() => {
    if (toggled) {
      localStorage.theme = "dark";
      document.documentElement.classList.add("dark");
    } else {
      localStorage.theme = "light";
      document.documentElement.classList.remove("dark");
    }
  }, [toggled]);

  const inner = toggled ? <>...</> : <>...</>;

  return (
    <div onClick={() => setToggled(!toggled)} className="...">
      {inner}
    </div>
  );
};
```

You'll note that there is a degree of duplication between the React component and the standalone script. This isn't ideal, but as with everything in engineering, its a tradeoff. At the end of the day this is something I can live with.

## Future Work

This is only the beginning, there are more features that I would like to build for this blog.

1. Further refinement of code fence blocks. I'd like to add line numbers and language annotations to these. A cursory look didn't reveal a drop in solution here.
2. An (optional) table of contents for each blog post. This should be relatively straightforward to enumerate the headers and generate from that.

Keep an eye out for future posts detailing these features!