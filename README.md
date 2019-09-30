# Personal website

[![Netlify Status](https://api.netlify.com/api/v1/badges/af1f3486-98da-4b30-a5a9-680e656c709c/deploy-status)](https://app.netlify.com/sites/optimistic-edison-23360f/deploys) ![](https://github.com/jamiebrynes7/website/workflows/Build%20Kudos%20Please/badge.svg) ![](https://github.com/jamiebrynes7/website/workflows/Check%20blog%20posts/badge.svg)

This repository contains the source code for [my personal website](https://jamiebrynes.com). This website is built with [Zola](http://getzola.org) and styled using the [Bulma framework](https://bulma.io/).

<p align="center">
  <img src="./static/imgs/website.png">
</p>

## Directory structure

* The root of this repository _is_ the Zola project. 
* The source for the [backend of the "Kudos Please" feature](https://www.jamiebrynes.com/blog/kudos-please/) is in the [kudos directory](./kudos).

## Building the website

This repository comes with a Makefile for building and serving this website locally. This relies on Docker:

* `make serve` - Serve the website locally at `0.0.0.0:1111`
* `make build` - Build the website
* `make lint` - Checks blog posts for spelling mistakes.