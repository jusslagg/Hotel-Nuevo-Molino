document.addEventListener('DOMContentLoaded', function () {
    const reservaForm = document.getElementById('reservaForm');
    const ultimaReservaDiv = document.getElementById('ultimaReserva');
    const listaReservasUl = document.getElementById('listaReservas');
    const eliminarReservasBtn = document.getElementById('eliminarReservas');

    // Definir array de tipos de habitación
    const tiposHabitacion = [
        { tipo: 'individual', costoPorNoche: 20000, capacidadMaxima: 1 },
        { tipo: 'doble', costoPorNoche: 40000, capacidadMaxima: 4 },
        { tipo: 'matrimonial', costoPorNoche: 30000, capacidadMaxima: 2 }
    ];

    // Cargar reservas almacenadas al cargar la página
    mostrarReservasAnteriores();

    // Evento submit del formulario de reserva
    reservaForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Evitar que el formulario se envíe de manera convencional

        // Obtener valores del formulario y realizar validaciones
        const nombre = document.getElementById('nombre').value;
        const tipoHabitacion = document.getElementById('tipoHabitacion').value;
        const numNoches = parseInt(document.getElementById('numNoches').value);
        const numPersonas = parseInt(document.getElementById('numPersonas').value);
        const tieneDesayuno = document.getElementById('desayuno').checked;
        const tieneCena = document.getElementById('cena').checked;

        // Validar los campos antes de continuar
        if (!nombre) {
            mostrarError('Por favor, ingresa tu nombre.');
            return;
        }

        if (tipoHabitacion === "") {
            mostrarError('Por favor, selecciona el tipo de habitación.');
            return;
        }

        if (numNoches < 1) {
            mostrarError('El número de noches debe ser mayor que 0.');
            return;
        }

        if (numPersonas < 1) {
            mostrarError('El número de personas debe ser mayor que 0.');
            return;
        }

        // Validar capacidad máxima según tipo de habitación
        const tipoSeleccionado = tiposHabitacion.find(tipo => tipo.tipo === tipoHabitacion);
        if (tipoSeleccionado && numPersonas > tipoSeleccionado.capacidadMaxima) {
            mostrarError(`La habitación ${tipoHabitacion} permite máximo ${tipoSeleccionado.capacidadMaxima} personas.`);
            return;
        }

        // Calcular costo total
        const costoPorNoche = tipoSeleccionado ? tipoSeleccionado.costoPorNoche : 0;
        let costoTotal = costoPorNoche * numNoches;

        // Agregar costo de desayuno y cena si están seleccionados
        if (tieneDesayuno) {
            costoTotal += 5000 * numNoches;
        }

        if (tieneCena) {
            costoTotal += 10000 * numNoches;
        }

        // Mostrar la última reserva realizada en SweetAlert2
        mostrarConfirmacion(nombre, tipoHabitacion, numNoches, numPersonas, costoTotal, tieneDesayuno, tieneCena);

        // Guardar la reserva en localStorage
        guardarReservaLocalStorage(nombre, tipoHabitacion, numNoches, numPersonas, costoTotal, tieneDesayuno, tieneCena);

        // Limpiar formulario después de enviar
        reservaForm.reset();
    });

    // Evento click para eliminar todas las reservas
    eliminarReservasBtn.addEventListener('click', function () {
        localStorage.removeItem('reservas');
        listaReservasUl.innerHTML = '';
    });

    function mostrarConfirmacion(nombre, tipoHabitacion, numNoches, numPersonas, costoTotal, tieneDesayuno, tieneCena) {
        let mensaje = `Nombre: ${nombre}<br>Tipo de Habitación: ${tipoHabitacion}<br>Número de Noches: ${numNoches}<br>Número de Personas: ${numPersonas}<br>Costo Total: $${costoTotal}`;

        if (tieneDesayuno) {
            mensaje += "<br>Desayuno: Sí";
        } else {
            mensaje += "<br>Desayuno: No";
        }

        if (tieneCena) {
            mensaje += "<br>Cena: Sí";
        } else {
            mensaje += "<br>Cena: No";
        }

        Swal.fire({
            title: "Resumen de la Reserva",
            html: mensaje,
            icon: 'success',
            showClass: {
                popup: 'animate__animated animate__fadeInUp animate__faster'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutDown animate__faster'
            }
        });
    }

    function guardarReservaLocalStorage(nombre, tipoHabitacion, numNoches, numPersonas, costoTotal, tieneDesayuno, tieneCena) {
        const reserva = {
            nombre: nombre,
            tipoHabitacion: tipoHabitacion,
            numNoches: numNoches,
            numPersonas: numPersonas,
            costoTotal: costoTotal,
            tieneDesayuno: tieneDesayuno,
            tieneCena: tieneCena
        };

        let reservas = JSON.parse(localStorage.getItem('reservas')) || [];
        reservas.push(reserva);
        localStorage.setItem('reservas', JSON.stringify(reservas));

        mostrarReservasAnteriores();
    }

    function mostrarReservasAnteriores() {
        listaReservasUl.innerHTML = '';

        let reservas = JSON.parse(localStorage.getItem('reservas')) || [];

        reservas.forEach(function (reserva, index) {
            const li = document.createElement('li');
            li.innerHTML = `Reserva ${index + 1}: ${reserva.nombre} - ${reserva.tipoHabitacion} - ${reserva.numNoches} noches - ${reserva.numPersonas} personas - Total: $${reserva.costoTotal}`;
            listaReservasUl.appendChild(li);
        });
    }

    function mostrarError(mensaje) {
        Swal.fire({
            title: 'Error',
            text: mensaje,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
});
