use anyhow::{Context, Result};
use notify::event::ModifyKind;
use notify::{Config, EventKind, RecommendedWatcher, RecursiveMode, Watcher};
use std::path::Path;
use std::sync::mpsc;

use crate::config;
use crate::highlight::HtmlHighlighter;
use crate::output;
use crate::scanner::{self, process_snippet, remove_html_for_snippet};
use crate::target::Target;
use crate::theme;

pub fn watch(config_path: &Path, snippets_dir: &Path) -> Result<()> {
    let highlighter = HtmlHighlighter::new();

    let (tx, rx) = mpsc::channel();

    let mut watcher =
        RecommendedWatcher::new(tx, Config::default()).context("Failed to create file watcher")?;

    // Watch snippets directory recursively
    watcher
        .watch(snippets_dir, RecursiveMode::Recursive)
        .with_context(|| format!("Failed to watch directory: {}", snippets_dir.display()))?;

    // Watch config file's parent directory non-recursively
    let config_dir = config_path
        .parent()
        .ok_or_else(|| anyhow::anyhow!("Config file has no parent directory"))?;
    watcher
        .watch(config_dir, RecursiveMode::NonRecursive)
        .with_context(|| format!("Failed to watch config directory: {}", config_dir.display()))?;

    let config_filename = config_path
        .file_name()
        .ok_or_else(|| anyhow::anyhow!("Config path has no filename"))?
        .to_os_string();

    output::watching(&[config_path, snippets_dir]);

    for result in rx {
        match result {
            Ok(event) => {
                handle_event(
                    &event,
                    config_path,
                    &config_filename,
                    snippets_dir,
                    &highlighter,
                );
            }
            Err(e) => {
                output::error("Watch error", &e.into());
            }
        }
    }

    Ok(())
}

fn handle_event(
    event: &notify::Event,
    config_path: &Path,
    config_filename: &std::ffi::OsString,
    snippets_dir: &Path,
    highlighter: &HtmlHighlighter,
) {
    // Check if this is a config file change
    let is_config_change = event
        .paths
        .iter()
        .any(|p| p.file_name().is_some_and(|f| f == config_filename));

    if is_config_change {
        match event.kind {
            EventKind::Create(_)
            | EventKind::Modify(ModifyKind::Data(_))
            | EventKind::Modify(ModifyKind::Name(_)) => {
                handle_config_change(config_path, snippets_dir);
            }
            _ => {}
        }
        return;
    }

    // Handle snippet file changes
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
                let target = Target::new(path, snippets_dir);
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
                let target = Target::new(path, snippets_dir);
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

fn handle_config_change(config_path: &Path, snippets_dir: &Path) {
    output::config_reloaded();

    match config::Config::load(config_path) {
        Ok(config) => {
            // Regenerate theme CSS
            if let Err(e) = theme::generate_theme_css(&config.theme) {
                output::error("Failed to regenerate theme", &e);
            }

            // Re-scan snippets
            if let Err(e) = scanner::scan_and_process(snippets_dir) {
                output::error("Failed to re-scan snippets", &e);
            }
        }
        Err(e) => {
            output::error("Failed to reload config", &e);
        }
    }
}
