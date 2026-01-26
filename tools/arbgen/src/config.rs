use anyhow::{Context, Result};
use serde::Deserialize;
use std::path::{Path, PathBuf};

#[derive(Debug, Deserialize)]
pub struct Config {
    pub snippets: SnippetsConfig,
    pub theme: ThemeConfig,
}

#[derive(Debug, Deserialize)]
pub struct SnippetsConfig {
    pub target_dir: PathBuf,
}

#[derive(Debug, Deserialize)]
pub struct ThemeConfig {
    pub light: String,
    pub dark: String,
    pub output: PathBuf,
}

impl Config {
    pub fn load(path: &Path) -> Result<Self> {
        let content = std::fs::read_to_string(path)
            .with_context(|| format!("Failed to read config file: {}", path.display()))?;

        let mut config: Config = toml::from_str(&content)
            .with_context(|| format!("Failed to parse config file: {}", path.display()))?;

        // Resolve relative paths against the config file's directory
        let config_dir = path
            .parent()
            .ok_or_else(|| anyhow::anyhow!("Config file has no parent directory"))?;

        config.snippets.target_dir = resolve_path(config_dir, &config.snippets.target_dir);
        config.theme.output = resolve_path(config_dir, &config.theme.output);

        Ok(config)
    }
}

fn resolve_path(base: &Path, path: &Path) -> PathBuf {
    if path.is_absolute() {
        path.to_path_buf()
    } else {
        base.join(path)
    }
}
