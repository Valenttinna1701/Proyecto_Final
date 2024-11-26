// Búsqueda mejorada de empleados
const searchEmployee = () => {
    const searchType = document.getElementById('searchType').value;
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#employeeTableBody tr');

    rows.forEach(row => {
        const [idCell, grupoCell, fechaInicioCell, fechaFinCell] = row.getElementsByTagName('td');
        if (!grupoCell || !fechaInicioCell || !fechaFinCell) return;

        const grupo = grupoCell.textContent.toLowerCase();
        const formattedFechaInicio = fechaInicioCell.textContent.split('/').reverse().join('-');
        const formattedFechaFin = fechaFinCell.textContent.split('/').reverse().join('-');
        const inputDate = searchInput.split('/').reverse().join('-');

        const showRow = (
            (searchType === 'grupo' && grupo.includes(searchInput)) ||
            (searchType === 'fecha_inicio' && formattedFechaInicio.includes(inputDate)) ||
            (searchType === 'fecha_fin' && formattedFechaFin.includes(inputDate))
        );

        row.style.display = showRow ? '' : 'none';
    });
};

// Cambiar el placeholder del campo de búsqueda
document.getElementById('searchType').addEventListener('change', function() {
    const searchInput = document.getElementById('searchInput');
    const placeholders = {
        grupo: 'Ingrese el nombre del Grupo_GES',
        fecha_inicio: 'Ingrese la fecha de inicio (dd/mm/yyyy)',
        fecha_fin: 'Ingrese la fecha de fin (dd/mm/yyyy)'
    };
    searchInput.placeholder = placeholders[this.value] || '';
});

// Búsqueda en tiempo real
document.getElementById('searchInput').addEventListener('keyup', searchEmployee);
document.getElementById('searchType').addEventListener('change', searchEmployee);

// Redirección de botones
const setNavigation = (buttonId, url) => {
    document.getElementById(buttonId).addEventListener('click', event => {
        event.preventDefault();
        window.location.href = url;
    });
};

setNavigation('cerrarSesionButton', './../login1.html');
setNavigation('registroButton', './../administrador/registrarEmpleado.html');
setNavigation('empleadosButton', './../administrador/listaEmpleados.html');
setNavigation('verReporteButton', './../administrador/verReporteAdmin.html');
setNavigation('reporteButton', './../administrador/generarReporteAdmin.html');
setNavigation('misReportesButton', './../administrador/misReportesAdmin.html');
setNavigation('gruposButton', './../administrador/gruposGesAdmin.html');

// Función para imprimir el reporte
const printReport = () => window.print();

// Cargar capacitaciones al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    loadCapacitaciones();
});
// Función para cargar las capacitaciones
const loadCapacitaciones = () => {
    fetch('http://localhost:3000/api/capacitaciones')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const tableBody = document.getElementById('employeeTableBody');
            tableBody.innerHTML = '';
            data.forEach(capacitacion => {
                const row = `
                    <tr>
                        <td>${capacitacion.IdCapacitacion}</td>
                        <td>${capacitacion.nombre_capacitacion}</td> <!-- Nombre de la capacitación -->
                        <td>${capacitacion.nombre_grupo}</td> <!-- Nombre del grupo -->
                        <td>${capacitacion.fecha_inicio.split('T')[0]}</td>
                        <td>${capacitacion.fecha_fin.split('T')[0]}</td>
                        <td>
                           <button class="btn btn-primary btn-sm ver-mas" 
                                    data-id="${capacitacion.IdCapacitacion}">
                                Ver más
                            </button>
                            <button class="btn btn-success btn-sm btn-asistencia" 
                                    data-id="${capacitacion.IdCapacitacion}" 
                                    data-grupo="${capacitacion.IdGrupo}">
                                Asistencia
                            </button>
                        </td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
            agregarEventosBotones(); // Agrega eventos después de cargar los datos
        })
        .catch(error => console.error('Error:', error));
};


 
//Asistencia
function agregarEventosBotones() {
    document.querySelectorAll('.btn-asistencia').forEach(boton => {
        boton.addEventListener('click', () => {
            const capacitacionId = boton.getAttribute('data-id');
            const idGrupo = boton.getAttribute('data-grupo');
            
            if (!capacitacionId || !idGrupo) {
                console.error('Datos insuficientes: CapacitacionID o IdGrupo están indefinidos.');
                return;
            }

            console.log(`Botón de asistencia clicado: CapacitacionID=${capacitacionId}, IdGrupo=${idGrupo}`);
            cargarAsistentes(capacitacionId, idGrupo);
        });
    });
}


// Función para cargar asistentes de una capacitación
function cargarAsistentes(capacitacionId, idGrupo) {
    const datosGuardados = obtenerDeLocalStorage(`asistencia_${idGrupo}`);
    
    if (datosGuardados) {
        console.log('Cargando asistentes desde localStorage...');
        mostrarModalAsistencia(datosGuardados, capacitacionId, idGrupo);
        return;
    }

    console.log('Cargando asistentes desde la base de datos...');
    fetch(`http://localhost:3000/api/asistentes?capacitacionId=${capacitacionId}`)
        .then(response => {
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data.length === 0) {
                mostrarNotificacion('No hay asistentes registrados para esta capacitación', 'info');
                return;
            }

            // Guardar los datos de la base de datos en localStorage
            guardarEnLocalStorage(`asistencia_${idGrupo}`, data);

            mostrarModalAsistencia(data, capacitacionId, idGrupo);
        })
        .catch(error => {
            console.error('Error al cargar asistentes:', error);
            mostrarNotificacion('Error al cargar asistentes', 'error');
        });
}


// Función para mostrar el modal de asistencia
function mostrarModalAsistencia(asistentes, capacitacionId, idGrupo) {
    const datosLocales = obtenerDeLocalStorage(`asistencia_${idGrupo}`) || [];

    const modalBody = document.querySelector('#modalAsistenciaBody');
    modalBody.innerHTML = `
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Asistente</th>
                    <th class="text-center">Asistió</th>
                    <th class="text-center">No Asistió</th>
                </tr>
            </thead>
            <tbody>
                ${asistentes.map(asistente => {
                    // Verificar si existe un estado en localStorage
                    const estadoLocal = datosLocales.find(item => item.IdUsuario === asistente.IdUsuario);
                    const asistencia = estadoLocal ? estadoLocal.asistencia : asistente.asistencia;

                    return `
                        <tr>
                            <td>${asistente.nombre_completo}</td>
                            <td class="text-center">
                                <input type="checkbox" 
                                    class="form-check-input asistencia-input"
                                    id="asistio_${asistente.IdUsuario}" 
                                    ${asistencia ? 'checked' : ''}
                                    onchange="actualizarAsistencia(${asistente.IdUsuario}, true, '${idGrupo}')">
                            </td>
                            <td class="text-center">
                                <input type="checkbox" 
                                    class="form-check-input asistencia-input"
                                    id="noasistio_${asistente.IdUsuario}" 
                                    ${!asistencia ? 'checked' : ''}
                                    onchange="actualizarAsistencia(${asistente.IdUsuario}, false, '${idGrupo}')">
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;

    const modal = new bootstrap.Modal(document.getElementById('modalAsistencia'));
    modal.show();
}


// Función para actualizar asistencia localmente
function actualizarAsistencia(idUsuario, asistencia, idGrupo) {
    // Obtener los datos de la asistencia de localStorage
    const asistentes = obtenerDeLocalStorage(`asistencia_${idGrupo}`) || [];
    
    // Verificar si ya existe el usuario en los asistentes
    const index = asistentes.findIndex(asistente => asistente.IdUsuario === idUsuario);

    if (index !== -1) {
        // Si el asistente ya está, actualizar su asistencia
        asistentes[index].asistencia = asistencia;
    } else {
        // Si no, agregarlo como nuevo
        asistentes.push({ IdUsuario: idUsuario, asistencia });
    }

    // Guardar los datos actualizados en localStorage
    guardarEnLocalStorage(`asistencia_${idGrupo}`, asistentes);

    // Sincronizar la UI con los cambios (verificar los checkboxes)
    document.getElementById(`asistio_${idUsuario}`).checked = asistencia;
    document.getElementById(`noasistio_${idUsuario}`).checked = !asistencia;
}

async function guardarAsistenciaServidor(asistentes, idGrupo) {
    try {
        const payload = {
            idGrupo: parseInt(idGrupo, 10),
            asistentes: asistentes.map(asistente => ({
                IdUsuario: asistente.IdUsuario,
                asistencia: asistente.asistencia,
            })),
        };

        console.log('Payload enviado al servidor:', payload);

        const response = await fetch('http://localhost:3000/api/asistencia', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Error del servidor:', error);
            throw new Error(error.message || 'Error desconocido en el servidor');
        }

        console.log('Asistencia guardada exitosamente.');
        mostrarNotificacion('Asistencia guardada correctamente', 'success');
    } catch (error) {
        console.error('Error al guardar asistencia:', error);
        mostrarNotificacion('No se pudo guardar la asistencia', 'error');
    }
}


// Funciones auxiliares para manejo de localStorage
function guardarEnLocalStorage(clave, valor) {
    console.log('Guardando en localStorage:', clave, valor); // Depuración
    localStorage.setItem(clave, JSON.stringify(valor));
}


function obtenerDeLocalStorage(clave) {
    const datos = localStorage.getItem(clave);
    return datos ? JSON.parse(datos) : null;
}

function eliminarDeLocalStorage(clave) {
    localStorage.removeItem(clave);
}

// Función auxiliar para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo) {
    const notificacion = document.createElement('div');
    notificacion.className = `alert alert-${tipo === 'error' ? 'danger' : 'success'} notification position-fixed top-0 end-0 m-3`;
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);

    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}

// Agregar eventos a los botones de asistencia
function agregarEventosBotones() {
    document.querySelectorAll('.btn-asistencia').forEach(boton => {
        boton.addEventListener('click', () => {
            const capacitacionId = boton.getAttribute('data-id');
            const idGrupo = boton.getAttribute('data-grupo');
            cargarAsistentes(capacitacionId, idGrupo);
        });
    });
}
// Llamar a la función cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    loadCapacitaciones();
    initializeModal(); // Agregamos la inicialización del modal
});

// Función de inactivación
function inactivateCap(IdCapacitacion) {
    if (confirm('¿Está seguro de que desea inactivar esta capacitación?')) {
        fetch(`http://localhost:3000/api/capacitaciones/${IdCapacitacion}/inactivar`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) throw new Error('Error al inactivar la capacitación');
                return response.json();
            })
            .then(data => {
                alert('Capacitación inactivada correctamente');
                // Cerrar el modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('employeeModal'));
                modal.hide();
                // Recargar los datos
                loadCapacitaciones();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al inactivar la capacitación');
            });
    }
}
// Función para editar capacitación
function updateEmployee(IdCapacitacion) {
    const capacitacion = {
        nombre_grupo: document.getElementById('capacitacion').value,
        grupos_ges: document.getElementById('grupos_ges').value, // Asegúrate de que este ID sea correcto
        fecha_inicio: document.getElementById('fechaIni').value,
        fecha_fin: document.getElementById('fechaFin').value,
        Descripcion: document.getElementById('descripcion').value
    };


    console.log(capacitacion); // Para depuración

    fetch(`http://localhost:3000/api/capacitaciones/${IdCapacitacion}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(capacitacion)
        })
        .then(response => {
            if (!response.ok) throw new Error('Error al actualizar la capacitación');
            return response.json();
        })
        .then(data => {
            alert('Capacitación actualizada correctamente');
            const modal = bootstrap.Modal.getInstance(document.getElementById('employeeModal'));
            modal.hide();
            loadCapacitaciones(); // Asegúrate de que esta función exista y funcione
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al actualizar la capacitación');
        });
}

// Función para cargar los datos de la capacitación seleccionada
function loadCapacitacionData(id) {
    fetch(`http://localhost:3000/api/capacitaciones/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar la capacitación');
            }
            return response.json();
        })
        .then(capacitacion => {
            // Llenar el modal con los datos
            document.getElementById('nombre').value = capacitacion.nombre_grupo; // Nombre de la capacitación
            document.getElementById('grupos_ges').value = capacitacion.IdGrupo; // ID del grupo
            
            // Obtener e insertar los integrantes, si es necesario
            // Puedes ajustar esto según cómo estés gestionando los integrantes
            const integrantesDiv = document.getElementById('integrantes');
            integrantesDiv.innerHTML = capacitacion.integrantes ? `<ol>${capacitacion.integrantes.split(',').map(i => `<li>${i.trim()}</li>`).join('')}</ol>` : 'No hay integrantes para este grupo.';
            
            document.getElementById('fecha_inicio').value = capacitacion.fecha_inicio.split('T')[0]; // Fecha inicio
            document.getElementById('fecha_fin').value = capacitacion.fecha_fin.split('T')[0]; // Fecha fin
            document.getElementById('descripcion').value = capacitacion.Descripcion; // Descripción

            // Mostrar el modal
            const modal = new bootstrap.Modal(document.getElementById('capacitacionModal'));
            modal.show();
        })
        .catch(error => console.error('Error:', error));
}

// Llamar a loadCapacitaciones al cargar la página
window.onload = loadCapacitaciones;


// Agregar eventos a los botones "Ver más"
function addEventListenersToButtons() {
    const buttons = document.querySelectorAll('.ver-mas');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            showCapacitacionesDetails(id); // Carga los detalles de la capacitación

            // Mostrar el modal
            const employeeModal = new bootstrap.Modal(document.getElementById('employeeModal'));
            employeeModal.show();
        });
    });
}

function showCapacitacionesDetails(IdCapacitacion) {
    fetch(`http://localhost:3000/api/capacitaciones/${IdCapacitacion}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            currentCapacitacion = data;

            const fechaInicio = data.fecha_inicio ? data.fecha_inicio.split('T')[0] : '';
            const fechaFin = data.fecha_fin ? data.fecha_fin.split('T')[0] : '';

            // Primero hacemos la petición para obtener los grupos
            fetch('http://localhost:3000/api/gruposGes')
                .then(response => response.json())
                .then(grupos => {
                    // Construimos las opciones del select con los grupos
                    const gruposOptions = grupos.map(grupo => 
                        `<option value="${grupo.IdGrupo}" ${grupo.IdGrupo === data.IdGrupo ? 'selected' : ''}>
                            ${grupo.nombre_grupo}
                         </option>`
                    ).join('');

                    // Ahora construimos todo el HTML del modal incluyendo el select con sus opciones
                    const modalBody = document.getElementById('modalBody');
                    modalBody.innerHTML = `
                        <form id="editEmployeeForm">
                            <div class="mb-3">
                                <label for="capacitacion" class="form-label">Nombre Capacitación:</label>
                                <input type="text" class="form-control" id="capacitacion" 
                                       value="${data.nombre_grupo || ''}" required>
                            </div>
                            <div class="mb-3">
                                <label for="grupos_ges" class="form-label">Grupo GES:</label>
                                <select class="form-control" id="grupos_ges" name="grupos_ges" required>
                                    <option value="">Seleccione un grupo</option>
                                    ${gruposOptions}
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="fechaIni" class="form-label">Fecha Inicio:</label>
                                <input type="date" class="form-control" id="fechaIni" 
                                       value="${fechaInicio}" required>
                            </div>
                            <div class="mb-3">
                                <label for="fechaFin" class="form-label">Fecha Fin:</label>
                                <input type="date" class="form-control" id="fechaFin" 
                                       value="${fechaFin}" required>
                            </div>
                            <div class="mb-3">
                                <label for="descripcion" class="form-label">Descripción:</label>
                                <textarea class="form-control" id="descripcion" rows="3">${data.Descripcion || ''}</textarea>
                            </div>
                        </form>
                    `;

                    // Configurar los botones
                    const editButton = document.getElementById('editButton');
                    if (editButton) {
                        editButton.onclick = () => updateEmployee(IdCapacitacion);
                    }

                    const inactivateButton = document.getElementById('inactivateButton');
                    if (inactivateButton) {
                        inactivateButton.setAttribute('data-id', IdCapacitacion);
                        inactivateButton.onclick = () => inactivateCap(IdCapacitacion);
                    }

                    // Mostrar el modal
                    const employeeModal = new bootstrap.Modal(document.getElementById('employeeModal'));
                    employeeModal.show();
                })
                .catch(error => {
                    console.error('Error al cargar los grupos:', error);
                    alert('Error al cargar la lista de grupos');
                });
        })
        .catch(error => {
            console.error('Error al cargar los detalles:', error);
            alert('Error al cargar los detalles de la capacitación');
        });
}
// Agregar eventos a los botones
function agregarEventosBotones() {
    document.querySelectorAll('.btn-asistencia').forEach(boton => {
        boton.addEventListener('click', () => {
            const capacitacionId = boton.getAttribute('data-id');
            const idGrupo = boton.getAttribute('data-grupo');
            cargarAsistentes(capacitacionId, idGrupo);
        });
    });

    // Aquí agregamos el evento para cuando el modal se cierra
    document.getElementById('modalAsistencia').addEventListener('hidden.bs.modal', () => {
        const idGrupo = document.querySelector('#modalAsistencia').getAttribute('data-grupo');
        const asistentes = obtenerDeLocalStorage(`asistencia_${idGrupo}`);

        console.log('Guardando al cerrar modal:', asistentes);

        if (asistentes) {
            guardarAsistenciaServidor(asistentes, idGrupo);
        }
    });

    document.querySelectorAll('.ver-mas').forEach(boton => {
        boton.addEventListener('click', () => {
            const capacitacionId = boton.getAttribute('data-id');
            console.log(`Ver más clicado: CapacitacionID=${capacitacionId}`);
            showCapacitacionesDetails(capacitacionId);
        });
    });
}

// Función para inicializar el modal y sus eventos
function initializeModal() {
    const modalAC = document.getElementById('myModal');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModal = document.getElementsByClassName('close')[0];
    const capacitacionForm = document.getElementById('capacitacionForm');

    // Verificar que los elementos existan antes de agregar los event listeners
    if (openModalBtn) {
        openModalBtn.onclick = function() {
            modalAC.style.display = 'block';
        };
    }

    if (closeModal) {
        closeModal.onclick = function() {
            modalAC.style.display = 'none';
        };
    }

    // Cerrar el modal cuando se hace clic fuera del contenido
    window.onclick = function(event) {
        if (event.target === modalAC) {
            modalAC.style.display = 'none';
        }
    };

    // Manejar el envío del formulario
    if (capacitacionForm) {
        capacitacionForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Evitar que se recargue la página

            // Obtener los datos del formulario
            const nombre = document.getElementById('nombre').value;
            const descripcion = document.getElementById('descripcion').value;
            const fecha = document.getElementById('fecha').value;

            // Crear el objeto con los datos de la capacitación
            const data = {
                nombre: nombre,
                descripcion: descripcion,
                fecha: fecha
            };

            // Enviar los datos al servidor usando Fetch
            fetch('/api/capacitaciones', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                .then(response => response.json())
                .then(result => {
                    alert(result.message); // Mostrar mensaje de éxito o error
                    modalAC.style.display = 'none'; // Cerrar el modal
                    loadCapacitaciones(); // Recargar la lista de capacitaciones
                })
                .catch(error => {
                    console.error('Error al agregar la capacitación:', error);
                    alert('Error al agregar la capacitación');
                });
        });
    }
}

function createCapacitacion(event) {
    event.preventDefault();

    const formData = {
        nombre_grupo: document.getElementById('nombre').value,
        IdGrupo: document.getElementById('grupos_ges').value,
        fecha_inicio: document.getElementById('fecha_inicio').value,
        fecha_fin: document.getElementById('fecha_fin').value,
        descripcion: document.getElementById('descripcion').value,
    };

    // Verifica los valores en la consola
    console.log("Datos del formulario:", formData);

    // Validar campos requeridos
    if (!formData.nombre_grupo || !formData.IdGrupo || !formData.fecha_inicio || !formData.fecha_fin || !formData.descripcion) {
        alert('Por favor complete todos los campos obligatorios');
        return;
    }

    fetch('http://localhost:3000/api/capacitaciones', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => Promise.reject(err));
        }
        return response.json();
    })
    .then(data => {
        alert('Capacitación creada correctamente');
        document.getElementById('capacitacionForm').reset();  // Limpiar el formulario
        loadCapacitaciones();  // Recargar la lista de capacitaciones
    })
    .catch(error => {
        console.error('Error:', error);
        alert(error.error || 'Error al crear la capacitación');
    });
}

document.getElementById('capacitacionForm').addEventListener('submit', createCapacitacion);


// Cargar los grupos cuando se abra el modal
document.getElementById('capacitacionModal').addEventListener('show.bs.modal', function () {
    fetch('http://localhost:3000/api/gruposGes')
        .then(response => response.json())
        .then(data => {
            const gruposSelect = document.getElementById('grupos_ges');
            gruposSelect.innerHTML = '<option value="">Seleccione un grupo</option>'; // Limpiar opciones anteriores

            // Llenar las opciones del select
            data.forEach(grupo => {
                const option = document.createElement('option');
                option.value = grupo.IdGrupo; // Valor de la opción será el IdGrupo
                option.textContent = grupo.nombre_grupo; // Texto visible será el nombre del grupo
                gruposSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error al cargar los grupos:', error));
});


// Mostrar los integrantes cuando se seleccione un grupo
document.getElementById('grupos_ges').addEventListener('change', function () {
    const grupoId = this.value;
    const integrantesDiv = document.getElementById('integrantes');

    // Limpiar el contenido anterior
    integrantesDiv.innerHTML = '';

    if (grupoId) {
        // Buscar el grupo seleccionado y sus integrantes
        fetch('http://localhost:3000/api/gruposGes')
            .then(response => response.json())
            .then(data => {
                const grupoSeleccionado = data.find(grupo => grupo.IdGrupo == grupoId);

                if (grupoSeleccionado && grupoSeleccionado.integrantes) {
                    // Dividir la cadena de los integrantes en una lista
                    const integrantesArray = grupoSeleccionado.integrantes.split(',');

                    // Crear la lista sin añadir la numeración manual
                    const integrantesList = integrantesArray.map(integrante => `<li>${integrante.trim()}</li>`).join('');
                    integrantesDiv.innerHTML = `<ol>${integrantesList}</ol>`; // Lista ordenada que maneja la numeración
                } else {
                    integrantesDiv.textContent = 'No hay integrantes para este grupo.';
                }
            })
            .catch(error => console.error('Error al cargar los integrantes:', error));
    } else {
        integrantesDiv.innerHTML = ''; // Limpiar si no hay grupo seleccionado
    }
});


const registrarGrupo = async (nombre_grupo, integrantes) => {
    const requestId = Date.now();  // Puedes usar un valor único para evitar duplicados
    try {
        const response = await fetch('/registrarGrupo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre_grupo, integrantes, requestId }),
        });

        const data = await response.json();
        if (data.success) {
            console.log('Grupo creado correctamente:', data);
        } else {
            console.error('Error:', data.error);
        }
    } catch (error) {
        console.error('Error al registrar el grupo:', error);
    }
};


