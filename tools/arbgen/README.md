# Arbgen

Arbgen is a CLI tool that uses [Arborium](https://arborium.bearcove.eu/) to pre-process code snippets into HTML fragments for inclusion in a Hugo page.

## Usage

```bash
# Recursively scan ${path} for fragments and generate HTML from them
arbgen snippets --target-dir=${path}

# As above, but will watch for file changes and regenerate the affected files.
arbgen snippets --target-dir=${path} --watch

arbgen theme --light=${theme} --dark=${theme} --out=${output_path}
```

## Snippet Reference

`arbgen` looks for files with an extension of `.snippet`. These files are expected to be like this:

```
---
lang: ts
---
const something: string = "foobar";
console.log(something);
```

The YAML frontmatter supports the following keys:

- `lang`: the language of the snippet

For a given `file.snippet`, `arbgen` should generate `file.gen.html`.
