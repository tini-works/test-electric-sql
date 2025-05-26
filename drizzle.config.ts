import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema/index.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    // This is a placeholder since we're using PGlite
    // The actual connection is handled in our code
    connectionString: 'postgresql://user:password@localhost:5432/db',
  },
} satisfies Config;
