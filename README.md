<div align="center">
  <img src="./static/imgs/website.png" width="300" />

  <h1>Personal website</h1>

  <p>
    <strong>The source & content for my <a href="https://jamiebrynes.com">personal website</a>.</strong>
  </p>

  <p>
    <img alt="Netlify deploy status" src="https://api.netlify.com/api/v1/badges/af1f3486-98da-4b30-a5a9-680e656c709c/deploy-status"/>
    <img alt="Blog build status" src="https://github.com/jamiebrynes7/website/workflows/Check%20blog%20posts/badge.svg"/>
    <img alt="Kudos please build status" src="https://github.com/jamiebrynes7/website/workflows/Build%20Kudos%20Please/badge.svg"/>
  </p>
</div>

This website is built using the [Zola](http://getzola.org) static site generator and styled using the [Bulma](https://bulma.io/) CSS framework.

__Feel free to fork the repository to use it as a reference for your own website!__

## 🚀 Quick start

First, clone the repository:

```
$ git clone git@github.com:jamiebrynes7/personal-website.git
```

Then to build and serve the website (requires Docker):

```
$ ./runner.sh serve
```

## 🧐 What's inside?

This site is built using the [Zola](http://getzola.org) static site generator. 

- `content/` contains the Markdown content of the website & blog
- `js/` contains the _un-minified_ Javascript source of the blog.
- `kudos/` contains the Rust source code for the backend of the [Kudos Please](https://www.jamiebrynes.com/blog/kudos-please/) feature
- `sass/` contains the style of the website
- `templates/` contains the templated HTML that underpin the website
- `vedor/` contains the [Bulma](https://bulma.io/) SASS source

It also has a small `runner.sh` script for running common jobs (its only tested on Git Bash for Windows, your mileage may vary!).
