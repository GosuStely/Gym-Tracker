import express from 'express';
import path from 'path';
import * as database from './database/database-module.js'
import templatesRouter from './database/get-templates-router.js'

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(path.resolve(), 'public')));
app.use(templatesRouter);


// HTTP methods with function references
app.get('/templates', database.getAllTemplates);
app.delete('/templates/:id', database.deleteTemplate);
app.put('/templates/:id', database.updateTemplateName);
app.post('/templates/:id/exercises', database.addExerciseToTemplate);
app.delete('/templates/:template_id/exercises/:exercise_id', database.removeExerciseFromTemplate);
app.get('/exercises', database.getAllExercises);
app.get('/exercises/:id', database.getExerciseById);
app.post('/exercises', database.createExercise);
app.put('/exercises/:id', database.updateExercise);
app.delete('/exercises/:id', database.deleteExercise);

app.listen(port, function () {
  console.log(`Server listening on port ${port}`);
});

process.on('SIGINT', function () {
  db.close(function () {
    console.log('Database connection closed.');
    process.exit(0);
  });
});
