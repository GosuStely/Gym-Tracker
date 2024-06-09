const sqlite = require('sqlite3').verbose();
const database = new sqlite.Database('./database/gymTracker.db');

database.serialize(() => {
    // Exercises Table
    database.run(`CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )`);
  
    // Sets Table
    database.run(`CREATE TABLE IF NOT EXISTS sets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exercise_id INTEGER,
      reps INTEGER NOT NULL,
      weight INTEGER,
      FOREIGN KEY(exercise_id) REFERENCES exercises(id)
    )`);
  
    // Templates Table
    database.run(`CREATE TABLE IF NOT EXISTS templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )`);
  
    // Template Exercises Table
    database.run(`CREATE TABLE IF NOT EXISTS template_exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      template_id INTEGER,
      exercise_id INTEGER,
      FOREIGN KEY(template_id) REFERENCES templates(id),
      FOREIGN KEY(exercise_id) REFERENCES exercises(id)
    )`);
});
database.close();
console.log('Database initialized.');