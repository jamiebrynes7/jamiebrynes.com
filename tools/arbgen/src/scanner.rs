use anyhow::{Context, Result};
use std::path::Path;
use walkdir::WalkDir;

use crate::highlight::{HtmlHighlighter, output_path, write_html};
use crate::snippet::parse_snippet;

pub fn scan_and_process(target_dir: &Path) -> Result<()> {
    let highlighter = HtmlHighlighter::new();

    for entry in WalkDir::new(target_dir)
        .into_iter()
        .filter_map(|e| e.ok())
        .filter(|e| e.path().extension().is_some_and(|ext| ext == "snippet"))
    {
        process_snippet(entry.path(), target_dir, &highlighter)?;
    }

    Ok(())
}

pub fn process_snippet(path: &Path, target_dir: &Path, highlighter: &HtmlHighlighter) -> Result<()> {
    let relative_path = path.strip_prefix(target_dir).unwrap_or(path);
    println!("Processing: {}", relative_path.display());

    let snippet = parse_snippet(path)?;
    let html = highlighter.highlight(&snippet.frontmatter.lang, &snippet.code)?;

    let out_path = output_path(path);
    write_html(&out_path, &html)?;

    let relative_out = out_path.strip_prefix(target_dir).unwrap_or(&out_path);
    println!("  -> {}", relative_out.display());
    Ok(())
}

pub fn remove_html_for_snippet(snippet_path: &Path, target_dir: &Path) -> Result<()> {
    let html_path = output_path(snippet_path);
    if html_path.exists() {
        std::fs::remove_file(&html_path)
            .with_context(|| format!("Failed to remove HTML file: {}", html_path.display()))?;
        let relative_path = html_path.strip_prefix(target_dir).unwrap_or(&html_path);
        println!("Removed: {}", relative_path.display());
    }
    Ok(())
}
