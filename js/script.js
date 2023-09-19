(function(){
    const todoList = document.getElementById('todo__list');
    const userSelect = document.getElementById('user-todo');
    const form = document.querySelector('form');
    let todos = [];
    let users = [];
    
    document.addEventListener('DOMContentLoaded', initApp);
    form.addEventListener('submit', handleSubmit);
    
    function initApp() {
        Promise.all([getAllTodos(), getAllUsers()]).then(values => {
            [todos, users] = values;
            todos.forEach((todo) => printTodo(todo));
            users.forEach((user) => createUserOption(user));
        })
    }
    
    function handleSubmit(event) {
        event.preventDefault();
    
        createTodo({
            userId: Number(form.user.value),
            title: form.todo.value,
            complited: false,
        });
    }
    
    function handleTodoChange() {
        const todoId = this.parentElement.dataset.id;
        const complited = this.checked;
    
        toggleTodoComplete(todoId, complited);
    }
    
    function handleClose() {
        const todoId = this.parentElement.dataset.id;
        deleteTodo(todoId);
    }
    
    function createUserOption(user) {
        const option = document.createElement('option');
        option.value = user.id;
        option.innerText = user.name;
        userSelect.append(option);
    }
    
    function removeTodo(todoId){
        todos = todos.filter(todo => todo.id !== todoId);
    
        const todo = todoList.querySelector(`[data-id="${todoId}"]`);
        todo.querySelector('input').removeEventListener('change', handleTodoChange);
        todo.querySelector('.close').removeEventListener('click', handleClose);
    
        todo.remove();
    } 
    
    function alertError(error){
        alert(error.massage);
    }
    
    function getUserName(userId) {
        const user = users.find(u => u.id === userId)
        return user.name;
    }
    function printTodo({ userId, id, title, completed }) {
        const li = document.createElement('li');
        li.className = 'todo__item';
        li.dataset.id = id;
        li.innerHTML = `<span>${title} <i>by</i> <b>${getUserName(userId)}</b></span>`
    
        const status = document.createElement('input');
        status.type = 'checkbox';
        status.checked = completed;
        status.addEventListener('change', handleTodoChange);
    
        const close = document.createElement('span');
        close.innerHTML = '&times;';
        close.className = 'close';
        close.addEventListener('click', handleClose);
    
        li.prepend(status);
        li.append(close);
        todoList.prepend(li);
    }
    
    async function getAllTodos() {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/todos');
            const data = await response.json();
        
            return data;
            
        } catch (error) {
            alertError(error);
        }
    }
    async function getAllUsers() {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/users');
            const data = await response.json();
        
            return data;
            
        } catch (error) {
            alertError(error); 
        }
    }
    async function createTodo(todo) {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
                method: 'POST',
                body: JSON.stringify(todo),
                headers:
                    { 'Content-Type': 'application/json' },
            });
        
            const todoId = response.json;
        
            printTodo({ id: todoId, ...todo });
            
        } catch (error) {
            alertError(error);
        }
    }
    
    async function toggleTodoComplete(todoId, complited) {
        try {
            const response = await fetch(
                `https://jsonplaceholder.typicode.com/todos/${todoId}`, {
                method: 'PATCH',
                body: JSON.stringify({ complited }),
                headers:
                    { 'Content-Type': 'application/json' },
            });
            
            if(!response.ok){
                throw new Error('Failed to connection with server!')
            }
        } catch (error) {
            alertError(error);
        }
    
    }
    
    async function deleteTodo(todoId) {
    
        try {
            const response = await fetch(
                `https://jsonplaceholder.typicode.com/todos/${todoId}`, {
                method: 'DELETE',
                headers:
                    { 'Content-Type': 'application/json' },
            });
        
            if(response.ok) {
                removeTodo(todoId);
            }
            
        } catch (error) {
            alertError(error);
        }
    }
})()
