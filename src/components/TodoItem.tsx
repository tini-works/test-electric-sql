import { Todo } from '../db/schema/types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="todo-item" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      padding: '10px',
      margin: '5px 0',
      backgroundColor: '#f8f9fa',
      borderRadius: '4px'
    }}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        style={{ marginRight: '10px' }}
      />
      <span style={{ 
        flex: 1,
        textDecoration: todo.completed ? 'line-through' : 'none',
        color: todo.completed ? '#6c757d' : '#212529'
      }}>
        {todo.title}
      </span>
      <button 
        onClick={() => onDelete(todo.id)}
        style={{
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '5px 10px',
          cursor: 'pointer'
        }}
      >
        Delete
      </button>
    </div>
  );
}

