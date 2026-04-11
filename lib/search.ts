/**
 * Build a PostgreSQL FTS query from a search string
 * Handles multiple search terms with OR logic
 */
export function buildTsQuery(searchTerm: string): string {
  if (!searchTerm.trim()) {
    return "";
  }

  // Split by spaces and filter empty strings
  const terms = searchTerm
    .trim()
    .split(/\s+/)
    .filter((t) => t.length > 0);

  // Join with OR operator for PostgreSQL FTS
  return terms.map((term) => `${term}:*`).join(" | ");
}

/**
 * Extract and highlight search snippet from content
 * Returns a snippet around the first match with context
 */
export function highlightSnippet(
  content: string,
  searchTerm: string,
  contextLength: number = 50
): string {
  if (!searchTerm.trim() || !content) {
    return content.substring(0, contextLength * 2);
  }

  const lowerContent = content.toLowerCase();
  const lowerTerm = searchTerm.toLowerCase();
  const index = lowerContent.indexOf(lowerTerm);

  if (index === -1) {
    return content.substring(0, contextLength * 2) + "...";
  }

  const start = Math.max(0, index - contextLength);
  const end = Math.min(content.length, index + searchTerm.length + contextLength);

  let snippet = content.substring(start, end);

  if (start > 0) {
    snippet = "..." + snippet;
  }
  if (end < content.length) {
    snippet = snippet + "...";
  }

  // Highlight the search term
  const highlighted = snippet.replace(
    new RegExp(`(${searchTerm})`, "gi"),
    "<mark>$1</mark>"
  );

  return highlighted;
}

/**
 * Parse search results with highlighting
 */
export function parseSearchResults(
  results: Array<{ snippet?: string; content?: string }>,
  searchTerm: string
) {
  return results.map((result) => ({
    ...result,
    snippet:
      result.snippet ||
      highlightSnippet(result.content || "", searchTerm),
  }));
}
