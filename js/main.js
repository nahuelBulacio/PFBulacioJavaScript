// Obtenemos la lista de comidas del archivo comidas.json() para poder trabajar sobre ellas
let comidas = [];
async function obtenerComidas() {
    const response = await fetch("../js/comidas.json");
    comidas = await response.json();
}
obtenerComidas();

//  Renderizamos y mostramos los platos de comida en el DOM 
const contenedor = document.querySelector("#contenedor");
function renderizarComidas() {

    //  Creamos los elementos html para insertarlos en la página 
    comidas.forEach((comida) => {
        const { id, tipo, nombre, descripcion, precio, imagen, unidad } = comida;

        let div = document.createElement("div");
        div.className = "card plato";

        let img = document.createElement("img");
        img.className = "card-img-top mt-2 foto-comida";
        img.src = imagen;
        img.alt = "Imagen de comida";

        let divBody = document.createElement("div");
        divBody.className = "card-body";

        let h5 = document.createElement("h5");
        h5.className = "card-title";
        h5.innerHTML = tipo;

        let pNombre = document.createElement("p");
        pNombre.className = "card-text"
        pNombre.innerHTML = nombre;

        let pDescripcion = document.createElement("p");
        pDescripcion.className = "card-text";
        pDescripcion.innerHTML = descripcion;

        let pPrecio = document.createElement("p");
        pPrecio.className = "card-text";
        pPrecio.innerHTML = `$ ${precio}`;

        boton = document.createElement("button");
        boton.className = "btn boton-pedido";
        boton.innerHTML = "Agregar al pedido";
        capturarBoton(id);

        divBody.append(h5, pNombre, pDescripcion, pPrecio, boton);
        div.append(img, divBody);
        contenedor.append(div);
    });
}

let boton;
let unidad;
//  Creamos una asincronía de tiempo para esperar a que se obtengan los objetos correctamente y así poder trabajarlos
setTimeout(() => {
    renderizarComidas();
}, 500);

let carrito = [];
let nombre;

//  Al apretar sobre el botón "Agregar al pedido" los agregamos al modal de pedido
function capturarBoton(ID) {
    boton.addEventListener("click", () => {
        //  Verificamos que si el objeto que agreguemos a la lista no sea repetido, de lo contrario, modificará el parámetro "unidad".
        nombre = comidas[ID-1].nombre;
        let repetido = carrito.some((comida) => comida.id === ID);
        if (repetido) {
            carrito.map((comida) => {
                if (comida.id === ID) {
                    comida.unidad++;
                }
            })
          //    Agregamos el objeto que el id capturado por el boton coincida con el de la lista  
        } else {
            const item = comidas.find((comida) => comida.id === ID);
            carrito.push(item);
        }

        mostrarCarrito();
        alertaAgregado();
    });
};
//  Guardamos los objetos(comidas) que sean diferente del id capturado por el botón
let botonEliminar;
function eliminarComida(ID) {
    botonEliminar.addEventListener("click", () => {
        carrito = carrito.filter((comida) => comida.id !== ID);
        mostrarCarrito();
    });
}

//  Mostramos en el modalBody las comidas seleccionadas haciendo una renderización de igual forma que hicimos con las comidas. En este caso es con el array "carrito". 
const modalBody = document.querySelector(".modal .modal-body");
function renderizarPedidos() {
    carrito.forEach((comida) => {
        const { id, tipo, nombre, descripcion, precio, imagen, unidad } = comida;

        let div = document.createElement("div");
        div.className = "modal-contenedor";

        let divImagen = document.createElement("div");
        divImagen.className = "foto-pedido";
        let img = document.createElement("img");
        img.className = "img-fluid foto-pedido";
        img.src = imagen;
        img.alt = "Imagen de pedido";
        divImagen.append(img);

        let divComida = document.createElement("div");

        let h5 = document.createElement("h5");
        h5.innerHTML = tipo;

        let pNombre = document.createElement("p");
        pNombre.innerHTML = nombre;

        let pDescripcion = document.createElement("p");
        pDescripcion.innerHTML = descripcion;

        let pPrecio = document.createElement("p");
        pPrecio.innerHTML = `$ ${precio}`;

        let pUnidad = document.createElement("p");
        pUnidad.innerHTML = `Unidad: ${unidad}`;

        botonEliminar = document.createElement("button");
        botonEliminar.className = "btn btn-danger";
        botonEliminar.innerHTML = "Eliminar pedido";
        eliminarComida(id);

        divComida.append(h5, pNombre, pDescripcion, pPrecio, pUnidad, botonEliminar);

        div.append(divImagen, divComida);
        modalBody.append(div);

    });
}
//  Llamamos a las funciones para lograr la visualización de los objetos del carrito
function mostrarCarrito() {
    modalBody.innerHTML = "";
    const contadorComidas = document.querySelector("#contadorComidas");
    contadorComidas.innerHTML = carrito.length;
    renderizarPedidos();
    almacenarPedidos();

    if (carrito.length === 0) {
        modalBody.innerHTML = `
        <p class="pedidosCarrito">¡Agrega tus comidas favoritas!</p>`;
    }
    calcularTotal();
}
recuperarPedidos();

//  Guardamos los platos seleccionados a través del botón en el localStorage
function almacenarPedidos() {
    const pedidoJSON = JSON.stringify(carrito);
    localStorage.setItem("pedido", pedidoJSON);
}

//  Para evitar que se pierdan los datos con la recarga de la página, con el método "DOMContentLoaded" hacemos que sigan los datos guardados en el localStorage y carrito, para así mostrarlos
function recuperarPedidos() {
    let localPedido = localStorage.getItem("pedido");
    let pedido = JSON.parse(localPedido);
    document.addEventListener("DOMContentLoaded", () => {
        carrito = pedido || [];
        mostrarCarrito();
    });
}
//  Vaciamos el carrito y llamamos la función mostrarCarrito() para mostrar que no hay nada seleccionado aún
const vaciarCarrito = document.querySelector("#vaciarCarrito");
vaciarCarrito.addEventListener("click", () => {
    carrito.length = [];
    mostrarCarrito();
});

//  Calculamos el precio total con las comidas obtenidas a través del acumulador
let precioTotal = document.querySelector("#precioTotal");
function calcularTotal() {
    let total = carrito.reduce((acc, comida) => acc + comida.precio * comida.unidad, 0);
    precioTotal.innerHTML = total;
}

//  Cada vez que agreguemos un plato al "carrito", una alarma avisará que se agregó correctamente
function alertaAgregado() {
    Toastify({
        text: `${nombre} agregado correctamente`,
        duration: 2000,
        gravity: "top",
        position: "right",
        className: "alertaPedido"
    }).showToast();
}

//  Al finalizar la compra y apretar el boton "Comprar", un cartel aparecerá en la página para avisar un mensaje. También limpiará el localStorage y el modal de pedido
const botonComprar = document.getElementById("comprar");
botonComprar.addEventListener("click", () => {
    carrito.length = [];
    localStorage.clear();
    mostrarCarrito();
    Swal.fire({
        title: "¡Compra existosa!",
        text: "Retire el ticket y espere a que esté listo su pedido",
        icon: "success",
        confirmButtonText: "Okey",
    })
})