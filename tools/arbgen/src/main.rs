mod config;
mod highlight;
mod output;
mod scanner;
mod snippet;
mod target;
mod theme;
mod watcher;

use anyhow::{Context, Result};
use clap::Parser;
use std::path::PathBuf;

#[derive(Parser)]
#[command(name = "arbgen")]
#[command(about = "Generate syntax-highlighted HTML from .snippet files")]
struct Args {
    /// Path to config file
    #[arg(long, default_value = "./arbgen.toml")]
    config: PathBuf,

    /// Watch for changes and regenerate automatically
    #[arg(long)]
    watch: bool,
}

fn main() -> Result<()> {
    let args = Args::parse();

    let config_path = args.config.canonicalize().with_context(|| {
        format!("Failed to canonicalize config path: {}", args.config.display())
    })?;

    let config = config::Config::load(&config_path)?;

    let snippets_dir = config.snippets.target_dir.canonicalize().with_context(|| {
        format!(
            "Failed to canonicalize snippets directory: {}",
            config.snippets.target_dir.display()
        )
    })?;

    // Generate theme CSS
    theme::generate_theme_css(&config.theme)?;

    // Scan and process snippets
    scanner::scan_and_process(&snippets_dir)?;

    if args.watch {
        watcher::watch(&config_path, &snippets_dir)?;
    }

    Ok(())
}
