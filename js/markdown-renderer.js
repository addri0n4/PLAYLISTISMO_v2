
/**
 * Simple regex-based Markdown to HTML parser.
 * Note: For production apps, use a library like marked or markdown-it.
 * @param {string} text - Raw markdown text.
 * @returns {string} - HTML string.
 */
export function renderMarkdown(text) {
  if (!text) return '';
  
  let html = text
    // Encode HTML entities (Basic XSS protection)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // Headers
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    // Blockquotes
    .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
    // Bold
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/__(.*)__/gim, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/_(.*)_/gim, '<em>$1</em>')
    // Code blocks (triple backticks)
    .replace(/```([^`]+)```/gim, '<pre><code>$1</code></pre>')
    // Inline code (single backtick)
    .replace(/`([^`]+)`/gim, '<code>$1</code>')
    // Unordered Lists
    .replace(/^\s*-\s+(.*$)/gim, '<li>$1</li>')
    // Line breaks (convert newlines to <br> if not in pre/list tags mostly)
    .replace(/\n/gim, '<br />');
    
  // Cleanup artifacts from regex replacements
  // Remove <br> immediately following block closing tags to avoid extra spacing
  html = html.replace(/<\/h1><br \/>/g, '</h1>');
  html = html.replace(/<\/h2><br \/>/g, '</h2>');
  html = html.replace(/<\/h3><br \/>/g, '</h3>');
  html = html.replace(/<\/pre><br \/>/g, '</pre>');
  html = html.replace(/<\/blockquote><br \/>/g, '</blockquote>');
  
  return html;
}
