const todoForm = document.querySelector("#todo-form");
const todoList = document.querySelector(".todos");
const totalTasks = document.querySelector("#total-tasks");
const completedTasks = document.querySelector("#completed-tasks");
const remainingTasks = document.querySelector("#remaining-tasks");
const mainInput = document.querySelector("#todo-form input");

var tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const countTasks = () => {
    const completedTasksArray = tasks.filter((task) => task.isCompleted === true)

    totalTasks.textContent = tasks.length
    completedTasks.textContent = completedTasksArray.length
    remainingTasks.textContent = (tasks.length - completedTasksArray.length)
}

const createTask = (task) => {
    const taskElement = document.createElement('li')
    taskElement.setAttribute('id', task.id)

    if(task.isCompleted){
        taskElement.classList.add('complete')
    }

    const taskElementMarkup = `
    <div>
        <input type="checkbox" name="tasks" id=${task.id} ${task.isCompleted ? 'checked' : ''}>
        <span ${!task.isCompleted ? "contenteditable" : ""}> ${task.name} </span>
    </div>

    <button title="Remove the ${task.name} task" class="remove-task">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.25 17.25L6.75 6.75" stroke="#A4D0E3" stroke-width="1.5" stroke-linecap="round"
                stroke-linejoin="round" />
            <path d="M17.25 6.75L6.75 17.25" stroke="#A4D0E3" stroke-width="1.5" stroke-linecap="round"
                stroke-linejoin="round" />
        </svg>
    </button>
    `
    taskElement.innerHTML = taskElementMarkup
    todoList.appendChild(taskElement)

    countTasks()
};

if (localStorage.getItem('tasks')) {
    tasks.map((task) => {
        createTask(task);
    })
}

todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputValue = mainInput.value;
    if (inputValue == '') {
        return
    }

    const task = {
        id : new Date().getTime(),
        name: inputValue,
        isCompleted: false
    }

    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    createTask(task);
    todoForm.reset();
    mainInput.focus();
})

todoList.addEventListener('click', (e) => {
   if (e.target.classList.contains('remove-task') || e.target.parentElement.classList.contains('remove-task') || e.target.parentElement.parentElement.classList.contains('remove-task')) {
        const taskId = e.target.closest('li').id;
        removeTask(taskId);
   } 
})

todoList.addEventListener('input', (e) => {
    const taskId = e.target.closest('li').id;
    updateTask(taskId, e.target);
})

function removeTask(taskId) {
    tasks = tasks.filter(task => task.id !== parseInt(taskId))

    localStorage.setItem('tasks', JSON.stringify(tasks));
    document.getElementById(taskId).remove();
    countTasks();
}

const updateTask = (taskId, el) => {
    const task = tasks.find((task) => task.id === parseInt(taskId))

    if (el.hasAttribute('contenteditable')) {
        task.name = el.textContent;
    } else {
        const span = el.nextElementSibling;
        const parent = el.closest('li');

        task.isCompleted = !task.isCompleted;

        if (task.isCompleted) {
            span.removeAttribute('contenteditable');
            parent.classList.add('complete');
        } else {
            span.setAttribute('contenteditable', 'true');
            parent.classList.remove('complete');   
        }
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));
    countTasks();
}