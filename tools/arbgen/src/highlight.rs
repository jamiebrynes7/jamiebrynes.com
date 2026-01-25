use anyhow::{Context, Result};
use arborium::Highlighter;
use std::path::Path;

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
        hl.highlight(lang, code)
            .with_context(|| format!("Failed to highlight code with language '{}'", lang))
    }
}

pub fn output_path(snippet_path: &Path) -> std::path::PathBuf {
    snippet_path.with_extension("html")
}

pub fn write_html(path: &Path, html: &str) -> Result<()> {
    std::fs::write(path, html)
        .with_context(|| format!("Failed to write HTML file: {}", path.display()))
}
