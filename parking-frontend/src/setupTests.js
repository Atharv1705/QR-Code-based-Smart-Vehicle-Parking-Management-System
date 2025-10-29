// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Suppress console warnings for missing source maps in development
const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0] && args[0].includes('Failed to parse source map')) {
    return;
  }
  originalWarn.apply(console, args);
};