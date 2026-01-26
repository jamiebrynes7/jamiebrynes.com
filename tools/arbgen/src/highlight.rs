use anyhow::{Context, Result};
use arborium::Highlighter;

pub struct HtmlHighlighter {
    highlighter: Highlighter,
}

impl HtmlHighlighter {
    pub fn new() -> Self {
        Self {
            highlighter: Highlighter::new(),
        }
    }

    pub fn highlight(&self, lang: &str, code: &str) -> Result<String> {
        let mut hl = self.highlighter.fork();
        let html = hl
            .highlight(lang, code)
            .with_context(|| format!("Failed to highlight code with language '{}'", lang))?;

        let wrapped = wrap_lines_with_numbers(&html);

        let formatted = format!(
            r#"<pre class="arbgen-code not-prose" data-code-lang="{}"><code>{}</code></pre>"#,
            lang, wrapped
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
