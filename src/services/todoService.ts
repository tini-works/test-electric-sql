import { db } from '../db';
import { todos } from '../db/schema';
import { eq } from 'drizzle-orm';
import type { NewTodo, Todo } from '../db/schema/types';

// Service for interacting with todos
export const todoService = {
  // Get all todos
  async getAll(): Promise<Todo[]> {
    return db.select().from(todos).orderBy(todos.createdAt);
  },

  // Get a single todo by ID
  async getById(id: number): Promise<Todo | undefined> {
    const results = await db.select().from(todos).where(eq(todos.id, id));
    return results[0];
  },

  // Create a new todo
  async create(todo: Omit<NewTodo, 'id' | 'createdAt' | 'updatedAt'>): Promise<Todo> {
    const results = await db.insert(todos).values(todo).returning();
    return results[0];
  },

  // Update a todo
  async update(id: number, data: Partial<Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Todo | undefined> {
    const results = await db
      .update(todos)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(todos.id, id))
      .returning();
    return results[0];
  },

  // Toggle todo completion status
  async toggleComplete(id: number): Promise<Todo | undefined> {
    const todo = await this.getById(id);
    if (!todo) return undefined;
    
    return this.update(id, { completed: !todo.completed });
  },

  // Delete a todo
  async delete(id: number): Promise<boolean> {
    const results = await db.delete(todos).where(eq(todos.id, id)).returning();
    return results.length > 0;
  }
};

