use owo_colors::OwoColorize;
use std::path::Path;

pub fn processing(path: &Path) {
    println!("{} {}", "⚙".cyan(), path.display());
}

pub fn generated(path: &Path) {
    println!("  {} {}", "✓".green(), path.display());
}

pub fn removed(path: &Path) {
    println!("{} {}", "✗".yellow(), path.display());
}

pub fn start(message: &str) {
    println!("{}", message.bold().cyan());
}

pub fn finish(message: &str) {
    println!("{}", message.bold().green());
}

pub fn watching(path: &Path) {
    println!("{} {}", "Watching".yellow().bold(), path.display());
    println!("  Press {} to stop", "Ctrl+C".dimmed());
}

pub fn error(context: &str, err: &anyhow::Error) {
    eprintln!("{} {}: {}", "✗".red(), context.red(), err);
}
