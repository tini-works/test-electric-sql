import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import * as schema from './schema';

// Initialize PGlite with a file path for persistence
// In a browser environment, this will use IndexedDB
// In Node.js, it will use the file system
const pglite = new PGlite('./todo-db');

// Create a Drizzle client with our schema
export const db = drizzle(pglite, { schema });

// Export the raw PGlite instance in case we need direct access
export { pglite };

// Initialize function to ensure database is ready
export async function initDb() {
  try {
    // Test connection
    const result = await pglite.query('SELECT version()');
    console.log('PGlite connected:', result.rows[0].version);
    return true;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    return false;
  }
}

