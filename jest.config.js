module.exports = {
  preset: 'ts-jest',
  roots: ['<rootDir>/src'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  testEnvironment: 'node',
  collectCoverageFrom: ['./src/**'],
  testRegex: '(\\.test\\.ts)',
};
