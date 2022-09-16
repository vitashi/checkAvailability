/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    runner: "groups",
    preset: "ts-jest",
    testEnvironment: "node",
    coveragePathIgnorePatterns: [
        "/node_modules/"
      ],
    forceExit: true,
};