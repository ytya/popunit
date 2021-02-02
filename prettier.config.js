/** @type {import('prettier').Options} */
module.exports = {
  printWidth: 120,
  semi: false,
  singleQuote: true,
  trailingComma: "all",
  overrides: [
    {
      files: "*.{md,yml}",
      options: {
        printWidth: 120,
        semi: true,
        singleQuote: false,
        trailingComma: "none"
      }
    }
  ]
};
