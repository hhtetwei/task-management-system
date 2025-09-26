module.exports = {
    testEnvironment: "jsdom",
    transform: {
      "^.+\\.(ts|tsx|js|jsx)$": "babel-jest",
    },
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"], 
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1", 
    },
  };