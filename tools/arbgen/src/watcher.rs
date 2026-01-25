use anyhow::{Context, Result};
use notify::{Config, RecommendedWatcher, RecursiveMode, Watcher, EventKind};
use std::path::Path;
use std::sync::mpsc;

use crate::highlight::HtmlHighlighter;
use crate::scanner::{process_snippet, remove_html_for_snippet};

pub fn watch(target_dir: &Path) -> Result<()> {
    let highlighter = HtmlHighlighter::new();
    let canonical_dir = target_dir
        .canonicalize()
        .with_context(|| format!("Failed to canonicalize path: {}", target_dir.display()))?;

    let (tx, rx) = mpsc::channel();

    let mut watcher = RecommendedWatcher::new(tx, Config::default())
        .context("Failed to create file watcher")?;

    watcher
        .watch(target_dir, RecursiveMode::Recursive)
        .with_context(|| format!("Failed to watch directory: {}", target_dir.display()))?;

    println!("Watching for changes in: {}", canonical_dir.display());
    println!("Press Ctrl+C to stop.");

    for result in rx {
        match result {
            Ok(event) => {
                handle_event(&event, target_dir, &highlighter);
            }
            Err(e) => {
                eprintln!("Watch error: {}", e);
            }
        }
    }

    Ok(())
}

fn handle_event(event: &notify::Event, target_dir: &Path, highlighter: &HtmlHighlighter) {
    let snippet_paths: Vec<_> = event
        .paths
        .iter()
        .filter(|p| p.extension().is_some_and(|ext| ext == "snippet"))
        .collect();

    if snippet_paths.is_empty() {
        return;
    }

    match event.kind {
        EventKind::Create(_) | EventKind::Modify(_) => {
            for path in snippet_paths {
                if let Err(e) = process_snippet(path, target_dir, highlighter) {
                    let relative = path.strip_prefix(target_dir).unwrap_or(path);
                    eprintln!("Error processing {}: {}", relative.display(), e);
                }
            }
        }
        EventKind::Remove(_) => {
            for path in snippet_paths {
                if let Err(e) = remove_html_for_snippet(path, target_dir) {
                    let relative = path.strip_prefix(target_dir).unwrap_or(path);
                    eprintln!("Error removing HTML for {}: {}", relative.display(), e);
                }
            }
        }
        _ => {}
    }
}
