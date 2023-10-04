---
title: Website Version... 4?
date: "2023-09-28"
tags:
  - "@projects/personal-website"
---

This website is written with [Hugo](https://gohugo.io), a static site generator, and styled with [TailwindCSS](https://tailwindcss.com/). Up until recently, I had been using [NextJS](https://nextjs.org/) as my framework, but a few things led to this decision.

<!--more-->

### 1. Simplicity

A key driver for the change was my desire for simplicity. I don't update this website frequently, or at least, less frequently than I'd like to. As a result, when I've come back to it and try to do updates it was a struggle to manage all the breaking changes in the NPM ecosystem. Whereas with a tool more straightforward like Hugo, the scope for churn is much lower.

HTML templates & Markdown go in, website comes out!

This extends into the tooling as well. On top of Hugo, I only have the [Tailwind standalone CLI](https://tailwindcss.com/blog/standalone-cli) which suffices for my needs.  That mean my build environment is very simple: two binaries and that's it. No `package.json`, no `node_modules`, just bliss.

### 2. Speed

The other side of the equation is speed, or vanity metrics. I had no real need for NextJS, I didn't use any fancy features, and I certainly wasn't interested in the newer hybrid modes of rendering. The static generation mode of NextJS worked well enough, but it still ended up sending 100s of KBs down the wire to render a static page. Why? There's no need.

---

Perhaps this will renew my interest in developing this website? Perhaps not - but it was a fun exercise in any case!
