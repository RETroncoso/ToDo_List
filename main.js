const app = document.querySelector('#app');

app.innerHTML = `
    <div class="todos">
        <div class="todos-header">
            <h3 class="todos-title">TODO NUC</h3>
            <div>
                <p>Tienes <span class="todos-count"></span> Items por hacer!! </p>
                <button type="button" class="todos-clear" style="display:none;" >Borra Completados</button>
            </div>
        </div>
        <form class="todos-form" name="todos">
            <input type="text" placeholder="Que vas hacer KING????" name="todo">
            <small>Escribi algo KING!!!!</small>
        </form>
        <ul class="todos-list">
        </ul>
    </div>
`;

//?Selectores

const root = document.querySelector('.todos');
const list = root.querySelector('.todos-list');
const count = root.querySelector('.todos-count');
const form = document.forms.todos;
const input = form.elements.todo;

let state = [];

//?HANDLERS VIEW
const renderTodos = (todos) => {
  let listString = ''; //Se arranca con un string vacio
  todos.forEach((todo, index) => { //La idea es que con cada iteracion se agregue ese string al string principal
    listString += `
        <li data-id="${index}">
            <input type="checkbox"
            <span>${todo.label}</span>
            <button type="button"></button>
        </li>
      `;
  });
  list.innerHTML = listString; //Le decimos a la lista que su innerHTML va a ser listString
};

//?HANDLERS

//Add To do
const addTodo = (e) => {
  e.preventDefault(); //Como el evento es submit, prevenimos la recarga
  const label = input.value.trim(); //Le pasamos un trim (sacamos espacios en blanco al principio y al final)
  const complete = false;
  if (label.length === 0) {
    form.classList.add('error');
    return; //Si el input esta vacio, le agrego la clase error al form para que aoparezca el msje (Diplayeado en css). Y retornamos para que salga de la funcion
  }
  form.classList.remove('error');
  state = [ //Aca creamos el objeto. Copio todo el array con un spread operator y agrego un objeto nuevo con label y complete
    ...state,
    {
      label,
      complete,
    },
  ];

  console.log(state);


  //RENDERIZADO DE LOS TODOS
  renderTodos(state); //Renderizamos el Todo pasandole el state a la funcion renderTodos
  input.value = ''; // Limpiamos el input
};

//Update todo

//?ENTRY POINT - PUNTO DE ENTRADA A LA APP ---- INICIALIZADOR

function init() {
  form.addEventListener('submit', addTodo);
}

//RUN THE APPPPPPPP!!!!!!!!! BE NUCBER!!!!
init();