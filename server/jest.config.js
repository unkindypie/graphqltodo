module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // globalSetup: './src/jest.globalSetup.ts',
  setupFiles: ['<rootDir>/src/jest.globalSetup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  collectCoverage: false,
  collectCoverageFrom: [
    './src/**/*.{ts,tsx,js,jsx}',
    '!**/node_modules/**',
    '!**/dist/**',
    '!./src/migration/**',
  ],
};
