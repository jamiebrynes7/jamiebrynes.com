---
title: "Obsidian & Todoist Plugin"
status: "active"
githubSlug: "jamiebrynes7/obsidian-todoist-plugin"
techStack:
  svelte
  typescript
---

An [Obsidian](https://obsidian.md/) plugin which allows you to materialize [Todoist](https://todoist.com/home) task queries into your notes.

<!--more-->

Todoist is task and project management software that I use extensively. Obsidian is knowledge management software which I also use to plan and track work. Rather than context switching between the two applications, I decided to write an integration between them! The plugin consumes the [Todoist REST API](https://developer.todoist.com/rest/v1/) to fetch the underlying task data and uses the [Obsidian plugin API](https://github.com/obsidianmd/obsidian-api) and Svelte to render the tasks.

For example, the following query:

```json
{
  "name": "",
  "filter": "#Obsidian x Todoist",
  "sorting": ["date", "priority"],
  "group": true
}
```

Is rendered as:

{{< figure src="./query-example.png" caption="The example rendered query" >}}

This was my first [SvelteJS](https://svelte.dev) project and I've enjoyed the brevity and simplicity of the framework. I can heartily recommend Svelte for rendering data from a remote source and offering a small amount of user interactivity. It also offers a simple API for embedding components within arbitrary DOM and animations out of the box!
