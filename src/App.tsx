import './App.css'
import { TodoProvider } from './context/TodoContext'
import { TodoList } from './components/TodoList'

function App() {
  return (
    <TodoProvider>
      <div className="app-container" style={{ padding: '20px' }}>
        <h1>Todo App with PGlite & Drizzle</h1>
        <p>A simple todo application using PGlite for local database and Drizzle ORM</p>
        <TodoList />
      </div>
    </TodoProvider>
  )
}

export default App
