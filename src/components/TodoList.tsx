import { useState } from 'react';
import { useTodos } from '../context/TodoContext';
import { TodoItem } from './TodoItem';

export function TodoList() {
  const { todos, loading, error, addTodo, toggleTodo, deleteTodo, dbInitialized } = useTodos();
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoTitle.trim()) {
      await addTodo(newTodoTitle.trim());
      setNewTodoTitle('');
    }
  };

  if (!dbInitialized) {
    return (
      <div className="todo-error" style={{ color: 'red', padding: '20px' }}>
        Database initialization failed. Please check the console for errors.
      </div>
    );
  }

  if (error) {
    return (
      <div className="todo-error" style={{ color: 'red', padding: '20px' }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div className="todo-list" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2>Todo List</h2>
      
      <form onSubmit={handleSubmit} style={{ 
        display: 'flex', 
        marginBottom: '20px' 
      }}>
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="Add a new todo..."
          style={{ 
            flex: 1, 
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ced4da'
          }}
        />
        <button 
          type="submit"
          style={{
            marginLeft: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 16px',
            cursor: 'pointer'
          }}
        >
          Add
        </button>
      </form>

      {loading ? (
        <div className="loading">Loading todos...</div>
      ) : (
        <div>
          {todos.length === 0 ? (
            <div className="no-todos" style={{ textAlign: 'center', color: '#6c757d' }}>
              No todos yet. Add one above!
            </div>
          ) : (
            todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

