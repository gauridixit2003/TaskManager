window.addEventListener('load', () => {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    const nameInput = document.querySelector('#name');
    const newTodoForm = document.querySelector('#new-todo-form');

    const username = localStorage.getItem('username') || '';
    nameInput.value = username;

    nameInput.addEventListener('change', (e) => {
        localStorage.setItem('username', e.target.value);
    })

    const sortButton = document.querySelector('#sort-button');
    const sortOptions = document.querySelector('#sort-options');

    sortButton.addEventListener('click', () => {
        sortOptions.style.display = sortOptions.style.display === 'block' ? 'none' : 'block';
    });

    sortOptions.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            const sortBy = e.target.getAttribute('data-sortby');
            DisplayTodos(sortBy);
            sortOptions.style.display = 'none';
        }
    });

    const todoListContainer = document.querySelector('#todo-list');
    const searchInput = document.querySelector('#search-input');

    function filterTasks(searchTerm) {
        todoListContainer.innerHTML = '';

        const filteredTasks = todos.filter(task =>
            task.content.toLowerCase().includes(searchTerm.toLowerCase())
        );

        filteredTasks.forEach(task => {
            const todoItem = document.createElement('div');
            todoItem.classList.add('todo-item');

            const label = document.createElement('label');
            const input = document.createElement('input');
            const span = document.createElement('span');
            const contentDiv = document.createElement('div');
            const actions = document.createElement('div');
            const edit = document.createElement('button');
            const deleteButton = document.createElement('button');
            const dueDate = document.createElement('div');

            input.type = 'checkbox';
            input.checked = task.done;
            span.classList.add('bubble');
            if (task.category == 'personal') {
                span.classList.add('personal');
            } else {
                span.classList.add('business');
            }
            contentDiv.classList.add('todo-content');
            actions.classList.add('actions');
            edit.classList.add('edit');
            deleteButton.classList.add('delete');
            dueDate.classList.add('date-due');
            dueDate.textContent = `Due: ${new Date(task.dueDate).toLocaleString()}`;

            contentDiv.textContent = task.content;
            edit.innerHTML = "Edit";
            deleteButton.innerHTML = '<i class="fa fa-trash">';

            label.appendChild(input);
            label.appendChild(span);
            actions.appendChild(edit);
            actions.appendChild(deleteButton);
            todoItem.appendChild(label);
            todoItem.appendChild(contentDiv);
            todoItem.appendChild(actions);
            todoItem.appendChild(dueDate);

            todoListContainer.appendChild(todoItem);
        });
    }

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.trim();
        filterTasks(searchTerm);
    });

    newTodoForm.addEventListener('submit', e => {
        e.preventDefault();

        const dueDateInput = e.target.elements.dueDate;
        const dueDateValue = new Date(dueDateInput.value).getTime();
        const currentDate = new Date().getTime();

        if (dueDateValue < currentDate) {
            alert("Due date cannot be in the past.");
        } else {
            const todo = {
                content: e.target.elements.content.value,
                category: e.target.elements.category.value,
                dueDate: dueDateValue,
                done: false,
                createdAt: currentDate
            }

            todos.push(todo);

            localStorage.setItem('todos', JSON.stringify(todos));

            e.target.reset();

            DisplayTodos();
        }
    });

    function DisplayTodos(sortBy = 'createdAt', todoItems = todos) {
        const todoList = document.querySelector('#todo-list');
        todoList.innerHTML = "";

        if (sortBy == 'category') {
            todos.sort((a, b) => a.category.localeCompare(b.category));
        } else {
            todos.sort((a, b) => a[sortBy] - b[sortBy]);
        }

        todoItems.reverse();

        todos.forEach(todo => {
            const todoItem = document.createElement('div');
            todoItem.classList.add('todo-item');

            const label = document.createElement('label');
            const input = document.createElement('input');
            const span = document.createElement('span');
            const content = document.createElement('div');
            const actions = document.createElement('div');
            const edit = document.createElement('button');
            const deleteButton = document.createElement('button');
            const dueDate = document.createElement('div');

            input.type = 'checkbox';
            input.checked = todo.done;
            span.classList.add('bubble');
            if (todo.category == 'personal') {
                span.classList.add('personal');
            } else {
                span.classList.add('business');
            }
            content.classList.add('todo-content');
            actions.classList.add('actions');
            edit.classList.add('edit');
            deleteButton.classList.add('delete');
            dueDate.classList.add('date-due');
            dueDate.textContent = `Due: ${new Date(todo.dueDate).toLocaleString()}`;

            content.innerHTML = `<input type="text" value="${todo.content}" readonly>`;
            edit.innerHTML = "Edit";
            deleteButton.innerHTML = '<i class="fa fa-trash">';

            label.appendChild(input);
            label.appendChild(span);
            actions.appendChild(edit);
            actions.appendChild(deleteButton);
            todoItem.appendChild(label);
            todoItem.appendChild(content);
            todoItem.appendChild(actions);
            todoItem.appendChild(dueDate);

            todoList.appendChild(todoItem);

            if (todo.done) {
                todoItem.classList.add('done');
            }

            input.addEventListener('change', (e) => {
                todo.done = e.target.checked;
                localStorage.setItem('todos', JSON.stringify(todos));

                if (todo.done) {
                    todoItem.classList.add('done');
                } else {
                    todoItem.classList.remove('done');
                }

                DisplayTodos()
            });

            edit.addEventListener('click', (e) => {
                const input = content.querySelector('input');
                input.removeAttribute('readonly');
                input.focus();
                input.addEventListener('blur', (e) => {
                    input.setAttribute('readonly', true);
                    todo.content = e.target.value;
                    localStorage.setItem('todos', JSON.stringify(todos));
                    DisplayTodos()
                })
            });

            deleteButton.addEventListener('click', (e) => {
                todos = todos.filter(t => t !== todo);
                localStorage.setItem('todos', JSON.stringify(todos));
                DisplayTodos()
            })
        });
    }

    DisplayTodos();
});
