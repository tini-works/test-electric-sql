import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { todoService } from '../services/todoService';
import type { Todo } from '../db/schema/types';
import { initDb } from '../db';

// Define the context type
interface TodoContextType {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  dbInitialized: boolean;
  addTodo: (title: string) => Promise<void>;
  toggleTodo: (id: number) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  refreshTodos: () => Promise<void>;
}

// Create the context with a default value
const TodoContext = createContext<TodoContextType | undefined>(undefined);

// Provider component
export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dbInitialized, setDbInitialized] = useState(false);

  // Initialize the database and load todos
  useEffect(() => {
    async function initialize() {
      try {
        setLoading(true);
        // Initialize the database
        const initialized = await initDb();
        setDbInitialized(initialized);
        
        if (initialized) {
          // Load todos
          await refreshTodos();
        }
      } catch (err) {
        setError('Failed to initialize the database');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    initialize();
  }, []);

  // Function to refresh the todo list
  async function refreshTodos() {
    try {
      setLoading(true);
      const data = await todoService.getAll();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError('Failed to load todos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Function to add a new todo
  async function addTodo(title: string) {
    try {
      await todoService.create({ title });
      await refreshTodos();
    } catch (err) {
      setError('Failed to add todo');
      console.error(err);
    }
  }

  // Function to toggle a todo's completion status
  async function toggleTodo(id: number) {
    try {
      await todoService.toggleComplete(id);
      await refreshTodos();
    } catch (err) {
      setError('Failed to update todo');
      console.error(err);
    }
  }

  // Function to delete a todo
  async function deleteTodo(id: number) {
    try {
      await todoService.delete(id);
      await refreshTodos();
    } catch (err) {
      setError('Failed to delete todo');
      console.error(err);
    }
  }

  // Create the context value
  const value: TodoContextType = {
    todos,
    loading,
    error,
    dbInitialized,
    addTodo,
    toggleTodo,
    deleteTodo,
    refreshTodos,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

// Custom hook to use the todo context
export function useTodos() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
}

