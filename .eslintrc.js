/*
 * This configuration file establishes the rules for the ESLint tool, which
 * is used to enforce code style and promote best practices in the codebase.
 *
 * The file configures:
 * - The execution environment of the scripts
 * - The base configurations and plugins that we extend and use
 * - The JavaScript parser options that define the JS language features
 * - Specific ESLint rules that either override or extend the rules from the base configurations.
 *
 * Key best practices enforced by this config include:
 * - Use of the Playwright testing library following best practices ('plugin:playwright/recommended')
 * - Use of ES2021 JavaScript features ('env.es2021: true')
 * - Use of the Prettier code formatter for consistent encoding styles ('prettier/prettier')
 */

module.exports = {
  env: {
    browser: true, // Sets the environment to browser. This enables browser global variables.
    node: true, // Sets the environment to Node.js. This enables Node.js global variables and Node.js scoping.
    es2021: true, // Enables features from ECMAScript 2021 (a version of JavaScript standard).
  },
  extends: [
    'prettier', // Extends Prettier and overrides other formatting rules that may conflict with Prettier.
    'eslint:recommended', // Extends the recommended rules from ESLint.
    'plugin:playwright/recommended', // Extends the recommended set of rules from Playwright ESLint plugin to enforce best practices.
    'plugin:prettier/recommended', // Prettier's recommended configuration, it turns the rules of "eslint-plugin-prettier" on and configures "prettier" as a formatter itself which means now Prettier's rules will be treated as ESLint errors. It should always be the last extension in the list to override other configs settings.
  ],
  parserOptions: {
    ecmaVersion: 'latest', // Configures the ECMAScript version your code should be parsed with. 'Latest' means the latest available version.
    sourceType: 'module', // Configures the module type of your scripts, can be either 'script' (default) or 'module'. 'module' enables the use of import and export syntax
  },
  plugins: ['playwright'], // Includes the Playwright plugin to your ESLint config.
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto', // Maintain existing line endings
      },
    ],
    'no-console': [
      'warn',
      {
        allow: ['warn', 'error'], // It will allow console.warn and console.error methods. console.log is not allowed
      },
    ],
    'playwright/no-conditional-in-test': 'warn', // Playwright rule that disallows conditional logic (if and else) in tests
    'playwright/no-conditional-expect': 'warn', // Playwright rule that disallows conditions around expects
    'playwright/no-wait-for-selector': 'off', // Playwright rule that disallows usage of page.waitForSelector and frame.waitForSelector methods is turned off
    'playwright/max-expects': [
      'error',
      {
        max: 6, // Sets the maximum number of expects in a single test
      },
    ],
    'playwright/max-nested-describe': [
      'error',
      {
        max: 2, // Sets the maximum nesting depth for describe() methods
      },
    ],
  },
};
