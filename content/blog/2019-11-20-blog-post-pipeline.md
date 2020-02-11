+++
title = "GitHub Actions & This"
description = "Applying development practices to my personal website."

[taxonomies]
tags = ["website"]
+++

I'm a fan of development methodologies like [continuous integration](https://en.wikipedia.org/wiki/Continuous_integration), [continuous delivery](https://en.wikipedia.org/wiki/Continuous_delivery), and static analysis tools. They allow you to maintain quality in the software you build by automating many of the checks that you might do manually otherwise. This benefit is twofold: it removes the human element from the checks and removes cognitive overhead of running the checks yourself.

<!-- more -->

After setting up this website, I thought: **why couldn't I do the same for website**? 

At the time, I had recently gained access to the [GitHub Actions](https://github.com/features/actions) beta. This website seemed like a perfect opportunity to test out GitHub Actions.

{% callout(type="info") %}
GitHub Actions is built-in workflow automation for GitHub repositories. Checkout [GitHub's documentation](https://github.com/features/actions) for more info.
{% end %}

There were a few merge gates that immediately came to mind: 

**1. Run a website build.**

The first stop. Run a build of this website through Zola and make sure it succeeds.

```
$ zola build
```

**2. Spellcheck my blog posts.**

I write my blog posts in Visual Studio Code, as they in Markdown (and some shortcodes) and I don't use a content management system (CMS). VS Code has some spellchecking functionality built-in, but I want to enforce that I can't release a blog post if there are spelling errors.

```
$ cd content/blog && spellchecker *.md --language en-GB --dictionary ci/dictionary
```

**3. Run Stylelint.** 

I end up editing a fair bit of SCSS manually when I tweak the look and feel of my website. I run [Stylelint](https://github.com/stylelint/stylelint) so I can keep my SCSS looking consistent and adhering to best practices.

```
$ stylelint sass/*.scss
```

**4. Build Kudos Please.**

The [Kudos Please](/blog/kudos-please) feature requires a Rust AWS Lambda. If I'm making changes to these files I want to lint, build, and test this Rust lambda as a merge gate.

```
$ cargo fmt && cargo build && cargo test
```


{% callout(type="info") %}
You can find the source for all of these actions in [this website's repository](https://github.com/jamiebrynes7/website/tree/master/.github/actions).
{% end %}

## Setting up GitHub Actions

There are a few options for writing and/or consuming actions. You can:

1. Reference an existing action. An example of this is `actions/checkout@v1` which will checkout the Git reference that triggered the action.
2. Write an action using Javascript/Typescript.
3. Write an action that runs in a Docker container.

As you'll see in the section [below](#setting-up-a-local-workflow), one of my requirements is that I can run all these checks locally too. For that reason, I tended to gravitate toward writing my actions to run in Docker containers. 

GitHub Actions are grouped into workflows and jobs. A workflow runs one or more jobs and a job runs one or more actions. I run two workflows as merge gates:

1. [Website checks](https://github.com/jamiebrynes7/website/blob/master/.github/workflows/post-checks.yml). Build the website, spellcheck the blog posts, and lint the SCSS.
2. [Kudos checks](https://github.com/jamiebrynes7/website/blob/master/.github/workflows/kudos-integration.yml). Build, lint, and test the Rust program.

---

Let's walk through one of the actions I run on this blog: `spellcheck`.

This action consists of three main parts: 

* The `action.yml` definition file. This is a declarative file which describes the action and how it runs.

```yaml
name: 'Spellcheck'
description: 'Spellcheck markdown files'
author: 'Jamie Brynes'
runs: 
    using: 'docker'
    image: 'Dockerfile'
```

* The `Dockerfile`. Since I'm using Docker, the action needs a container to build and run.

```dockerfile
FROM node:latest

WORKDIR /home/node
RUN ["npm", "install", "-g", "spellchecker-cli"]

COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
```

* The `entrypoint.sh` script reference in the `Dockerfile` above. This executes when the action runs.

```bash
#!/bin/bash

set -e -u -o pipefail

if [[ -z "${GITHUB_WORKSPACE}" ]]; then
    echo "Set the GITHUB_WORKSPACE env variable."
    exit 1
fi

cd "${GITHUB_WORKSPACE}"

# Omitted: Strip front end matter before spellchecking.
# Involves copying into the temp directory.

pushd "${TMP_DIR}" > /dev/null
spellchecker \
    -f "./*.md" "!1970-01-01-mkdown-test.md" "!_index.md" \
    -l en-GB \
    -d "${GITHUB_WORKSPACE}/ci/dictionary"
popd > /dev/null
```

{% callout(type="info") %}
You can find the source for this action in [this website's repository](https://github.com/jamiebrynes7/website/tree/master/.github/actions/spellcheck).
{% end %}

## A local workflow

Since my actions are containerised, I can build and run the container to run that action. If you peek at the `entrypoint.sh` scripts for any of my actions (like above!), you'll notice they rely on the `$GITHUB_WORKSPACE` environment variable. When an action runs in the cloud, this environment variable is set to the directory that contains your project (which is mounted into your container).

This can be replicated locally:

```
$ docker run --rm -v $(pwd):/github/ -e GITHUB_WORKSPACE="/github" spellcheck:latest
```
These are now wrapped up into a nice [Makefile](https://github.com/jamiebrynes7/website/blob/master/Makefile) such that to spellcheck my blog posts, I just run: 

```
$ make spellcheck
```

The Makefile handles building and running the Docker container. For example: 

```make
CWD=$(shell pwd)

.PHONY: spellcheck spellcheck-docker

spellcheck: spellcheck-docker
	docker run --rm -v /$(CWD):/github/ -e GITHUB_WORKSPACE="//github" spellcheck:latest

spellcheck-docker:
	docker build --file ./.github/actions/spellcheck/Dockerfile --tag spellcheck:latest ./.github/actions/spellcheck
```

{% callout(type="info") %}
You'll notice some oddities in the Makefile above, like escaping the leading slashes (e.g. - `//github`). This is due to a foible of Git Bash on Windows. 

If the leading slash _isn't_ escaped this resolves to `${PATH_TO_GIT_BASH}/github`. 🙃
{% end %}

## Future actions

The actions listed above are just the actions that I've implemented so far. There are already a few extra ones on my backlog: 

- Maximum image size. This will stop me from accidentally serving images that are above a certain size. No one likes downloading a huge image when browsing a website.
- Link checking. This could be an action that would run periodically. Any old links that are broken would get flagged up.
