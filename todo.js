
//search based on user input
function performSearch() {
    const searchTerm = document.getElementById('searchTerm').value.trim().toLowerCase();
    const filteredTodos = todos.filter(todo => {
      // Check main task title
      if (todo.title.toLowerCase().includes(searchTerm)) {
        return true;
      }
      // Check subtasks
      if (todo.subtasks && todo.subtasks.length) {
        const subtaskMatches = todo.subtasks.some(subtask => subtask.title.toLowerCase().includes(searchTerm));
        if (subtaskMatches) {
          return true;
        }
      }
      // Check tags
      if (todo.tags && todo.tags.length) {
        const tagMatches = todo.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        if (tagMatches) {
          return true;
        }
      }
      // Check category
      if (todo.category && todo.category.toLowerCase().includes(searchTerm)) {
        return true;
      }
      return false;
    });
    renderTodos(filteredTodos);
  }
  

// clear the search and show all tasks
function clearSearch() {
    document.getElementById('searchTerm').value = '';
    renderTodos(todos);
}

//  event listeners for search button and clear search button
document.getElementById('searchBtn').addEventListener('click', performSearch);
document.getElementById('clearSearchBtn').addEventListener('click', clearSearch);


  let todos = [];
// render the todo list
function renderTodos(filteredTodos) {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';
  
    filteredTodos.forEach((todo, index) => {
      const li = document.createElement('li');
        li.draggable = true; 
        li.dataset.index = index;
        li.addEventListener('dragstart', handleDragStart);
        li.addEventListener('dragover', handleDragOver);
        li.addEventListener('drop', handleDrop);
      li.innerHTML = `
          <span class="todo-item${todo.completed ? ' done' : ''}">${todo.title}</span>
          <input type="text" class="edit-input" style="display: none;" value="${todo.title}">
          <span class="category">${todo.category ? `[${todo.category}]` : ''}</span>
          <span class="due-date">${todo.dueDate ? `[Due: ${todo.dueDate}]` : ''}</span>
          <span class="priority">${todo.priority ? `[${todo.priority}]` : ''}</span>
          <span class="tags">${todo.tags && todo.tags.length ? renderTags(todo.tags) : ''}</span>
          <div>
              <button class="done-btn" onclick="toggleDone(${index})">${todo.completed ? 'Undone' : 'Done'}</button>
              <button class="delete-btn" onclick="deleteTodo(${index})">Delete</button>
              <button class="edit-btn" onclick="editTodo(${index})">Edit</button>
              <button class="save-btn" onclick="saveTodo(${index})" style="display: none;">Save</button>
              <button class="add-subtask-btn" onclick="addSubtask(${index})">Add Subtask</button>
          </div>
          ${todo.subtasks && todo.subtasks.length ? `<ul class="subtask-list-${index}">${renderSubtasks(todo.subtasks, index)}</ul>` : ''}
      `;
      todoList.appendChild(li);
    });
  }
  
// renderSubtasks function
function renderSubtasks(subtasks, todoIndex) {
    return `
    <ul class="subtask-list" data-todo-index="${todoIndex}">
      ${subtasks.map((subtask, subtaskIndex) => `
        <li draggable="true" data-todo-index="${todoIndex}" data-subtask-index="${subtaskIndex}" data-subtask-draggable="true">
          <input type="checkbox" onchange="toggleSubtask(${todoIndex}, ${subtaskIndex})" ${subtask.completed ? 'checked' : ''}>
          <span class="subtask-item${subtask.completed ? ' done' : ''}">${subtask.title}</span>
          <button class="delete-subtask-btn" onclick="deleteSubtask(${todoIndex}, ${subtaskIndex})">Delete</button>
        </li>
      `).join('')}
      ${todos[todoIndex].addingSubtask ?
      `<li>
          <input type="text" class="add-subtask-input">
      </li>` :
      ''}
    </ul>
  `;
}

//  handle drag start event
function handleDragStart(event) {
    const target = event.target;
    event.dataTransfer.setData('text/plain', target.dataset.index);
    event.dataTransfer.effectAllowed = 'move';
  }
  
  // handle drag over event
  function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }
  
  // handle drop event
  function handleDrop(event) {
    event.preventDefault();
    const sourceIndex = event.dataTransfer.getData('text/plain');
    const targetIndex = event.target.dataset.index;
    if (sourceIndex && targetIndex) {
      if (sourceIndex !== targetIndex) {
        // Reorder main tasks
        const todoToMove = todos[sourceIndex];
        todos.splice(sourceIndex, 1);
        todos.splice(targetIndex, 0, todoToMove);
        renderTodos(todos);
        updateLocalStorage();
      }
    } else {
      const sourceTodoIndex = event.target.dataset.todoIndex;
      const sourceSubtaskIndex = event.target.dataset.subtaskIndex;
      const targetTodoIndex = event.currentTarget.dataset.todoIndex;
      const targetSubtaskIndex = event.currentTarget.dataset.subtaskIndex;
  
      // Reorder subtasks
      const subtaskToMove = todos[sourceTodoIndex].subtasks[sourceSubtaskIndex];
      todos[sourceTodoIndex].subtasks.splice(sourceSubtaskIndex, 1);
      todos[targetTodoIndex].subtasks.splice(targetSubtaskIndex, 0, subtaskToMove);
      renderTodos(todos);
      updateLocalStorage();
    }
  }

  function addSubtask(todoIndex) {
    const subtaskInput = prompt('Enter a subtask:');
    if (subtaskInput) {
      if (!todos[todoIndex].subtasks) {
        todos[todoIndex].subtasks = [];
      }
      todos[todoIndex].subtasks.push({ title: subtaskInput, completed: false });
      todos[todoIndex].subtaskEditMode = undefined; // Clear the edit mode
      renderTodos(todos);
      updateLocalStorage();
    }
  }

  
// delete a subtask
function deleteSubtask(todoIndex, subtaskIndex) {
    todos[todoIndex].subtasks.splice(subtaskIndex, 1);
    renderTodos(todos);
    updateLocalStorage();
  }

  // disable the input field for adding a subtask
function disableAddSubtask(todoIndex) {
    todos[todoIndex].addingSubtask = false;
  }
  
  //  enable the input field for adding a subtask
  function enableAddSubtask(todoIndex) {
    todos[todoIndex].addingSubtask = true;
  }
  
  
//  render tags
function renderTags(tags) {
    return tags.map(tag => `<span class="tag">${tag}</span>`).join(' ');
  }

  // function to get month

  function getMonthNumber(monthName) {
    const months = {
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
      'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };
  
    if (monthName in months) {
      return months[monthName];
    }
  
    return undefined;
  }

// add a new todo
function addTodo() {
    const todoInput = document.getElementById('todoInput');
    const todoTitle = todoInput.value.trim();
    const categoryInput = document.getElementById('categoryInput');
    const todoCategory = categoryInput.value.trim();
    const dueDateInput = document.getElementById('dueDateInput');
    const todoDueDate = dueDateInput.value.trim();
    const priorityInput = document.getElementById('priorityInput');
    const todoPriority = priorityInput.value;
    const tagsInput = document.getElementById('tagsInput');
    const todoTags = tagsInput.value.trim().split(',').map(tag => tag.trim());
  
    if (todoTitle !== '') {
      let dueDate;
  
      // Check for the due date in the todo task title
      const dueDateMatch = todoTitle.match(/by\s+(tomorrow|today|\d{4}-\d{2}-\d{2}|(\d{1,2})(st|nd|rd|th)\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4})/i);
  
      if (dueDateMatch) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
  
        // if there is keywords like "today" and "tomorrow"
        if (/tomorrow/i.test(dueDateMatch[1])) {
          dueDate = tomorrow;
        } else if (/today/i.test(dueDateMatch[1])) {
          dueDate = today;
        } else if (dueDateMatch[2] && dueDateMatch[3]) {
          const day = parseInt(dueDateMatch[2]);
          const month = getMonthNumber(dueDateMatch[3]);
          const year = today.getFullYear();
  
          if (day && month !== undefined) {
            
            const daySuffix = dueDateMatch[2].slice(-2);
            const numericDay = parseInt(dueDateMatch[2].slice(0, -2));
  
            if (!isNaN(numericDay) && !isNaN(month) && year) {
              dueDate = new Date(year, month, numericDay);
  
            
              const endOfDay = new Date(dueDate);
              endOfDay.setHours(23, 59, 59);
  
              if (dueDate < today) { 
                dueDate = new Date(year + 1, month, numericDay);
              } else if (dueDate > endOfDay) {
                dueDate.setDate(dueDate.getDate() + 1);
              }
            }
          }
        } else {
          dueDate = new Date(dueDateMatch[1]);
        }
  
        dueDateInput.valueAsDate = dueDate;
      } else if (todoDueDate !== '') {
    
        dueDate = new Date(todoDueDate);
      }
  
      todos.push({
        title: todoTitle.replace(/(by\s+tomorrow|by\s+today|\d{4}-\d{2}-\d{2}|(\d{1,2})(st|nd|rd|th)\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4})/gi, '').trim(),
        completed: false,
        category: todoCategory,
        dueDate: dueDate ? dueDate.toISOString().substring(0, 10) : undefined,
        priority: todoPriority,
        subtasks: [],
        tags: todoTags 
      });
  
      renderTodos(todos);
      todoInput.value = '';
      categoryInput.value = '';
      dueDateInput.value = '';
      priorityInput.value = '';
      tagsInput.value = '';
      updateLocalStorage();
      logActivity(`Task added: "${todoTitle}"`);
    }
  }
  
  
//delete a todo
function deleteTodo(index) {
  todos.splice(index, 1);
  renderTodos(todos);
  updateLocalStorage();

  logActivity(`Task deleted: "${deletedTodo.title}"`);
}

// mark task as done or undone
function toggleDone(index) {
  todos[index].completed = !todos[index].completed;
  renderTodos(todos);
  updateLocalStorage();
}

//edit a todo
function editTodo(index) {
  const todoItem = document.getElementsByClassName('todo-item')[index];
  const categorySpan = document.getElementsByClassName('category')[index];
  const dueDateSpan = document.getElementsByClassName('due-date')[index];
  const prioritySpan = document.getElementsByClassName('priority')[index];
  const editInput = document.getElementsByClassName('edit-input')[index];
  const editBtn = document.getElementsByClassName('edit-btn')[index];
  const saveBtn = document.getElementsByClassName('save-btn')[index];

  todoItem.style.display = 'none';
  categorySpan.style.display = 'none';
  dueDateSpan.style.display = 'none';
  prioritySpan.style.display = 'none';
  editInput.style.display = 'inline-block';
  editInput.value = todoItem.innerText;
  editBtn.style.display = 'none';
  saveBtn.style.display = 'inline-block';
}

//save the edited todo
function saveTodo(index) {
  const todoItem = document.getElementsByClassName('todo-item')[index];
  const categorySpan = document.getElementsByClassName('category')[index];
  const dueDateSpan = document.getElementsByClassName('due-date')[index];
  const prioritySpan = document.getElementsByClassName('priority')[index];
  const editInput = document.getElementsByClassName('edit-input')[index];
  const editBtn = document.getElementsByClassName('edit-btn')[index];
  const saveBtn = document.getElementsByClassName('save-btn')[index];

  todos[index].title = editInput.value.trim();
  todoItem.innerText = editInput.value.trim();
  todoItem.style.display = 'inline-block';
  categorySpan.style.display = 'inline';
  dueDateSpan.style.display = 'inline';
  prioritySpan.style.display = 'inline';
  editInput.style.display = 'none';
  editBtn.style.display = 'inline-block';
  saveBtn.style.display = 'none';
  updateLocalStorage();

  logActivity(`Task edited: "${todos[index].title}"`);
}
// sort tasks by due date
function sortByDueDate() {
    todos.sort((a, b) => {
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      } else if (a.dueDate) {
        return -1;
      } else if (b.dueDate) {
        return 1;
      }
      return 0;
    });
    renderTodos(todos);
  }
  
  // sort tasks by priority
  function sortByPriority() {
    const priorityValues = { 'low': 1, 'medium': 2, 'high': 3 };
    todos.sort((a, b) => {
      return priorityValues[a.priority] - priorityValues[b.priority];
    });
    renderTodos(todos);
  }
  
  //sort tasks by title
  function sortByTitle() {
    todos.sort((a, b) => {
      return a.title.localeCompare(b.title);
    });
    renderTodos(todos);
  }
  
  
  // mark subtask completion
function toggleSubtask(todoIndex, subtaskIndex) {
    todos[todoIndex].subtasks[subtaskIndex].completed = !todos[todoIndex].subtasks[subtaskIndex].completed;
    renderTodos(todos);
    updateLocalStorage();
  }
  

//  update the local storage
function updateLocalStorage() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

// fetch data from local storage when the page is loaded
function fetchFromLocalStorage() {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      todos = JSON.parse(storedTodos);
  
      // expiring tasks 
      todos.forEach((todo) => {
        if (todo.dueDate) {
          const dueDate = new Date(todo.dueDate);
          const currentTime = new Date();
          const timeDiff = dueDate.getTime() - currentTime.getTime();
  
          const reminderThreshold = 24 * 60 * 60 * 1000;
  
          if (timeDiff <= reminderThreshold && timeDiff > 0) {
            // Show alert for tasks expiring within the reminder threshold
            setTimeout(() => {
              alert(`Reminder: Task "${todo.title}" is due soon!`);
            }, timeDiff);
          } else if (timeDiff < 0) {
            // Show alert for tasks that have already expired
            alert(`Reminder: Task "${todo.title}" is overdue!`);
          }
        }
      });
    }
    renderTodos(todos); 
}

// apply filters and render the filtered todos
function applyFilters() {
    const dueDateFilterStart = document.getElementById('dueDateFilterStart').value;
    const dueDateFilterEnd = document.getElementById('dueDateFilterEnd').value;
    const categoryFilter = document.getElementById('categoryFilter').value.toLowerCase();
    const priorityFilter = document.getElementById('priorityFilter').value;
  
    let filteredTodos = todos.filter(todo => {
      if (dueDateFilterStart && new Date(todo.dueDate) < new Date(dueDateFilterStart)) {
        return false;
      }
  
      if (dueDateFilterEnd && new Date(todo.dueDate) > new Date(dueDateFilterEnd)) {
        return false;
      }
  
      if (categoryFilter && todo.category.toLowerCase().indexOf(categoryFilter) === -1) {
        return false;
      }
  
      if (priorityFilter && todo.priority !== priorityFilter) {
        return false;
      }
  
      return true;
    });
  
    renderTodos(filteredTodos);
}

//  clear the filters and render all todos
function clearFilters() {
    document.getElementById('dueDateFilterStart').value = '';
    document.getElementById('dueDateFilterEnd').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('priorityFilter').value = '';
    renderTodos(todos);
}

//  view backlogs
function viewBacklogs() {
    const currentDate = new Date();
    const backlogs = todos.filter(todo => {
      return !todo.completed && todo.dueDate && new Date(todo.dueDate) < currentDate;
    });
    renderTodos(backlogs);
  }
  
  // view all tasks
  function viewAllTasks() {
    renderTodos(todos);
  }
  
  // event listeners for View Backlogs and View All Tasks buttons
  document.getElementById('viewBacklogsBtn').addEventListener('click', viewBacklogs);
  document.getElementById('viewAllTasksBtn').addEventListener('click', viewAllTasks);
  
//  event listeners for buttons
function initializeEventListeners() {
  document.getElementById('addBtn').addEventListener('click', addTodo);
  document.getElementById('applyFilters').addEventListener('click', applyFilters);
  document.getElementById('clearFilters').addEventListener('click', clearFilters);
}

// Event listeners for sorting buttons
document.getElementById('sortDueDateBtn').addEventListener('click', sortByDueDate);
document.getElementById('sortPriorityBtn').addEventListener('click', sortByPriority);
document.getElementById('sortTitleBtn').addEventListener('click', sortByTitle);

// Fetch data from local storage
fetchFromLocalStorage();
initializeEventListeners();