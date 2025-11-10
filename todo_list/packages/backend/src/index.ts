import express, { Request, Response } from 'express';
import cors from 'cors';
import { db, NewTodo, UpdateTodo } from './database';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Get all todos
app.get('/api/todos', (req: Request, res: Response) => {
  try {
    const todos = db.getAllTodos();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// Create a new todo
app.post('/api/todos', (req: Request, res: Response) => {
  try {
    const { title, completed } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      res.status(400).json({ error: 'Title is required' });
      return;
    }

    const newTodo: NewTodo = {
      title: title.trim(),
      completed: completed || false
    };

    const todo = db.createTodo(newTodo);
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// Update a todo
app.put('/api/todos/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid todo ID' });
      return;
    }

    const { title, completed } = req.body;
    const updates: UpdateTodo = {};

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim().length === 0) {
        res.status(400).json({ error: 'Title must be a non-empty string' });
        return;
      }
      updates.title = title.trim();
    }

    if (completed !== undefined) {
      updates.completed = Boolean(completed);
    }

    const todo = db.updateTodo(id, updates);

    if (!todo) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// Delete a todo
app.delete('/api/todos/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid todo ID' });
      return;
    }

    const success = db.deleteTodo(id);

    if (!success) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
