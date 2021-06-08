module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // запустится единожды перед всеми тестами, дропает базу и приминяет миграции
  globalSetup: './src/modules/test-utils/globalSetup.ts',
  // maxWorkers: 1,
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
