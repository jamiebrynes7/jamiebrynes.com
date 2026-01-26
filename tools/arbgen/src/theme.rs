use anyhow::{Context, Result};

use crate::config::ThemeConfig;
use crate::output;

pub fn generate_theme_css(config: &ThemeConfig) -> Result<()> {
    let themes = arborium::theme::builtin::all();

    let light_theme = themes
        .iter()
        .find(|t| t.name == config.light)
        .ok_or_else(|| anyhow::anyhow!("Light theme '{}' not found", config.light))?;

    let dark_theme = themes
        .iter()
        .find(|t| t.name == config.dark)
        .ok_or_else(|| anyhow::anyhow!("Dark theme '{}' not found", config.dark))?;

    output::start("Generating theme CSS...");

    let light_css = light_theme.to_css(".arbgen-code");
    let dark_css = dark_theme.to_css(".dark .arbgen-code");

    let combined = format!("{}\n{}", light_css, dark_css);

    std::fs::write(&config.output, combined)
        .with_context(|| format!("Failed to write theme CSS to {}", config.output.display()))?;

    output::generated(&config.output);

    Ok(())
}
