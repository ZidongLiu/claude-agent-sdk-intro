import Database from 'better-sqlite3';
import path from 'path';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface NewTodo {
  title: string;
  completed?: boolean;
}

export interface UpdateTodo {
  title?: string;
  completed?: boolean;
}

class TodoDatabase {
  private db: Database.Database;

  constructor() {
    this.db = new Database(path.join(__dirname, '..', 'todos.db'));
    this.initialize();
  }

  private initialize() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  getAllTodos(): Todo[] {
    const stmt = this.db.prepare('SELECT * FROM todos ORDER BY createdAt DESC');
    const rows = stmt.all() as any[];
    return rows.map(row => ({
      id: row.id,
      title: row.title,
      completed: Boolean(row.completed),
      createdAt: row.createdAt
    }));
  }

  getTodoById(id: number): Todo | undefined {
    const stmt = this.db.prepare('SELECT * FROM todos WHERE id = ?');
    const row = stmt.get(id) as any;
    if (!row) return undefined;
    return {
      id: row.id,
      title: row.title,
      completed: Boolean(row.completed),
      createdAt: row.createdAt
    };
  }

  createTodo(todo: NewTodo): Todo {
    const stmt = this.db.prepare(
      'INSERT INTO todos (title, completed) VALUES (?, ?)'
    );
    const info = stmt.run(todo.title, todo.completed ? 1 : 0);
    return this.getTodoById(info.lastInsertRowid as number)!;
  }

  updateTodo(id: number, updates: UpdateTodo): Todo | undefined {
    const todo = this.getTodoById(id);
    if (!todo) return undefined;

    const fields: string[] = [];
    const values: any[] = [];

    if (updates.title !== undefined) {
      fields.push('title = ?');
      values.push(updates.title);
    }
    if (updates.completed !== undefined) {
      fields.push('completed = ?');
      values.push(updates.completed ? 1 : 0);
    }

    if (fields.length === 0) return todo;

    values.push(id);
    const stmt = this.db.prepare(
      `UPDATE todos SET ${fields.join(', ')} WHERE id = ?`
    );
    stmt.run(...values);

    return this.getTodoById(id);
  }

  deleteTodo(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM todos WHERE id = ?');
    const info = stmt.run(id);
    return info.changes > 0;
  }
}

export const db = new TodoDatabase();
