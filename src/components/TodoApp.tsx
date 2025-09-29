import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, CheckCircle2, Circle, Trash2 } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import TodoItem, { Todo } from './TodoItem';

type FilterType = 'all' | 'active' | 'completed';

const TodoApp = () => {
  const [todos, setTodos] = useLocalStorage<Todo[]>('todos', []);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: crypto.randomUUID(),
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date(),
      };
      setTodos([todo, ...todos]);
      setNewTodo('');
    }
  };

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, ...updates } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            Todo App
          </h1>
          <p className="text-muted-foreground">
            Stay organized and get things done
          </p>
        </div>

        {/* Add new todo */}
        <div className="mb-8">
          <div className="flex gap-2 p-4 bg-card rounded-lg shadow-card">
            <Input
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Add a new todo..."
              className="flex-1"
            />
            <Button onClick={addTodo} className="px-6">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              <Circle className="h-4 w-4 mr-2" />
              All ({todos.length})
            </Button>
            <Button
              variant={filter === 'active' ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setFilter('active')}
            >
              Active ({activeCount})
            </Button>
            <Button
              variant={filter === 'completed' ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setFilter('completed')}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Completed ({completedCount})
            </Button>
          </div>
          
          {completedCount > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={clearCompleted}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Completed
            </Button>
          )}
        </div>

        {/* Todo list */}
        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-lg font-medium mb-2">
                {filter === 'all' 
                  ? 'No todos yet' 
                  : filter === 'active' 
                    ? 'No active todos' 
                    : 'No completed todos'
                }
              </h3>
              <p className="text-muted-foreground">
                {filter === 'all' 
                  ? 'Add your first todo to get started!' 
                  : filter === 'active' 
                    ? 'All caught up! Time to add more todos.' 
                    : 'Complete some todos to see them here.'
                }
              </p>
            </div>
          ) : (
            filteredTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onUpdate={updateTodo}
                onDelete={deleteTodo}
              />
            ))
          )}
        </div>

        {/* Stats */}
        {todos.length > 0 && (
          <div className="mt-8 text-center text-sm text-muted-foreground">
            {activeCount === 0 ? (
              '🎉 All tasks completed! Great job!'
            ) : (
              `${activeCount} ${activeCount === 1 ? 'task' : 'tasks'} remaining`
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoApp;