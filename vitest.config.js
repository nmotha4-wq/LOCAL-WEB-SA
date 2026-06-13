import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Each test file picks its own environment via a
    // `// @vitest-environment ...` docblock (node for the worker,
    // jsdom for the browser-side blog-data module).
    environment: 'node',
    include: ['tests/**/*.test.js'],
    coverage: {
      provider: 'v8',
      include: ['functions/**/*.js', 'blog-data.js', 'app.js'],
      reporter: ['text', 'html'],
    },
  },
});
