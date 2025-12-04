module.exports = {
  testEnvironment: "node",
  moduleFileExtensions: ["js", "mjs"], // allow ESM .js imports
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  testMatch: ["**/__tests__/**/*.js"],  // pick up tests in __tests__ folder
};
