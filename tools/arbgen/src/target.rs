use std::path::{Path, PathBuf};

use anyhow::{Context, Result};

pub struct Target<'a> {
    path: &'a Path,
    target_dir: PathBuf,
}

impl<'a> Target<'a> {
    pub fn new<'b>(path: &'a Path, target_dir: &'b Path) -> Self {
        Self {
            path,
            target_dir: target_dir.to_path_buf(),
        }
    }

    pub fn path(&self) -> &Path {
        self.path
    }

    pub fn relative_path(&self) -> &Path {
        self.path
            .strip_prefix(&self.target_dir)
            .unwrap_or(self.path)
    }

    pub fn output_path(&self) -> PathBuf {
        self.path.with_extension("gen.html")
    }

    pub fn output_relative_path(&self) -> PathBuf {
        let output_path = self.output_path();
        output_path
            .strip_prefix(&self.target_dir)
            .map(|p| p.to_path_buf())
            .unwrap_or(output_path)
    }

    pub fn write_html(&self, html: &str) -> Result<()> {
        let out_path = self.output_path();
        std::fs::write(&out_path, html)
            .with_context(|| format!("Failed to write HTML file: {}", out_path.display()))
    }
}
