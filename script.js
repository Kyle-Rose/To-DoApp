const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const taskList = document.getElementById("taskList");

function saveTasks() {
    localStorage.setItem("myChecklist", JSON.stringify(tasks));
}

function loadTasks() {
    const savedData = localStorage.getItem("myChecklist");
    return savedData ? JSON.parse(savedData) : [];
}

let tasks = loadTasks();

function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach(task => {

        const listItem = document.createElement("li");

        const label = document.createElement("label");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        const textNode = document.createTextNode(task.text);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        const editButton = document.createElement("button");    
        editButton.textContent = "Edit";

        if (task.completed) {
            label.style.textDecoration = "line-through";
        }

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        deleteButton.addEventListener("click", () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            renderTasks();
        });

        editButton.addEventListener("click", () => {
            const newText = prompt("Edit task:", task.text);
            if (newText !== null) {
                task.text = newText.trim() || task.text;
                saveTasks();
                renderTasks();
            }
        });

        label.appendChild(checkbox);
        label.appendChild(textNode);

        listItem.appendChild(label);
        listItem.appendChild(editButton);
        listItem.appendChild(deleteButton);

        taskList.appendChild(listItem);
    });
}

function addTask() {

    const taskText = taskInput.value.trim();

    if (taskText === "") return;

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    renderTasks();

    taskInput.value = "";
}

addTaskButton.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        addTask();
    }
});

renderTasks();