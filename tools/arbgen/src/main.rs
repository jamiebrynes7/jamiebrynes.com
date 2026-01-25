mod highlight;
mod scanner;
mod snippet;
mod watcher;

use anyhow::Result;
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

    // Initial scan and process
    scanner::scan_and_process(&args.target_dir)?;

    if args.watch {
        watcher::watch(&args.target_dir)?;
    }

    Ok(())
}
