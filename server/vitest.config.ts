import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globalSetup: './tests/globalSetup.ts',
    setupFiles: './tests/setup.ts',
    env: {
      DATABASE_PORT: '5433',
    },
  },
})
