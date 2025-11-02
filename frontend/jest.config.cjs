module.exports = {
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/jest.setup.js"],
  transform: { "^.+\\.[jt]sx?$": "babel-jest" },
  moduleFileExtensions: ["js", "jsx"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|scss|sass)$": "identity-obj-proxy"
  }
};
