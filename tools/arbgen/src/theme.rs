use anyhow::{Context, Result};
use std::path::Path;

use crate::output;

pub fn generate_theme_css(light: &str, dark: &str, out: &Path) -> Result<()> {
    let themes = arborium::theme::builtin::all();

    let light_theme = themes
        .iter()
        .find(|t| t.name == light)
        .ok_or_else(|| anyhow::anyhow!("Light theme '{}' not found", light))?;

    let dark_theme = themes
        .iter()
        .find(|t| t.name == dark)
        .ok_or_else(|| anyhow::anyhow!("Dark theme '{}' not found", dark))?;

    output::start("Generating theme CSS...");

    let light_css = light_theme.to_css(".arbgen-code");
    let dark_css = dark_theme.to_css(".dark .arbgen-code");

    let combined = format!("{}\n{}", light_css, dark_css);

    std::fs::write(out, combined)
        .with_context(|| format!("Failed to write theme CSS to {}", out.display()))?;

    output::generated(out);

    Ok(())
}
