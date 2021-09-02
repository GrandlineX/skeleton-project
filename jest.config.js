module.exports = {
  testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  coverageReporters: ["html", "text", "text-summary", "cobertura"],
  collectCoverageFrom: ["**/*.ts", "!**/node_modules/**"],
  testPathIgnorePatterns: ["/dist/", "/node_modules/"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};
