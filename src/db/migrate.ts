import { pglite } from './index';
import fs from 'fs';
import path from 'path';

// Function to run migrations from the migrations directory
export async function runMigrations() {
  try {
    const migrationsDir = path.join(process.cwd(), 'migrations');
    
    // Check if migrations directory exists
    if (!fs.existsSync(migrationsDir)) {
      console.error('Migrations directory not found. Run "npm run generate" first.');
      return false;
    }
    
    // Get all SQL files in the migrations directory
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Sort to ensure migrations run in order
    
    console.log(`Found ${migrationFiles.length} migration files`);
    
    // Run each migration
    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      console.log(`Running migration: ${file}`);
      await pglite.query(sql);
      console.log(`Migration completed: ${file}`);
    }
    
    console.log('All migrations completed successfully');
    return true;
  } catch (error) {
    console.error('Migration failed:', error);
    return false;
  }
}

