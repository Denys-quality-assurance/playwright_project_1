/*
 * This configuration file establishes the rules for Prettier.
 * Prettier automatically enforces a consistent code style in your project.
 *
 * The main purpose of the file is to override the default Prettier
 * options for this specific project.
 *
 * By including this Prettier configuration in our project, we
 * ensure that all code is formatted consistently.
 */

module.exports = {
  arrowParens: 'always', // Include parens around a single arrow function parameter
  bracketSpacing: true, // Print spaces between brackets in object literals
  embeddedLanguageFormatting: 'auto', // Controls how Prettier formats embedded code
  endOfLine: 'auto', // Enforce use of Linux end of line
  htmlWhitespaceSensitivity: 'css', // Adjusts how HTML whitespace is handled
  printWidth: 80, // Specify the line length that the printer will wrap on
  proseWrap: 'preserve', // Controls how prose blocks should be wrapped in markdown
  quoteProps: 'as-needed', // Change when properties in objects are quoted
  semi: true, // Print semicolons at the ends of statements
  singleQuote: true, // Use single quotes instead of double quotes
  tabWidth: 2, // Specify the number of spaces per indentation-level
  trailingComma: 'es5', // Trailing commas where valid in ES5: in arrays and objects
};
