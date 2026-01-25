mod highlight;
mod output;
mod scanner;
mod snippet;
mod target;
mod theme;
mod watcher;

use anyhow::{Context, Result};
use clap::{Parser, Subcommand};
use std::path::PathBuf;

#[derive(Parser)]
#[command(name = "arbgen")]
#[command(about = "Generate syntax-highlighted HTML from .snippet files")]
struct Args {
    #[command(subcommand)]
    command: Command,
}

#[derive(Subcommand)]
enum Command {
    /// Scan for .snippet files and generate syntax-highlighted HTML
    Snippets {
        /// Target directory to scan for .snippet files
        #[arg(long)]
        target_dir: PathBuf,

        /// Watch for changes and regenerate automatically
        #[arg(long)]
        watch: bool,
    },
    /// Generate theme CSS files
    Theme {
        /// Light theme name
        #[arg(long)]
        light: String,

        /// Dark theme name
        #[arg(long)]
        dark: String,

        /// Output file path
        #[arg(long)]
        out: PathBuf,
    },
}

fn main() -> Result<()> {
    let args = Args::parse();

    match args.command {
        Command::Snippets { target_dir, watch } => {
            let canonical_dir = target_dir.canonicalize().with_context(|| {
                format!("Failed to canonicalize path: {}", target_dir.display())
            })?;

            scanner::scan_and_process(&canonical_dir)?;

            if watch {
                watcher::watch(&canonical_dir)?;
            }
        }
        Command::Theme { light, dark, out } => {
            theme::generate_theme_css(&light, &dark, &out)?;
        }
    }

    Ok(())
}
