const taskInput = document.getElementById("taskInput");
const taskPriority = document.getElementById("taskPriority");
const taskDueDate = document.getElementById("taskDueDate");
const addTaskButton = document.getElementById("addTaskButton");

const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");

const themeButton = document.getElementById("themeButton");
const filterButtons = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem("taskflowTasks")) || [];
let currentFilter = "all";


// =========================
// SALVAR TAREFAS
// =========================

function saveTasks() {
    localStorage.setItem("taskflowTasks", JSON.stringify(tasks));
}


// =========================
// ADICIONAR TAREFA
// =========================

function addTask() {
    const title = taskInput.value.trim();

    if (title === "") {
        alert("Digite uma tarefa primeiro.");
        return;
    }

    const newTask = {
        id: Date.now(),
        title: title,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";

    renderTasks();

    taskInput.focus();
}


// =========================
// EXCLUIR TAREFA
// =========================

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

    renderTasks();
}


// =========================
// CONCLUIR / DESCONCLUIR
// =========================

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

    renderTasks();
}


// =========================
// EDITAR TAREFA
// =========================

function editTask(id) {
    const task = tasks.find(task => task.id === id);

    if (!task) {
        return;
    }

    const newTitle = prompt(
        "Edite sua tarefa:",
        task.title
    );

    if (newTitle === null) {
        return;
    }

    const cleanTitle = newTitle.trim();

    if (cleanTitle === "") {
        alert("A tarefa não pode ficar vazia.");
        return;
    }

    task.title = cleanTitle;

    saveTasks();

    renderTasks();
}


// =========================
// FILTRAR TAREFAS
// =========================

function getFilteredTasks() {
    if (currentFilter === "pending") {
        return tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        return tasks.filter(task => task.completed);
    }

    return tasks;
}


// =========================
// PROTEGER TEXTO HTML
// =========================

function escapeHTML(text) {
    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// =========================
// MOSTRAR TAREFAS
// =========================

function renderTasks() {
    const filteredTasks = getFilteredTasks();

    taskList.innerHTML = "";

    if (filteredTasks.length === 0) {
        emptyState.style.display = "block";
    } else {
        emptyState.style.display = "none";
    }

    filteredTasks.forEach(task => {
        const taskElement = document.createElement("div");

        taskElement.classList.add("task");

        if (task.completed) {
            taskElement.classList.add("completed");
        }

        taskElement.innerHTML = `
            <button
                class="check-button"
                type="button"
                aria-label="Concluir tarefa"
            ></button>

            <div class="task-content">
                <p class="task-title">
                    ${escapeHTML(task.title)}
                </p>
            </div>

            <div class="task-actions">

                <button
                    class="action-button edit-button"
                    type="button"
                    title="Editar tarefa"
                >
                    ✏️
                </button>

                <button
                    class="action-button delete-button"
                    type="button"
                    title="Excluir tarefa"
                >
                    🗑️
                </button>

            </div>
        `;

        const checkButton =
            taskElement.querySelector(".check-button");

        const editButton =
            taskElement.querySelector(".edit-button");

        const deleteButton =
            taskElement.querySelector(".delete-button");


        checkButton.addEventListener("click", () => {
            toggleTask(task.id);
        });


        editButton.addEventListener("click", () => {
            editTask(task.id);
        });


        deleteButton.addEventListener("click", () => {
            deleteTask(task.id);
        });


        taskList.appendChild(taskElement);
    });

    updateStats();
}


// =========================
// ATUALIZAR ESTATÍSTICAS
// =========================

function updateStats() {
    const total = tasks.length;

    const completed =
        tasks.filter(task => task.completed).length;

    const pending =
        total - completed;

    const progress =
        total === 0
            ? 0
            : Math.round((completed / total) * 100);


    totalTasks.textContent = total;

    completedTasks.textContent = completed;

    pendingTasks.textContent = pending;

    progressText.textContent = `${progress}%`;

    progressFill.style.width = `${progress}%`;
}


// =========================
// BOTÃO ADICIONAR
// =========================

addTaskButton.addEventListener("click", addTask);


// =========================
// ENTER PARA ADICIONAR
// =========================

taskInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addTask();
    }
});


// =========================
// FILTROS
// =========================

filterButtons.forEach(button => {
    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentFilter =
            button.dataset.filter;

        renderTasks();
    });
});


// =========================
// TEMA CLARO / ESCURO
// =========================

themeButton.addEventListener("click", () => {

    document.body.classList.toggle("light");

    const isLight =
        document.body.classList.contains("light");

    themeButton.textContent =
        isLight ? "☀️" : "🌙";

    localStorage.setItem(
        "taskflowTheme",
        isLight ? "light" : "dark"
    );
});


// =========================
// CARREGAR TEMA SALVO
// =========================

const savedTheme =
    localStorage.getItem("taskflowTheme");

if (savedTheme === "light") {

    document.body.classList.add("light");

    themeButton.textContent = "☀️";
}


// =========================
// INICIAR PROJETO
// =========================

renderTasks();