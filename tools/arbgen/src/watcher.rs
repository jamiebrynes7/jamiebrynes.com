use anyhow::{Context, Result};
use notify::event::ModifyKind;
use notify::{Config, EventKind, RecommendedWatcher, RecursiveMode, Watcher};
use std::path::Path;
use std::sync::mpsc;

use crate::highlight::HtmlHighlighter;
use crate::output;
use crate::scanner::{process_snippet, remove_html_for_snippet};
use crate::target::Target;

pub fn watch(target_dir: &Path) -> Result<()> {
    let highlighter = HtmlHighlighter::new();

    let (tx, rx) = mpsc::channel();

    let mut watcher =
        RecommendedWatcher::new(tx, Config::default()).context("Failed to create file watcher")?;

    watcher
        .watch(target_dir, RecursiveMode::Recursive)
        .with_context(|| format!("Failed to watch directory: {}", target_dir.display()))?;

    output::watching(&target_dir);

    for result in rx {
        match result {
            Ok(event) => {
                handle_event(&event, &target_dir, &highlighter);
            }
            Err(e) => {
                output::error("Watch error", &e.into());
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
        EventKind::Create(_)
        | EventKind::Modify(ModifyKind::Data(_))
        | EventKind::Modify(ModifyKind::Name(_)) => {
            for path in snippet_paths {
                let target = Target::new(path, target_dir);
                if let Err(e) = process_snippet(&target, highlighter) {
                    output::error(
                        &format!("Failed to process {}", target.relative_path().display()),
                        &e,
                    );
                }
            }
        }
        EventKind::Remove(_) => {
            for path in snippet_paths {
                let target = Target::new(path, target_dir);
                if let Err(e) = remove_html_for_snippet(&target) {
                    output::error(
                        &format!("Failed to remove {}", target.relative_path().display()),
                        &e,
                    );
                }
            }
        }
        _ => {}
    }
}
