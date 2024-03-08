// Escape all special characters used in regular expressions
export function escapeRegexSpecialCharacters(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
