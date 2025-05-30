import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/vietnam_finance',
});

// Create a Drizzle client with our schema
export const db = drizzle(pool, { schema });

// Export the pool for direct access if needed
export { pool };

