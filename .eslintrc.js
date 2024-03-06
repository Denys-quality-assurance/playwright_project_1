module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'prettier', // Extends the Prettier config and turns off any ESLint rule that conflicts with Prettier so that Prettier can handle the formatting.
    'eslint:recommended', // Extends the recommended set of rules from ESLint.
    'plugin:playwright/recommended', // Extends the recommended set of rules from the Playwright ESLint plugin to enforce best practices.
    'plugin:prettier/recommended', // It is recommended by the Prettier plugin, it turns the rules of "eslint-plugin-prettier" on and configures "prettier" as a formatter itself which means now Prettier's rules will be treated as ESLint errors. It should always be the last extension in the list to override other configs settings.
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['playwright'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'playwright/no-conditional-in-test': 'off',
    'playwright/no-conditional-expect': 'off',
    'playwright/no-wait-for-selector': 'off',
    'playwright/max-expects': [
      'error',
      {
        max: 6, // Enforces a maximum number assertion calls in a test body
      },
    ],
    'playwright/max-nested-describe': ['error', { max: 2 }], // Enforces a maximum depth to nested describe calls
  },
};
