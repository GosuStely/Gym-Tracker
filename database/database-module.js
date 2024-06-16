import sqlite from 'sqlite3';
import { open } from 'sqlite';
// Set up the database connection
const db = new sqlite.Database('./database/gymTracker.db');
async function getAllTemplates(req, res) {
  try {
    // Open the database
    const db = await open({
      filename: './database/gymTracker.db',
      driver: sqlite3.Database
    });

    // SQL query to join templates with exercises and sets
    const sql = `
      SELECT 
        t.id as template_id, t.name as template_name,
        e.id as exercise_id, e.name as exercise_name,
        s.id as set_id, s.reps, s.weight
      FROM templates t
      LEFT JOIN template_exercises te ON t.id = te.template_id
      LEFT JOIN exercises e ON te.exercise_id = e.id
      LEFT JOIN sets s ON e.id = s.exercise_id
      ORDER BY t.id, e.id, s.id
    `;

    // Execute the query
    const rows = await db.all(sql);

    // Close the database connection
    await db.close();

    // Transform the flat result into a nested structure
    const templates = rows.reduce((acc, row) => {
      const templateId = row.template_id;

      // If the template doesn't exist in the accumulator, add it
      if (!acc[templateId]) {
        acc[templateId] = {
          id: templateId,
          name: row.template_name,
          exercises: []
        };
      }

      // Find or add the current exercise to the template
      const exercise = acc[templateId].exercises.find(ex => ex.id === row.exercise_id);
      if (!exercise && row.exercise_id) {
        acc[templateId].exercises.push({
          id: row.exercise_id,
          name: row.exercise_name,
          sets: []
        });
      }

      // If the current exercise exists and the set is available, add the set
      if (row.set_id) {
        const currentExercise = acc[templateId].exercises.find(ex => ex.id === row.exercise_id);
        currentExercise.sets.push({
          id: row.set_id,
          reps: row.reps,
          weight: row.weight
        });
      }

      return acc;
    }, {});

    // Respond with the transformed templates
    res.json({ templates: Object.values(templates) });
  } catch (err) {
    // Handle any errors
    res.status(500).json({ error: err.message });
  }
}

// Function to handle removing a template by its ID
function deleteTemplate(req, res) {
  const { id } = req.params;
  db.run('DELETE FROM templates WHERE id = ?', [id], function handleDeleteTemplate(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    db.run('DELETE FROM template_exercises WHERE template_id = ?', [id], function handleDeleteTemplateExercises(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Template and associated exercises deleted', id });
    });
  });
}

// Function to handle renaming a template by its ID
function updateTemplateName(req, res) {
  const { id } = req.params;
  const { name } = req.body;
  db.run('UPDATE templates SET name = ? WHERE id = ?', [name, id], function handleUpdateTemplateName(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Template renamed', id, name });
  });
}

// Function to handle adding exercises to a template
function addExerciseToTemplate(req, res) {
  const { id } = req.params;
  const { exercise_id } = req.body;
  db.run('INSERT INTO template_exercises (template_id, exercise_id) VALUES (?, ?)', [id, exercise_id], function handleAddExerciseToTemplate(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Exercise added to template', template_id: id, exercise_id });
  });
}

// Function to handle removing an exercise from a template
function removeExerciseFromTemplate(req, res) {
  const { template_id, exercise_id } = req.params;
  db.run('DELETE FROM template_exercises WHERE template_id = ? AND exercise_id = ?', [template_id, exercise_id], function handleRemoveExerciseFromTemplate(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Exercise removed from template', template_id, exercise_id });
  });
}

// Function to handle getting all exercises
function getAllExercises(req, res) {
  db.all('SELECT * FROM exercises', function handleGetAllExercises(err, rows) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ exercises: rows });
  });
}

// Function to handle getting a single exercise by id
function getExerciseById(req, res) {
  const { id } = req.params;
  db.get('SELECT * FROM exercises WHERE id = ?', [id], function handleGetExerciseById(err, row) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ exercise: row });
  });
}

// Function to handle creating a new exercise
function createExercise(req, res) {
  const { name } = req.body;
  db.run('INSERT INTO exercises (name) VALUES (?)', [name], function handleCreateExercise(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, name });
  });
}

// Function to handle updating an exercise by id
function updateExercise(req, res) {
  const { id } = req.params;
  const { name } = req.body;
  db.run('UPDATE exercises SET name = ? WHERE id = ?', [name, id], function handleUpdateExercise(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id, name });
  });
}

// Function to handle deleting an exercise by id
function deleteExercise(req, res) {
  const { id } = req.params;
  db.run('DELETE FROM exercises WHERE id = ?', [id], function handleDeleteExercise(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id });
  });
}
export { deleteExercise, deleteTemplate, updateExercise, updateTemplateName, createExercise, getAllExercises, getAllTemplates, getExerciseById, removeExerciseFromTemplate, addExerciseToTemplate };