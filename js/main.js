let comidas = [];
async function obtenerComidas() {
    const response = await fetch("../js/comidas.json");
    comidas = await response.json();
}
obtenerComidas();

const contenedor = document.querySelector("#contenedor");

function renderizarComidas() {
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
        boton.innerHTML = "Agregar al carrito";
        capturarBoton(id);

        divBody.append(h5, pNombre, pDescripcion, pPrecio, boton);
        div.append(img, divBody);
        contenedor.append(div);
    });
}

let boton;
let unidad;

setTimeout(() => {
    renderizarComidas();
}, 500);

let carrito = [];
let nombre;
function capturarBoton(ID) {
    boton.addEventListener("click", () => {
        nombre = comidas[ID].nombre;
        let repetido = carrito.some((comida)=> comida.id === ID);
        if(repetido){
            carrito.map((comida)=>{
                if(comida.id === ID){
                    comida.unidad++;
                }
            })
        }else{
            const item = comidas.find((comida) => comida.id === ID);
            carrito.push(item);
        }

        mostrarCarrito();
        alertaAgregado();
    });
};

let botonEliminar;
function eliminarComida(ID) {
    botonEliminar.addEventListener("click", () => {
        carrito = carrito.filter((comida) => comida.id !== ID);
        mostrarCarrito();
    });
}

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
function mostrarCarrito() {
    modalBody.innerHTML = "";
    const contadorComidas = document.querySelector("#contadorComidas");
    contadorComidas.innerHTML = carrito.length;
    renderizarPedidos();
    almacenarPedidos();

    if(carrito.length === 0){
        modalBody.innerHTML = `
        <p class="pedidosCarrito">¡Agrega tus comidas favoritas!</p>`;
    }
    calcularTotal();
}
recuperarPedidos();

function almacenarPedidos() {
    const pedidoJSON = JSON.stringify(carrito);
    localStorage.setItem("pedido", pedidoJSON);
}

function recuperarPedidos() {
    let SessionPedido = localStorage.getItem("pedido");
    let pedido = JSON.parse(SessionPedido);
    document.addEventListener("DOMContentLoaded", () => {
        carrito = pedido || [];
        mostrarCarrito();
    });
}

const vaciarCarrito = document.querySelector("#vaciarCarrito");
vaciarCarrito.addEventListener("click",()=>{
    carrito.length = [];
    mostrarCarrito();
});

let precioTotal = document.querySelector("#precioTotal");
function calcularTotal(){
    let total = carrito.reduce((acc, comida)=> acc + comida.precio * comida.unidad, 0);
    precioTotal.innerHTML = total;
}

function alertaAgregado(){
    Toastify({
        text:`${nombre} agregado correctamente`,
        duration: 2000,
        gravity: "top",
        position: "right",
        className: "alertaPedido"
    }).showToast();
}
const botonComprar = document.getElementById("comprar");

botonComprar.addEventListener("click", ()=>{
    carrito.length = [];
    mostrarCarrito();
    Swal.fire({
        title: "¡Compra existosa!",
        text: "Retire el ticket y espere a que esté listo su pedido",
        icon: "success",
        confirmButtonText: "Okey",
    })
})