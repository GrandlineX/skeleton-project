module.exports = {
  testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  coverageReporters: ["html", "text", "text-summary", "cobertura"],
  collectCoverageFrom: ["**/*.ts", "!**/node_modules/**"],
  testPathIgnorePatterns: ["/dist/", "/node_modules/"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  setupFilesAfterEnv: ["./node_modules/@grandlinex/core/jest.pre.config.js"],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};
