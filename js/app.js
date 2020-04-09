/* Variables Globales*/
const presupuestoUsuario = Number(window.prompt('Ingresa Presupuesto Semanal: '));
/* La Clave Para Obtener El Restante Es Que La Instancia Esta De Forma Global */
let cantidadPresupuesto; //Variable Objeto

/* Acceso Al DOM */
const formulario = document.getElementById('agregar-gasto');

/* Eventos Del Usuario Y El Sistema */
eventosUsuario();

function eventosUsuario() {
    document.addEventListener('DOMContentLoaded', solicitarPresupuesto);
    formulario.addEventListener('submit', registrarGasto);
}

/* Clase Presupuesto */
class Presupuesto {
    constructor(presupuestoUsuario) {
        this.presupuestoUsuario = presupuestoUsuario;
        this.restante = presupuestoUsuario;
    }

    /* Método Para Obtener Presupuesto Restante */
    presupuestoRestante(cantidad = 0) {
        return this.restante -= cantidad;
    }
}

/* Clase De Interfaz */
class Interfaz {
    insertarPresupuesto(cantidad) {
        const presupuestoSpan = document.querySelector('span#total');
        const restanteSpan = document.querySelector('span#restante');

        presupuestoSpan.innerHTML = `${cantidad}`;
        restanteSpan.innerHTML = `${cantidad}`;
    }

    imprimirMensaje(mensaje, tipo) {
        const div = document.createElement('div');
        div.classList.add('text-center', 'alert');

        if (tipo === 'error') {
            div.classList.add('alert-danger');
        } else {
            div.classList.add('alert-success');
        }

        div.innerHTML = `${mensaje}`;
        formulario.insertAdjacentElement('beforebegin', div);

        /* Esto Se Va A Ejecutar Despues De 2 Segundos */
        setTimeout(function() {
            div.remove();
            formulario.reset();
        }, 2000);
    }

    agregarGastoListado(nombreGasto, cantidadGasto) {
        const gastosListado = document.querySelector('#gastos ul');

        const li = document.createElement('li');
        // li.classList.add('list-group-item d-flex justify-content-between align-items-center');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';

        li.innerHTML = `
              ${nombreGasto}
              <span class="badge badge-primary  badge-pill">$ ${cantidadGasto}</span>
          `;

        gastosListado.appendChild(li);
    }

    presupuestoRestante(cantidadGasto) {
        const restanteContainer = document.querySelector('span#restante');
        /* Utilizo El Método De La Instancia Que Es Una Variable Global */
        let presupuestoRestanteUsuario = cantidadPresupuesto.presupuestoRestante(cantidadGasto);

        restanteContainer.innerHTML = `${presupuestoRestanteUsuario}`;
        this.comprobarPresupuesto();
    }

    comprobarPresupuesto() {
        const presupuestoTotal = cantidadPresupuesto.presupuestoUsuario;
        const presupuestoRestante = cantidadPresupuesto.restante;

        const veintePorcentaje = presupuestoTotal * 0.25;
        const cincuentaPorcentaje = presupuestoTotal * 0.5;

        /* Comprueba El 25% Del Gasto Total */
        if (presupuestoRestante <= veintePorcentaje) {
            const restante = document.querySelector('.restante');
            restante.classList.remove('alert-warning');
            restante.classList.add('alert-danger');
            console.log('veintePorciento');

            /* Comprueba El 50% Del Gasto Total */
        } else if (presupuestoRestante <= cincuentaPorcentaje) {
            const restante = document.querySelector('.restante');
            restante.classList.remove('alert-success');
            restante.classList.add('alert-warning');
            console.log('cincuentaPorciento');
        }
    }
}

/* Funcionalidad Para Solicitar El Presupuesto Del Usuario */
function solicitarPresupuesto() {

    const valorPresupuestoUsuario = isNaN(presupuestoUsuario); //Identifica Valores Nulos(True o False)

    if (valorPresupuestoUsuario === true) {
        window.location.reload();
        window.confirm('Presupuesto No Válido.');

    } else if (presupuestoUsuario === 0) {
        window.confirm('Presupuesto Nulo.');

    } else {

        /* Instanciando Las Clases */
        cantidadPresupuesto = new Presupuesto(presupuestoUsuario);
        const ui = new Interfaz();

        ui.insertarPresupuesto(cantidadPresupuesto.presupuestoUsuario);
    }
}

/* Funcionalidad Para Registrar Gastos */
function registrarGasto(e) {
    e.preventDefault();

    const nombreGasto = document.querySelector('#gasto').value;
    const cantidadGasto = Number(document.querySelector('#cantidad').value);
    const valorCantidadGasto = isNaN(cantidadGasto); // True o False

    /* Instanciando La Clase */
    const ui = new Interfaz();

    if (nombreGasto === '') {
        ui.imprimirMensaje('Ingresar Nombre Del Gasto.', 'error');
    }

    if (valorCantidadGasto === true) {
        ui.imprimirMensaje('Ingresar Valores Númericos Válidos.', 'error');
    }

    if (cantidadGasto === 0) {
        ui.imprimirMensaje('Operación No Válida, Porque El Valor Del Gasto Es Nulo O Cero (0).', 'error');
    }

    if (nombreGasto !== '' && valorCantidadGasto !== true && !(cantidadGasto === 0)) {
        ui.imprimirMensaje('Registro Exitoso', 'correcto');
        ui.agregarGastoListado(nombreGasto, cantidadGasto);
        ui.presupuestoRestante(cantidadGasto);
    }
}