import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db, pool } from './index';

// This script runs migrations on the database
async function runMigrations() {
  console.log('Running migrations...');
  
  try {
    // Run migrations
    await migrate(db, { migrationsFolder: './migrations' });
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the migration function
runMigrations();

