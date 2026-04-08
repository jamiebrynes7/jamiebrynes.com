use anyhow::{Context, Result};
use arborium::Highlighter;

pub struct HtmlHighlighter {
    highlighter: Highlighter,
}

const CLIPBOARD_ICON: &str = r#"<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>"#;

const FALLBACK_ICON: &str = r#"<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>"#;

fn lang_icon(lang: &str) -> String {
    let slug = match lang {
        "js" => "javascript",
        "ts" => "typescript",
        "rs" => "rust",
        _ => lang,
    };

    if let Some(icon) = simpleicons_rs::slug(slug) {
        let color = match slug {
            "rust" => "#D34516",
            _ => "",
        };
        let color = if color.is_empty() {
            format!("#{}", icon.hex)
        } else {
            color.to_string()
        };
        icon.svg.replacen(
            "<svg ",
            &format!(r#"<svg width="16" height="16" fill="{color}" "#),
            1,
        )
    } else {
        FALLBACK_ICON.to_string()
    }
}

impl HtmlHighlighter {
    pub fn new() -> Self {
        Self {
            highlighter: Highlighter::new(),
        }
    }

    pub fn highlight(&self, lang: &str, code: &str) -> Result<String> {
        let html = if lang == "plain" {
            // Skip arborium for plain text; just HTML-escape the raw content.
            code.replace('&', "&amp;")
                .replace('<', "&lt;")
                .replace('>', "&gt;")
                .replace("{{", "&#123;&#123;")
        } else {
            let mut hl = self.highlighter.fork();
            let html = hl
                .highlight(lang, code)
                .with_context(|| format!("Failed to highlight code with language '{}'", lang))?;

            // Escape `{{` so Hugo doesn't interpret it as a shortcode or template delimiter
            // when this HTML is included in a content page via the include-html shortcode.
            html.replace("{{", "&#123;&#123;")
        };

        let wrapped = wrap_lines_with_numbers(&html);
        let icon = lang_icon(lang);

        let formatted = format!(
            r#"<div class="arbgen-code not-prose" data-code-lang="{lang}"><div class="arbgen-code-toolbar"><span class="arbgen-code-lang">{icon} {lang}</span><button class="copy-button" aria-label="Copy code to clipboard" title="Copy">{CLIPBOARD_ICON}</button></div><pre><code>{wrapped}</code></pre></div>"#,
        );

        Ok(formatted)
    }
}

/// Wraps each line of highlighted HTML with line number spans.
///
/// Transforms HTML like:
///   `<span class="kw">fn</span> main() {\n    ...\n}`
/// Into:
///   `<span class="line"><span class="ln"></span><span class="lc">...</span></span>`
///
/// Handles HTML tags spanning multiple lines by closing and reopening them at line boundaries.
fn wrap_lines_with_numbers(html: &str) -> String {
    let lines: Vec<&str> = html.split('\n').collect();
    let mut result = String::new();
    let mut open_tags: Vec<String> = Vec::new();

    for line in lines {
        result.push_str(r#"<span class="line"><span class="ln"></span><span class="lc">"#);

        // Reopen any tags that were open from the previous line
        for tag in &open_tags {
            result.push_str(tag);
        }

        // Process the line character by character to track tags
        let mut i = 0;
        let chars: Vec<char> = line.chars().collect();

        while i < chars.len() {
            if chars[i] == '<' {
                // Find the end of this tag
                let tag_start = i;
                while i < chars.len() && chars[i] != '>' {
                    i += 1;
                }
                if i < chars.len() {
                    i += 1; // Include the '>'
                }

                let tag: String = chars[tag_start..i].iter().collect();
                result.push_str(&tag);

                // Track opening and closing tags
                if tag.starts_with("</") {
                    // Closing tag - remove the most recent matching opening tag
                    if let Some(tag_name) = extract_tag_name(&tag) {
                        // Find and remove the matching opening tag from the stack
                        for j in (0..open_tags.len()).rev() {
                            if let Some(open_name) = extract_tag_name(&open_tags[j]) {
                                if open_name == tag_name {
                                    open_tags.remove(j);
                                    break;
                                }
                            }
                        }
                    }
                } else if !tag.starts_with("<!") && !tag.ends_with("/>") {
                    // Opening tag (not a comment or self-closing)
                    open_tags.push(tag);
                }
            } else {
                result.push(chars[i]);
                i += 1;
            }
        }

        // Close any tags that are still open at the end of this line
        for tag in open_tags.iter().rev() {
            if let Some(tag_name) = extract_tag_name(tag) {
                result.push_str(&format!("</{}>", tag_name));
            }
        }

        result.push_str("</span></span>");
    }

    result
}

/// Extracts the tag name from an HTML tag string.
/// e.g., `<span class="foo">` -> "span", `</div>` -> "div"
fn extract_tag_name(tag: &str) -> Option<&str> {
    let tag = tag.trim_start_matches('<').trim_start_matches('/');
    let tag = tag.trim_end_matches('>').trim_end_matches('/');

    // Tag name ends at first whitespace or end of string
    tag.split_whitespace().next()
}
