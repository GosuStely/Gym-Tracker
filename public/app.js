const url = "http://localhost:3000/templates";
fetchTemplates();

async function fetchTemplates() {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    const templates = data.templates;
    console.log(templates);

    let templateContainer = document.querySelector(".templates-bottomside-container");
    templateContainer.innerHTML = "";

    templates.forEach(template => {
      let templateElement = createTemplate(template);
      templateContainer.appendChild(templateElement);
    });
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

function createTemplate(template) {
  let templateSection = createTemplateElement();
  let header = createTemplateHeader(template.name);
  templateSection.appendChild(header);

  template.exercises.forEach(exercise => {
    let exerciseSection = createExercise(exercise);
    templateSection.appendChild(exerciseSection);
  });

  return templateSection;
}

function createTemplateElement() {
  let section = document.createElement("section");
  section.className = "template";
  return section;
}

function createTemplateHeader(name) {
  let header = document.createElement("section");
  header.className = "template-header";
  let p = document.createElement("p");
  p.innerText = name;
  header.appendChild(p);
  let button = document.createElement("button");
  let img = document.createElement("img");
  img.src = "images/editTemplate.png";
  button.appendChild(img);
  header.appendChild(button);
  return header;
}

function createExercise(exercise) {
  let section = document.createElement("section");
  section.className = "exercise";
  let p = document.createElement("p");
  p.innerText = exercise.name;
  section.appendChild(p);

  exercise.sets.forEach(set => {
    let setElement = createSetElement(set);
    section.appendChild(setElement);
  });

  let button = document.createElement("button");
  let img = document.createElement("img");
  img.src = "images/removeExercise.png";
  button.appendChild(img);
  section.appendChild(button);

  return section;
}

function createSetElement(set) {
  let setSection = document.createElement("section");
  setSection.className = "set";

  let setName = document.createElement("p");
  setName.innerText = `Set ID: ${set.id}, Reps: ${set.reps}, Weight: ${set.weight}kg`;

  setSection.appendChild(setName);

  return setSection;
}

// Create a new template event listener
document.getElementById('add-template-button').addEventListener('click', function () {
  let newTemplate = document.createElement('section');
  newTemplate.classList.add('template');

  let header = document.createElement('section');
  header.classList.add('template-header');
  let headerText = document.createElement('p');
  headerText.innerText = 'New Workout Template';
  let editButton = document.createElement('button');
  let editIcon = document.createElement('img');
  editIcon.src = 'images/editTemplate.png';
  editButton.appendChild(editIcon);
  header.appendChild(headerText);
  header.appendChild(editButton);

  newTemplate.appendChild(header);

  let exercise = document.createElement('section');
  exercise.classList.add('exercise');
  let exerciseText = document.createElement('p');
  exerciseText.innerText = 'New Exercise';
  let removeButton = document.createElement('button');
  let removeIcon = document.createElement('img');
  removeIcon.src = 'images/removeExercise.png';
  removeButton.appendChild(removeIcon);
  exercise.appendChild(exerciseText);
  exercise.appendChild(removeButton);

  newTemplate.appendChild(exercise);
  document.querySelector('.templates-bottomside-container').appendChild(newTemplate);
});
