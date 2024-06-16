import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function initializeDatabase() {
  const db = await open({
    filename: './database/gymTracker.db',
    driver: sqlite3.Database
  });

  await db.exec(`CREATE TABLE IF NOT EXISTS exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    )`);

  await db.exec(`CREATE TABLE IF NOT EXISTS sets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        exercise_id INTEGER,
        reps INTEGER NOT NULL,
        weight INTEGER,
        FOREIGN KEY(exercise_id) REFERENCES exercises(id)
    )`);

  await db.exec(`CREATE TABLE IF NOT EXISTS templates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    )`);

  await db.exec(`CREATE TABLE IF NOT EXISTS template_exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        template_id INTEGER,
        exercise_id INTEGER,
        FOREIGN KEY(template_id) REFERENCES templates(id),
        FOREIGN KEY(exercise_id) REFERENCES exercises(id)
    )`);

  await db.exec(`DELETE FROM exercises`);
  await db.exec(`DELETE FROM sets`);
  await db.exec(`DELETE FROM templates`);
  await db.exec(`DELETE FROM template_exercises`);

  await db.exec(`DELETE FROM sqlite_sequence WHERE name IN ('exercises', 'sets', 'templates', 'template_exercises')`);

  const exercises = [
    'Bench Press',
    'Squat',
    'Deadlift',
    'Shoulder Press',
    'Pull Up',
    'Bicep Curl'
  ];
  for (const exercise of exercises) {
    await db.run(`INSERT INTO exercises (name) VALUES (?)`, [exercise]);
  }

  const sets = [
    { exercise_id: 1, reps: 10, weight: 60 },
    { exercise_id: 1, reps: 8, weight: 65 },
    { exercise_id: 2, reps: 12, weight: 100 },
    { exercise_id: 2, reps: 10, weight: 110 },
    { exercise_id: 3, reps: 8, weight: 140 },
    { exercise_id: 3, reps: 6, weight: 150 }
  ];
  for (const set of sets) {
    await db.run(`INSERT INTO sets (exercise_id, reps, weight) VALUES (?, ?, ?)`, [set.exercise_id, set.reps, set.weight]);
  }

  const templates = [
    'Full Body Workout',
    'Upper Body Workout',
    'Leg Day'
  ];
  for (const template of templates) {
    await db.run(`INSERT INTO templates (name) VALUES (?)`, [template]);
  }

  const templateExercises = [
    { template_id: 1, exercise_id: 1 },
    { template_id: 1, exercise_id: 2 },
    { template_id: 1, exercise_id: 3 },
    { template_id: 2, exercise_id: 1 },
    { template_id: 2, exercise_id: 4 },
    { template_id: 3, exercise_id: 2 },
    { template_id: 3, exercise_id: 3 }
  ];
  for (const templateExercise of templateExercises) {
    await db.run(`INSERT INTO template_exercises (template_id, exercise_id) VALUES (?, ?)`, [templateExercise.template_id, templateExercise.exercise_id]);
  }

  console.log('Dummy data inserted after clearing previous data.');

  await db.close();
}

initializeDatabase().catch(err => {
  console.error('Error initializing the database:', err);
});
