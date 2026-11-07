
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const filterTasks = document.getElementById("filterTasks");

let tasks = JSON.parse(localStorage.getItem("studentTasks")) || [];


// Save tasks in browser Local Storage
function saveTasks() {
    localStorage.setItem("studentTasks", JSON.stringify(tasks));
}


// Add a new assignment
taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("taskName").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const deadline = document.getElementById("deadline").value;
    const priority = document.getElementById("priority").value;

    if (!name || !subject || !deadline) {
        alert("Please fill in all the fields.");
        return;
    }

    const task = {
        id: Date.now(),
        name: name,
        subject: subject,
        deadline: deadline,
        priority: priority,
        completed: false
    };

    tasks.push(task);

    saveTasks();
    renderApp();

    taskForm.reset();
});


// Display assignments
function displayTasks() {

    taskList.innerHTML = "";

    const filter = filterTasks.value;

    const filteredTasks = tasks.filter(task => {
        if (filter === "pending") {
            return !task.completed;
        }

        if (filter === "completed") {
            return task.completed;
        }

        return true;
    });

    if (filteredTasks.length === 0) {
        taskList.innerHTML =
            '<p class="empty">No assignments found.</p>';
        return;
    }

    filteredTasks.sort((a, b) =>
        a.deadline.localeCompare(b.deadline)
    );

    filteredTasks.forEach(task => {

        const taskCard = document.createElement("div");

        taskCard.className = "task-item";

        if (task.completed) {
            taskCard.classList.add("is-completed");
        }

        const details = document.createElement("div");

        const title = document.createElement("h3");
        title.textContent = task.name;

        const subject = document.createElement("p");
        subject.textContent = "Subject: " + task.subject;

        const deadline = document.createElement("p");
        deadline.textContent = "Deadline: " + task.deadline;

        const priority = document.createElement("p");
        priority.textContent = "Priority: " + task.priority;
        priority.className = "priority " +
            task.priority.toLowerCase();

        const status = document.createElement("p");
        status.textContent = task.completed
            ? "Status: Completed"
            : "Status: Pending";

        details.appendChild(title);
        details.appendChild(subject);
        details.appendChild(deadline);
        details.appendChild(priority);
        details.appendChild(status);

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const completeButton = document.createElement("button");

        completeButton.textContent = task.completed
            ? "Undo"
            : "Complete";

        completeButton.className = "complete-btn";

        completeButton.addEventListener("click", function() {
            toggleTask(task.id);
        });

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", function() {
            deleteTask(task.id);
        });

        actions.appendChild(completeButton);
        actions.appendChild(deleteButton);

        taskCard.appendChild(details);
        taskCard.appendChild(actions);

        taskList.appendChild(taskCard);
    });
}


// Mark task as completed or pending
function toggleTask(id) {

    tasks = tasks.map(task => {
        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    saveTasks();
    renderApp();
}


// Delete an assignment
function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderApp();
}


// Update summary cards
function updateSummary() {

    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const pending = total - completed;

    document.getElementById("totalTasks").textContent = total;

    document.getElementById("pendingTasks").textContent = pending;

    document.getElementById("completedTasks").textContent = completed;
}


// Filter assignments
filterTasks.addEventListener("change", function() {
    displayTasks();
});


// Update the complete application
function renderApp() {
    updateSummary();
    displayTasks();
}


// Load saved tasks when the page opens
renderApp();
