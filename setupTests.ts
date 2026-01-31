
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock import.meta.env for Vite environment variables
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: {
        VITE_API_KEY: 'mock-api-key',
        VITE_AUTH_DOMAIN: 'mock.firebaseapp.com',
        VITE_PROJECT_ID: 'mock-project',
        VITE_STORAGE_BUCKET: 'mock.appspot.com',
        VITE_MESSAGING_SENDER_ID: '123456789',
        VITE_APP_ID: '1:123:web:abc',
        VITE_MEASUREMENT_ID: 'G-ABCDEF',
      },
    },
  },
  writable: true,
});
