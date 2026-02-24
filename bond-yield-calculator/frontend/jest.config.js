/**
 * Custom Jest config so tests can live in test/ (outside src).
 * Extends CRA's config and overrides roots + testMatch.
 */
const createJestConfig = require('react-scripts/scripts/utils/createJestConfig');
const path = require('path');

// Resolve paths relative to react-scripts (CRA expects this)
const resolve = (id) => require.resolve(path.join('react-scripts', id));
const baseConfig = createJestConfig(resolve, path.join(__dirname), false);

module.exports = {
  ...baseConfig,
  roots: ['<rootDir>/src', '<rootDir>/test'],
  testMatch: [
    '<rootDir>/test/unit/**/*.test.tsx',
    '<rootDir>/test/unit/**/*.test.ts',
    '<rootDir>/test/unit/**/*.spec.tsx',
    '<rootDir>/test/unit/**/*.spec.ts',
  ],
};
