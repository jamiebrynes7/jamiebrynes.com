mod highlight;
mod output;
mod scanner;
mod snippet;
mod target;
mod watcher;

use anyhow::{Context, Result};
use clap::Parser;
use std::path::PathBuf;

#[derive(Parser)]
#[command(name = "arbgen")]
#[command(about = "Generate syntax-highlighted HTML from .snippet files")]
struct Args {
    /// Target directory to scan for .snippet files
    #[arg(long)]
    target_dir: PathBuf,

    /// Watch for changes and regenerate automatically
    #[arg(long)]
    watch: bool,
}

fn main() -> Result<()> {
    let args = Args::parse();

    let canonical_dir = args
        .target_dir
        .canonicalize()
        .with_context(|| format!("Failed to canonicalize path: {}", args.target_dir.display()))?;

    scanner::scan_and_process(&canonical_dir)?;

    if args.watch {
        watcher::watch(&canonical_dir)?;
    }

    Ok(())
}
