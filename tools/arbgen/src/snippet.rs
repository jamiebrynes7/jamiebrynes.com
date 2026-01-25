use anyhow::{Context, Result, bail};
use serde::Deserialize;
use std::path::Path;

#[derive(Debug, Deserialize)]
pub struct Frontmatter {
    pub lang: String,
}

pub struct Snippet {
    pub frontmatter: Frontmatter,
    pub code: String,
}

pub fn parse_snippet(path: &Path) -> Result<Snippet> {
    let content = std::fs::read_to_string(path)
        .with_context(|| format!("Failed to read snippet file: {}", path.display()))?;

    parse_snippet_content(&content)
        .with_context(|| format!("Failed to parse snippet file: {}", path.display()))
}

fn parse_snippet_content(content: &str) -> Result<Snippet> {
    let content = content.trim();

    if !content.starts_with("---") {
        bail!("Snippet must start with '---' frontmatter delimiter");
    }

    let after_first_delimiter = &content[3..];
    let end_delimiter_pos = after_first_delimiter
        .find("---")
        .context("Missing closing '---' frontmatter delimiter")?;

    let frontmatter_str = &after_first_delimiter[..end_delimiter_pos].trim();
    let code = after_first_delimiter[end_delimiter_pos + 3..].trim();

    let frontmatter: Frontmatter = serde_yaml::from_str(frontmatter_str)
        .context("Failed to parse frontmatter YAML")?;

    Ok(Snippet {
        frontmatter,
        code: code.to_string(),
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_snippet() {
        let content = r#"---
lang: typescript
---
const x: number = 42;
"#;
        let snippet = parse_snippet_content(content).unwrap();
        assert_eq!(snippet.frontmatter.lang, "typescript");
        assert_eq!(snippet.code, "const x: number = 42;");
    }

    #[test]
    fn test_missing_start_delimiter() {
        let content = "lang: typescript\n---\ncode";
        assert!(parse_snippet_content(content).is_err());
    }

    #[test]
    fn test_missing_end_delimiter() {
        let content = "---\nlang: typescript\ncode";
        assert!(parse_snippet_content(content).is_err());
    }
}
