module.exports = {
  testEnvironment: "node",
  moduleFileExtensions: ["js", "mjs"], // allow ESM .js imports
  transform: {},                        // no Babel needed
  testMatch: ["**/__tests__/**/*.js"],  // pick up tests in __tests__ folder
};
