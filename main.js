const app = document.querySelector('#app');

app.innerHTML = `
    <div class="todos">
        <div class="todos-header">
            <h3 class="todos-title">PENDIENTES</h3>
            <div>
                <p>Tienes <span class="todos-count"></span> Item/s por hacer!! </p>
                <button type="button" class="todos-clear" style="display:none;" >Borra Completados</button>
            </div>
        </div>
        <form class="todos-form" name="todos">
            <input type="text" placeholder="Ingresa tu tarea a realizar" name="todo">
            <small>No se escribió nada</small>
        </form>
        <ul class="todos-list">
        </ul>
    </div>
`;

const saveInLocalStorage = (todos) => {
  localStorage.setItem("todos", JSON.stringify(todos));
}

//Selectores

const root = document.querySelector('.todos');
const list = root.querySelector('.todos-list');
const count = root.querySelector('.todos-count');
const clear = root.querySelector('.todos-clear');
const form = document.forms.todos;
const input = form.elements.todo;


//Lista de ToDos
let state = JSON.parse(localStorage.getItem("todos")) || [];

//FUNCIONES VISUALES
const renderTodos = (todos) => {
  let listString = '';
  todos.forEach((todo, index) => {
    listString += `
        <li data-id="${index}"${todo.complete ? ' class="todos-complete"' : ""}>
            <input type="checkbox"${todo.complete ? ' checked' : ""}>
            <span>${todo.label}</span>
            <button type="button"></button>
        </li>
      `;
  });
  list.innerHTML = listString;
  clear.style.display = todos.filter((todo) => todo.complete).length ? "block" : "none";
  count.innerText = todos.filter((todo) => !todo.complete).length;
};

//FUNCIONES LOGICAS

//Add ToDo
const addTodo = (e) => {
  e.preventDefault();
  const label = input.value.trim();
  const complete = false;
  if (label.length === 0) {
    form.classList.add('error');
    return; //
  }
  form.classList.remove('error');
  state = [
    ...state,
    {
      label,
      complete,
    },
  ];

  renderTodos(state);
  saveInLocalStorage(state);
  input.value = '';
};

//COMPLETE TODO

const updateTodo = ({target}) => {
  const id = parseInt(target.parentNode.dataset.id);
  const complete = target.checked;

  state = state.map((todo, index) => {
    if (index === id) {
      return {
        ...todo,
        complete,
      };
    }
    return todo;
  });

  console.log(state);
  renderTodos(state);
  saveInLocalStorage(state);
};

//EDITAR TODO
const editTodo = ({target}) => {
  if (target.nodeName.toLowerCase() !== "span") {
    return;
  }
  const id = parseInt(target.parentNode.dataset.id);
  const currentLabel = state[id].label;
  const input = document.createElement("input");
  input.type = "text";
  input.value = currentLabel;

  const handlerEdit = (e) => {
    const label = e.target.value;
    e.stopPropagation();

    if (label !== currentLabel) {
      state = state.map((todo, index) => {
        if (id === index) {
          return {
            ...todo,
            label,
          };
        }
        return todo;
      });
      renderTodos(state);
      saveInLocalStorage(state);
    }
    e.target.display = "";
    e.target.removeEventListener("change", handlerEdit)
  };

  const handlerBlur = ({target}) => {
    target.display = "";
    input.remove();
    target.removeEventListener("blur", handlerBlur);
  }

  input.addEventListener("change", handlerEdit);
  input.addEventListener("blur", handlerBlur);

  target.parentNode.append(input);
  input.focus();
}

//BORRAR TODO/S
const deleteTodo = ({target}) => {
  if (target.nodeName.toLowerCase() !== "button") {
    return;
  }
  const id = parseInt(target.parentNode.dataset.id);
  const label = target.previousElementSibling.innerText;
  if (window.confirm(`Estas a punto de borrar "${label}", ok???`)) {
    state = state.filter((todo, index) => index !== id);
    renderTodos(state);
    saveInLocalStorage(state);
  }
};

const clearCompletes = () => {
  const todoCompletes = state.filter((todo) => todo.complete).length;
  if (todoCompletes === 0) {
    return;
  }
  if (window.confirm(`Borramos los ${todoCompletes} ToDos???`)) {
    state = state.filter ((todo) => !todo.complete);
    renderTodos(state);
    saveInLocalStorage(state);
  }
};

//DECLARACION DE EVENTOS E INICIALIZADOR DE ESTADO

function init() {
  renderTodos(state);
  form.addEventListener('submit', addTodo);
  list.addEventListener("change", updateTodo);
  list.addEventListener("dblclick", editTodo);
  list.addEventListener('click', deleteTodo);
  clear.addEventListener('click', clearCompletes);
}

//INICIALIZADOR DE LA APP
init();