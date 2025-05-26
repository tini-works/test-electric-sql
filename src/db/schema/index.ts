import { pgTable, serial, text, boolean, timestamp } from 'drizzle-orm/pg-core';

// Define the todos table
export const todos = pgTable('todos', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  completed: boolean('completed').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Export all schema objects
export * from './types';

