const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const taskList = document.getElementById("taskList");
const dropdown = document.getElementById("filterDropdown");
const activeTasksCount = document.getElementById("activeTasks");

function updateActiveTasksCount() {
    const activeTasks = tasks.filter(task => !task.completed);
    activeTasksCount.textContent = `Tasks Remaining: ${activeTasks.length}`;
}

function saveTasks() {
    localStorage.setItem("myChecklist", JSON.stringify(tasks));
}

function loadTasks() {
    const savedData = localStorage.getItem("myChecklist");
    return savedData ? JSON.parse(savedData) : [];
}

let tasks = loadTasks();

function filterTasks() {
    const filterValue = dropdown.value;

    let filteredTasks = tasks;

    if (filterValue === "active") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (filterValue === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    renderTasks(filteredTasks);
}

dropdown.addEventListener("change", filterTasks);

function renderTasks(taskArray = tasks) {

    taskList.innerHTML = "";

    taskArray.forEach(task => {

        const listItem = document.createElement("li");

        const label = document.createElement("label");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        const textNode = document.createTextNode(task.text);

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        if (task.completed) {
            label.style.textDecoration = "line-through";
        }

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveTasks();
            filterTasks();
        });

        deleteButton.addEventListener("click", () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            filterTasks();
        });

        editButton.addEventListener("click", () => {
            const newText = prompt("Edit task:", task.text);

            if (newText !== null) {
                const trimmedText = newText.trim();
                if (trimmedText !== "") {
                    task.text = trimmedText;
                    saveTasks();
                    filterTasks();
                }
            }
        });

        label.appendChild(checkbox);
        label.appendChild(textNode);

        listItem.appendChild(label);
        listItem.appendChild(editButton);
        listItem.appendChild(deleteButton);

        taskList.appendChild(listItem);
    });

    updateActiveTasksCount();
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

    filterTasks();

    taskInput.value = "";
}

addTaskButton.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        addTask();
    }
});

filterTasks();