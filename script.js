const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const progressFill = document.getElementById('progress-fill');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Save tasks in local storage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render tasks and update progress bar
function renderTasks() {
  taskList.innerHTML = '';
  let completedCount = 0;

  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';

    const label = document.createElement('label');
    label.textContent = task.text;
    label.title = "Double-click to edit";

    // Double click to edit
    label.addEventListener('dblclick', () => startEditTask(index, label));

    const actions = document.createElement('div');
    actions.className = 'actions';

    // Separate icons for complete, edit, delete with titles
    const completeBtn = document.createElement('button');
    completeBtn.innerHTML = '✔';
    completeBtn.className = 'complete';
    completeBtn.title = task.completed ? 'Mark as Incomplete' : 'Mark as Complete';
    completeBtn.onclick = () => toggleComplete(index);

    const editBtn = document.createElement('button');
    editBtn.innerHTML = '✎';
    editBtn.className = 'edit';
    editBtn.title = 'Edit task';
    editBtn.onclick = () => startEditTask(index, label);

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '🗑';
    deleteBtn.className = 'delete';
    deleteBtn.title = 'Delete task';
    deleteBtn.onclick = () => deleteTask(index);

    actions.appendChild(completeBtn);
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(label);
    li.appendChild(actions);
    taskList.appendChild(li);

    if (task.completed) completedCount++;
  });

  updateProgress(completedCount, tasks.length);
}

// Add new task
addBtn.addEventListener('click', () => {
  const taskValue = taskInput.value.trim();
  if (taskValue) {
    tasks.push({ text: taskValue, completed: false });
    saveTasks();
    renderTasks();
    taskInput.value = '';
  }
});

// Toggle task completion
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

// Delete task
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

// Edit task inline
function startEditTask(index, label) {
  const input = document.createElement('input');
  input.type = 'text';
  input.value = label.textContent;
  input.onblur = () => finishEditTask(index, input);
  input.onkeydown = (e) => {
    if (e.key === 'Enter') finishEditTask(index, input);
    if (e.key === 'Escape') renderTasks(); // Cancel edit on Escape
  };
  label.replaceWith(input);
  input.focus();
  input.select();
}

function finishEditTask(index, input) {
  const newValue = input.value.trim();
  if (newValue) {
    tasks[index].text = newValue;
    saveTasks();
  }
  renderTasks();
}

// Update progress bar width and text
function updateProgress(completed, total) {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  progressFill.style.width = percent + '%';
  progressFill.textContent = percent + '%';
}

// Initial render on page load
renderTasks();
