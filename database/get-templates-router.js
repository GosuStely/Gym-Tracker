// routes/templates.js
import { Router } from 'express';
import sqlite3 from 'sqlite3';

const router = Router();

// Initialize the database
const db = new sqlite3.Database('./database/gymTracker.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Route to get all templates with exercises and sets
router.get('/templates', (req, res) => {
    const sql = `
    SELECT
      templates.id AS template_id,
      templates.name AS template_name,
      exercises.id AS exercise_id,
      exercises.name AS exercise_name,
      sets.id AS set_id,
      sets.reps AS set_reps,
      sets.weight AS set_weight
    FROM templates
    LEFT JOIN template_exercises ON templates.id = template_exercises.template_id
    LEFT JOIN exercises ON template_exercises.exercise_id = exercises.id
    LEFT JOIN sets ON exercises.id = sets.exercise_id
  `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error executing SQL:', err.message);
            res.status(500).json({ error: err.message });
            return;
        }

        const templates = rows.reduce((acc, row) => {
            if (!acc[row.template_id]) {
                acc[row.template_id] = {
                    id: row.template_id,
                    name: row.template_name,
                    exercises: [],
                };
            }
            if (row.exercise_id) {
                let exercise = acc[row.template_id].exercises.find(ex => ex.id === row.exercise_id);
                if (!exercise) {
                    exercise = {
                        id: row.exercise_id,
                        name: row.exercise_name,
                        sets: [],
                    };
                    acc[row.template_id].exercises.push(exercise);
                }
                if (row.set_id) {
                    exercise.sets.push({
                        id: row.set_id,
                        reps: row.set_reps,
                        weight: row.set_weight,
                    });
                }
            }
            return acc;
        }, {});

        res.json({ templates: Object.values(templates) });
    });
});

export default router;
