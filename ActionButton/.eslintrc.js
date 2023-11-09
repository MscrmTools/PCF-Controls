module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2020, // Allows the use of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    project: './tsconfig.json' // Point to your project's tsconfig.json
  },
  rules: {
    // Place to specify ESLint rules - can be used to overwrite rules specified from the extended configurations
    // For example, to turn off a rule:
    // 'no-unused-vars': 'off',
  }
};
