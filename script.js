const arrayColores = ['white', 'green', 'red', 'blue', 'pink', 'yellow', 'orange', 'brown'];
const arrayMaster = [];
const arrayUsuario = [];
const arrayResultadosColores = [];
const MAX_INTENTOS = 5;
const MAX_COMBINACION_COLORES = 4;
let intentos = 0;

// Función para reiniciar el juego cuando se presiona "Jugar de Nuevo"
function jugarDeNuevo() {
    // Reiniciamos las variables a 0 para volver a jugar
    intentos = 0;
    arrayMaster.length = 0;
    arrayUsuario.length = 0;
    arrayResultadosColores.length = 0;

    // Habilita los controles para permitir que el usuario juegue de nuevo
    let coloresInferiores = document.querySelectorAll('.coloresInferiores');
    for (let i = 0; i < coloresInferiores.length; i++) {
        coloresInferiores[i].style.pointerEvents = 'auto';
    }

    // Restaura la interfaz al estado inicial y limpia los resultados
    document.querySelector('.botonComprobar').disabled = false;
    hacerVisibleArrayMaster(false);
    document.getElementById("contadorIntentos").innerText = intentos;
    let elementosAEliminar = document.querySelectorAll('.contieneArrayUsuario, .contieneArrayResultados');
    for (let i = 0; i < elementosAEliminar.length; i++) {
        elementosAEliminar[i].remove();
    }

    // Reiniciar partida generando un master array nuevo
    obtenerMasterAleatorio();
    crearArrayMaster(arrayMaster);
    document.getElementById("tablero").innerHTML = "";
    obtenerUsuario();
}

// Función que genera una combinación de la master aleatoria
function obtenerMasterAleatorio() {
    for (let i = 1; i <= MAX_COMBINACION_COLORES; i++) {
        arrayMaster.push(arrayColores[Math.floor(Math.random() * arrayColores.length)]);
    }
    console.log("ARRAY DE LA MASTER: " + arrayMaster);
}

// Función que obtiene la combinación de colores del usuario
function obtenerUsuario() {
    arrayUsuario.length = 0;
    actualizarArrayUsuario(arrayUsuario);
}

// Función para crear la visualización de la combinación maestra en la interfaz
function crearArrayMaster(arrayMaster) {
    let contenedorDiv = document.querySelector(".contieneArrayMaster");
    contenedorDiv.innerHTML = "";
    for (let i = 0; i < arrayMaster.length; i++) {
        let div = document.createElement("div");
        div.className = "cajasMaster";
        div.innerHTML = arrayMaster[i];
        contenedorDiv.appendChild(div);
    }
}

// Función para hacer visible la combinación maestra en la interfaz
function hacerVisibleArrayMaster(mostrarColores) {
    let arrayMasterOculto = document.querySelector(".contieneArrayMasterOculto");

    if (arrayMasterOculto) {
        for (let i = 0; i < MAX_COMBINACION_COLORES; i++) {
            arrayMasterOculto.children[i].style.backgroundColor = mostrarColores ? arrayMaster[i] : 'grey';
        }
    }
}

// Función para crear la visualización de la combinación de colores proporcionada por el usuario en la interfaz
function crearArrayUsuario(arrayUsuario) {
    let contenedorUsuario = document.createElement("div");
    contenedorUsuario.className = "contieneArrayUsuario";
    for (let i = 0; i < arrayUsuario.length; i++) {
        let div = document.createElement("div");
        div.className = "cajasUsuario";
        div.style.backgroundColor = arrayUsuario[i];
        contenedorUsuario.appendChild(div);
    }
    document.body.appendChild(contenedorUsuario);
}

// Función para crear la visualización de los colores disponibles en la interfaz
function crearArrayColores(arrayColores) {
    let contenedorDiv = document.createElement("div");
    contenedorDiv.className = "contieneArrayColores";
    for (let i = 0; i < arrayColores.length; i++) {
        let div = document.createElement("div");
        div.className = "coloresInferiores";
        div.style.backgroundColor = arrayColores[i];

        div.onclick = function () {
            agregarColorUsuario(arrayColores[i]);
        };

        contenedorDiv.appendChild(div);
    }
    document.body.appendChild(contenedorDiv);
}

// Función para agregar el color seleccionado por el usuario a la combinación
function agregarColorUsuario(color) {
    if (arrayUsuario.length < MAX_COMBINACION_COLORES) {
        arrayUsuario.push(color);
        actualizarArrayUsuario(arrayUsuario);
    }
}

// Función para actualizar la visualización de la combinación de colores proporcionada por el usuario
function actualizarArrayUsuario(arrayUsuario) {
    let contenedorUsuarioExistente = document.querySelector(".contieneArrayUsuario");
    if (contenedorUsuarioExistente) {
        document.body.removeChild(contenedorUsuarioExistente);
    }
    crearArrayUsuario(arrayUsuario);
}

// Función principal para comparar las combinaciones y realizar acciones según los resultados
function compararDosArrays() {
    arrayResultadosColores.length = 0;
    let todosColoresCoinciden = true;

    for (let i = 0; i < arrayMaster.length; i++) {
        if (arrayMaster[i] === arrayUsuario[i]) {
            arrayResultadosColores.push("black");
        } else if (arrayUsuario.includes(arrayMaster[i])) {
            arrayResultadosColores.push("grey");
            todosColoresCoinciden = false;
        } else {
            arrayResultadosColores.push("white");
            todosColoresCoinciden = false;
        }
    }

    if (todosColoresCoinciden) {
        arrayResultadosColores.fill("black");
    }

    agregarRespuestaAlTablero(arrayUsuario, arrayResultadosColores);

    intentos++;
    document.getElementById("contadorIntentos").innerText = intentos;

    if (intentos >= MAX_INTENTOS) {
        hacerVisibleArrayMaster(true);
    }
    obtenerUsuario();
}

// Función que agrega las respuestas al tablero
function agregarRespuestaAlTablero(arrayUsuario, arrayResultadosColores) {
    let tablero = document.getElementById("tablero");

    let respuestaDiv = document.createElement("div");
    respuestaDiv.className = "respuestaIntento";

    let usuarioDiv = document.createElement("div");
    usuarioDiv.className = "usuarioRespuesta";
    for (let color of arrayUsuario) {
        let colorDiv = document.createElement("div");
        colorDiv.className = "colorCaja";
        colorDiv.style.backgroundColor = color;
        usuarioDiv.appendChild(colorDiv);
    }
    respuestaDiv.appendChild(usuarioDiv);

    let resultadosDiv = document.createElement("div");
    resultadosDiv.className = "resultadosRespuesta";
    for (let resultadoColor of arrayResultadosColores) {
        let resultadoColorDiv = document.createElement("div");
        resultadoColorDiv.className = "colorCaja";
        resultadoColorDiv.style.backgroundColor = resultadoColor;
        resultadosDiv.appendChild(resultadoColorDiv);
    }
    respuestaDiv.appendChild(resultadosDiv);

    tablero.insertBefore(respuestaDiv, tablero.firstChild);
}

function init() {
    obtenerMasterAleatorio();
    crearArrayMaster(arrayMaster);
    crearArrayColores(arrayColores);
}
