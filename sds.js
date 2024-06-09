import sqlite3 from 'sqlite3';

const sqlite = sqlite3.verbose();
const db = new sqlite.Database('./database/gymTracker.db');

db.serialize(() => {
  // Insert exercises
  db.run('INSERT INTO exercises (name) VALUES (?)', ['Push Up']);
  db.run('INSERT INTO exercises (name) VALUES (?)', ['Squat']);
  db.run('INSERT INTO exercises (name) VALUES (?)', ['Pull Up']);
  db.run('INSERT INTO exercises (name) VALUES (?)', ['Deadlift']);

  // Insert templates
  db.run('INSERT INTO templates (name) VALUES (?)', ['Full Body Workout']);
  db.run('INSERT INTO templates (name) VALUES (?)', ['Upper Body Workout']);

  // Insert template_exercises
  db.run('INSERT INTO template_exercises (template_id, exercise_id) VALUES (?, ?)', [1, 1]); // Full Body Workout - Push Up
  db.run('INSERT INTO template_exercises (template_id, exercise_id) VALUES (?, ?)', [1, 2]); // Full Body Workout - Squat
  db.run('INSERT INTO template_exercises (template_id, exercise_id) VALUES (?, ?)', [1, 4]); // Full Body Workout - Deadlift
  db.run('INSERT INTO template_exercises (template_id, exercise_id) VALUES (?, ?)', [2, 1]); // Upper Body Workout - Push Up
  db.run('INSERT INTO template_exercises (template_id, exercise_id) VALUES (?, ?)', [2, 3]); // Upper Body Workout - Pull Up
});

db.close(() => {
  console.log('Database populated with initial data.');
});
