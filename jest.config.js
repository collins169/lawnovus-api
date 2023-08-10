module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test))\\.(ts|js)$',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  resetMocks: true,
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'Unit Tests',
        outputDirectory: './junit/unit',
        addFileAttribute: 'true',
      },
    ],
  ],
  setupFilesAfterEnv: ['./src/setupTests.ts'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts',
    '!node_modules/**',
    '!src/database/migrations/**',
    '!src/omniauth/testHelpers.ts',
    '!src/msw/**/*.ts',
    '!src/setupTests.ts',
  ],
};
