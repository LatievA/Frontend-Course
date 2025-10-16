// ==============================
// Part 4: To-Do List with Title & Description
// ==============================

// Task storage
let tasks = [];

// Get elements
const titleInput = document.getElementById("taskTitle");
const descInput = document.getElementById("taskDesc");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

// Add task
addBtn.addEventListener("click", function() {
  const title = titleInput.value.trim();
  const desc = descInput.value.trim();

  if (title === "" || desc === "") {
    alert("Please enter both title and description!");
    return;
  }

  // Push to array
  tasks.push({ title: title, description: desc, completed: false });

  // Clear inputs
  titleInput.value = "";
  descInput.value = "";

  // Re-render
  renderTasks();
});

// Render all tasks
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    const titleEl = document.createElement("div");
    titleEl.textContent = task.title;
    titleEl.className = "task-title";

    const descEl = document.createElement("div");
    descEl.textContent = task.description;
    descEl.className = "task-desc";

    const btnGroup = document.createElement("div");
    btnGroup.className = "btn-group";

    // Complete button
    const completeBtn = document.createElement("button");
    completeBtn.textContent = task.completed ? "Undo" : "Complete";
    completeBtn.className = "btn complete";
    completeBtn.addEventListener("click", function() {
      tasks[index].completed = !tasks[index].completed;
      renderTasks();
    });

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "btn delete";
    deleteBtn.addEventListener("click", function() {
      tasks.splice(index, 1);
      renderTasks();
    });

    btnGroup.appendChild(completeBtn);
    btnGroup.appendChild(deleteBtn);

    li.appendChild(titleEl);
    li.appendChild(descEl);
    li.appendChild(btnGroup);
    taskList.appendChild(li);
  });
}
