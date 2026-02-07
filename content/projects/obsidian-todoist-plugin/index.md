---
title: "Obsidian & Todoist Plugin"
status: "active"
githubSlug: "jamiebrynes7/obsidian-todoist-plugin"
description: "An [Obsidian](https://obsidian.md/) plugin that materializes [Todoist](https://todoist.com/home) task queries in your notes."
techStack:
  - React
  - Typescript
---

I use [Todoist](https://todoist.com/home) for task management and [Obsidian](https://obsidian.md/) for knowledge management. Rather than context switching between the two, I built an integration. The plugin consumes the [Todoist REST API](https://developer.todoist.com/api/v1/) to fetch task data and uses the [Obsidian plugin API](https://github.com/obsidianmd/obsidian-api) with React to render them.

I've maintained this plugin since 2020, shipped 30+ releases, and amassed 150,000+ downloads across all versions. You can read more about the plugin, its functionality, and how to use it in the [official docs](https://jamiebrynes7.github.io/obsidian-todoist-plugin/docs/overview).

For example, the following query:

{{< include-html "example.gen.html" >}}

Produces the following result:

{{< figure src="./example-query-result.png" caption="The example rendered query" >}}
