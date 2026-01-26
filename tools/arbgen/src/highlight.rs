use anyhow::{Context, Result};
use arborium::Highlighter;

pub struct HtmlHighlighter {
    highlighter: Highlighter,
}

impl HtmlHighlighter {
    pub fn new() -> Self {
        Self {
            highlighter: Highlighter::new(),
        }
    }

    pub fn highlight(&self, lang: &str, code: &str) -> Result<String> {
        let mut hl = self.highlighter.fork();
        let html = hl
            .highlight(lang, code)
            .with_context(|| format!("Failed to highlight code with language '{}'", lang))?;

        let formatted = format!(
            r#"<pre class="arbgen-code not-prose" data-code-lang="{}"><code>{}</code></pre>"#,
            lang, html
        );

        Ok(formatted)
    }
}
