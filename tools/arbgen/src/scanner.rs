use anyhow::{Context, Result};
use std::path::Path;
use walkdir::WalkDir;

use crate::highlight::HtmlHighlighter;
use crate::output;
use crate::snippet::parse_snippet;
use crate::target::Target;

pub fn scan_and_process(target_dir: &Path) -> Result<()> {
    output::start("Scanning for .snippet files...");

    let highlighter = HtmlHighlighter::new();

    for entry in WalkDir::new(target_dir)
        .into_iter()
        .filter_map(|e| e.ok())
        .filter(|e| e.path().extension().is_some_and(|ext| ext == "snippet"))
    {
        let target = Target::new(entry.path(), target_dir);
        process_snippet(&target, &highlighter)?;
    }

    output::finish("Finished processing .snippet files");

    Ok(())
}

pub fn process_snippet(target: &Target<'_>, highlighter: &HtmlHighlighter) -> Result<()> {
    output::processing(target.relative_path());

    let snippet = parse_snippet(target.path())?;
    let html = highlighter.highlight(&snippet.frontmatter.lang, &snippet.code)?;

    target.write_html(&html)?;
    output::generated(&target.output_relative_path());
    Ok(())
}

pub fn remove_html_for_snippet(target: &Target<'_>) -> Result<()> {
    let html_path = target.output_path();
    if !html_path.exists() {
        return Ok(());
    }

    std::fs::remove_file(&html_path)
        .with_context(|| format!("Failed to remove HTML file: {}", html_path.display()))?;
    output::removed(&target.output_relative_path());

    Ok(())
}
