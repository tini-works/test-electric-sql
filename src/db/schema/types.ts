import { InferModel } from 'drizzle-orm';
import { todos } from './index';

// Infer the types from our schema
export type Todo = InferModel<typeof todos>;
export type NewTodo = InferModel<typeof todos, 'insert'>;

