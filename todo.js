let todos = [];

// Function to render the todo list
function renderTodos() {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';

    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="todo-item">${todo.title}</span>
            <input type="text" class="edit-input" style="display: none;" value="${todo.title}">
            <div>
                <button class="delete-btn" onclick="deleteTodo(${index})">Delete</button>
                <button class="edit-btn" onclick="editTodo(${index})">Edit</button>
                <button class="save-btn" onclick="saveTodo(${index})" style="display: none;">Save</button>
            </div>
        `;
        todoList.appendChild(li);
    });
}

function addTodo() {
    const todoInput = document.getElementById('todoInput');
    const todoTitle = todoInput.value.trim();

    if (todoTitle !== '') {
        todos.push({ title: todoTitle });
        renderTodos();
        todoInput.value = '';
        updateLocalStorage();
    }
}

function deleteTodo(index) {
    todos.splice(index, 1);
    renderTodos();
    updateLocalStorage();
}

//edit todo
function editTodo(index) {
    const todoItem = document.getElementsByClassName('todo-item')[index];
    const editInput = document.getElementsByClassName('edit-input')[index];
    const editBtn = document.getElementsByClassName('edit-btn')[index];
    const saveBtn = document.getElementsByClassName('save-btn')[index];

    todoItem.style.display = 'none';
    editInput.style.display = 'inline-block';
    editInput.value = todoItem.innerText;
    editBtn.style.display = 'none';
    saveBtn.style.display = 'inline-block';
}

// save the edited todo
function saveTodo(index) {
    const todoItem = document.getElementsByClassName('todo-item')[index];
    const editInput = document.getElementsByClassName('edit-input')[index];
    const editBtn = document.getElementsByClassName('edit-btn')[index];
    const saveBtn = document.getElementsByClassName('save-btn')[index];

    todos[index].title = editInput.value.trim();
    todoItem.innerText = editInput.value.trim();
    todoItem.style.display = 'inline-block';
    editInput.style.display = 'none';
    editBtn.style.display = 'inline-block';
    saveBtn.style.display = 'none';
    updateLocalStorage();
}

//update the local storage
function updateLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Fetch data from API
if (!localStorage.getItem('todos')) {
    fetch('https://jsonplaceholder.typicode.com/todos')
        .then(response => response.json())
        .then(data => {
            todos = data; // Assign API data to todos array
            renderTodos();
            updateLocalStorage();
        })
        .catch(error => console.log(error));
} else {
    todos = JSON.parse(localStorage.getItem('todos'));
    renderTodos();
}

// Event listener for the add button
document.getElementById('addBtn').addEventListener('click', addTodo);
