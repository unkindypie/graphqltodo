module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // запустится единожды перед всеми тестами, дропает базу и приминяет миграции
  globalSetup: './src/modules/test-utils/globalSetup.ts',
};
