module.exports = {
  parserOptions: {
    ecmaVersion: 12, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  extends: [
    'plugin:recommended', // Uses the recommended rules from @eslint-plugin-react
   ],
  rules: {
    'object-shorthand': ['error', 'always'],
    'no-shadow': 'error',
    'require-await': 'error',
    'no-empty-function': 'error',
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: ['return'] },
      { blankLine: 'always', prev: '*', next: ['block-like'] },
    ],
    yoda: 'error',
    'operator-assignment': ['error', 'always'],
  },
};