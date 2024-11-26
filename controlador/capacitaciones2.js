 // Función de búsqueda mejorada
 const searchEmployee = () => {
    const searchType = document.getElementById('searchType').value;
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const tableBody = document.getElementById('employeeTableBody');
    const rows = tableBody.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const grupoCell = rows[i].getElementsByTagName('td')[1];
        const fechaInicioCell = rows[i].getElementsByTagName('td')[2];
        const fechaFinCell = rows[i].getElementsByTagName('td')[3];

        if (grupoCell && fechaInicioCell && fechaFinCell) {
            const grupo = grupoCell.textContent.toLowerCase();
            const fechaInicio = fechaInicioCell.textContent;
            const fechaFin = fechaFinCell.textContent;

            // Convertir fechas a un formato comparable (yyyy-mm-dd)
            const formattedFechaInicio = fechaInicio.split('/').reverse().join('-');
            const formattedFechaFin = fechaFin.split('/').reverse().join('-');
            const inputDate = searchInput.split('/').reverse().join('-');

            if (searchType === 'grupo' && grupo.includes(searchInput)) {
                rows[i].style.display = '';
            } else if (searchType === 'fecha_inicio' && formattedFechaInicio.includes(inputDate)) {
                rows[i].style.display = '';
            } else if (searchType === 'fecha_fin' && formattedFechaFin.includes(inputDate)) {
                rows[i].style.display = '';
            } else {
                rows[i].style.display = 'none';
            }
        }
    }
};

// Actualizar el placeholder del campo de búsqueda según la opción seleccionada
document.getElementById('searchType').addEventListener('change', function () {
    const searchInput = document.getElementById('searchInput');
    if (this.value === 'grupo') {
        searchInput.placeholder = 'Ingrese el nombre del Grupo_GES';
    } else if (this.value === 'fecha_inicio') {
        searchInput.placeholder = 'Ingrese la fecha de inicio (dd/mm/yyyy)';
    } else if (this.value === 'fecha_fin') {
        searchInput.placeholder = 'Ingrese la fecha de fin (dd/mm/yyyy)';
    }
});

// Agregar event listener para la búsqueda en tiempo real
document.getElementById('searchInput').addEventListener('keyup', searchEmployee);
document.getElementById('searchType').addEventListener('change', searchEmployee);

// Event listeners para los botones "Ver más"
const verMasButtons1 = document.querySelectorAll('.ver-mas');
verMasButtons1.forEach(button => {
    button.addEventListener('click', function () {
        const employeeId = this.getAttribute('data-id');
        
        // Datos simulados de capacitación
        const employeeData = {
            1: {
                id: '001',
                grupo: 'Grupo A',
                fecha_inicio: '11/02/2021',
                fecha_fin: '12/02/2021',
                descripcion: 'Capacitación sobre manejo de maquinaria pesada.'
            },
            2: {
                id: '002',
                grupo: 'Grupo B',
                fecha_inicio: '15/03/2021',
                fecha_fin: '18/03/2021',
                descripcion: 'Capacitación en primeros auxilios.'
            },
            3: {
                id: '003',
                grupo: 'Grupo C',
                fecha_inicio: '20/04/2021',
                fecha_fin: '25/04/2021',
                descripcion: 'Capacitación sobre seguridad industrial.'
            }
        };

        const selectedEmployee = employeeData[employeeId];

        // Cargar los detalles en el modal
        document.getElementById('modalBody').innerHTML = `
            <p><strong>ID:</strong> ${selectedEmployee.id}</p>
            <p><strong>Grupo GES:</strong> ${selectedEmployee.grupo}</p>
            <p><strong>Fecha de Inicio:</strong> ${selectedEmployee.fecha_inicio}</p>
            <p><strong>Fecha de Fin:</strong> ${selectedEmployee.fecha_fin}</p>
            <p><strong>Descripción:</strong> ${selectedEmployee.descripcion}</p>
        `;



        // Mostrar el modal
        const employeeModal = new bootstrap.Modal(document.getElementById('employeeModal'));
        employeeModal.show();
    });
    });

    // Botón Ver Reporte
const verReporteButton = document.getElementById("verReporteButton");
verReporteButton.addEventListener("click", function(event) {
  event.preventDefault();
  window.location.href = "./verReporteEmpleado.html";
});

// Botón Generar Reporte
const reporteButton = document.getElementById("reporteButton");
reporteButton.addEventListener("click", function(event) {
  event.preventDefault();
  window.location.href = "./generarReporteEmpleado.html"; 
});

// Botón Cerrar Sesión
const cerrarSesionButton = document.getElementById("cerrarSesionButton");
cerrarSesionButton.addEventListener("click", function(event) {
  event.preventDefault();
  window.location.href = "../login1.html"; 
});

function printReport() {
    window.print("imprimirButton");
}


// Función para obtener capacitaciones desde el backend
async function fetchCapacitaciones() {
    try {
        const userId = localStorage.getItem("usuarioId");
        if (!userId) {
            throw new Error("No se encontró IdUsuario en localStorage");
        }

        // Obtener las capacitaciones con el userId como parámetro
        const responseCapacitaciones = await fetch(`http://localhost:3000/api/capacitaciones?userId=${userId}`);
        if (!responseCapacitaciones.ok) {
            throw new Error('Error en la respuesta de la API de capacitaciones');
        }
        const capacitaciones = await responseCapacitaciones.json();

        // Obtener grupos usando la API actualizada con el userId
        const responseGrupos = await fetch(`http://localhost:3000/api/gruposGes?userId=${userId}`);
        if (!responseGrupos.ok) {
            throw new Error('Error en la respuesta de la API de grupos');
        }
        const grupos = await responseGrupos.json();

        // Crear mapa de grupos para búsqueda rápida
        const gruposMap = new Map();
        grupos.forEach(grupo => {
            gruposMap.set(grupo.IdGrupo, {
                nombre_grupo: grupo.nombre_grupo,
                integrantes: grupo.integrantes ? grupo.integrantes.split(',') : []
            });
        });

        // Limpiar la tabla actual
        const tableBody = document.getElementById('employeeTableBody');
        tableBody.innerHTML = '';

        // Insertar datos de capacitaciones en la tabla
        capacitaciones.forEach(capacitacion => {
            const fechaInicio = capacitacion.fecha_inicio ? new Date(capacitacion.fecha_inicio) : null;
            const fechaFin = capacitacion.fecha_fin ? new Date(capacitacion.fecha_fin) : null;
            
            const fechaInicioFormateada = fechaInicio ? fechaInicio.toLocaleDateString() : 'No disponible';
            const fechaFinFormateada = fechaFin ? fechaFin.toLocaleDateString() : 'No disponible';

            // Obtener información del grupo
            const grupoInfo = gruposMap.get(capacitacion.IdGrupo) || { 
                nombre_grupo: 'No asignado', 
                integrantes: [] 
            };

            // Crear una fila para la tabla
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${capacitacion.IdCapacitacion || 'N/A'}</td>
                <td>${capacitacion.nombre_capacitacion || 'N/A'}</td>
                <td>${grupoInfo.nombre_grupo}</td>
                <td>${fechaInicioFormateada}</td>
                <td>${fechaFinFormateada}</td>
                <td>
                    <button
                        class="btn btn-primary btn-sm ver-mas"
                        data-id="${capacitacion.IdCapacitacion}"
                        data-grupo-id="${capacitacion.IdGrupo}"
                        data-bs-toggle="modal"
                        data-bs-target="#employeeModal"
                        onclick="showCapacitacionDetails(this)"
                    >Ver más</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error al obtener datos:", error);
        alert("Error al obtener datos: " + error.message);
    }
}

// Función actualizada para mostrar detalles de la capacitación
async function showCapacitacionDetails(button) {
    const capacitacionId = button.getAttribute('data-id');
    const grupoId = button.getAttribute('data-grupo-id');
    const userId = localStorage.getItem("usuarioId");
    
    if (!userId) {
        alert("No se encontró la sesión del usuario");
        return;
    }
    
    try {
        // Obtener los detalles de la capacitación y del grupo incluyendo userId
        const [capacitacion, grupos] = await Promise.all([
            fetch(`http://localhost:3000/api/capacitaciones/${capacitacionId}?userId=${userId}`).then(res => {
                if (!res.ok) throw new Error('Error al obtener detalles de la capacitación');
                return res.json();
            }),
            fetch(`http://localhost:3000/api/gruposGes?userId=${userId}`).then(res => {
                if (!res.ok) throw new Error('Error al obtener detalles del grupo');
                return res.json();
            })
        ]);

        const grupo = grupos.find(g => g.IdGrupo === parseInt(grupoId));
        const modalBody = document.getElementById('modalBody');
        const fechaInicio = new Date(capacitacion.fecha_inicio).toLocaleString();
        const fechaFin = new Date(capacitacion.fecha_fin).toLocaleString();
        
        modalBody.innerHTML = `
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <p><strong>ID:</strong> ${capacitacion.IdCapacitacion}</p>
                        <p><strong>Nombre:</strong> ${capacitacion.nombre_grupo}</p>
                        <p><strong>Fecha de Inicio:</strong> ${fechaInicio}</p>
                        <p><strong>Fecha de Fin:</strong> ${fechaFin}</p>
                        <p><strong>Descripción:</strong> ${capacitacion.Descripcion || 'No disponible'}</p>
                        <p><strong>Estado:</strong> ${capacitacion.Activo ? 'Activo' : 'Inactivo'}</p>
                        <p><strong>Grupo:</strong> ${grupo ? grupo.nombre_grupo : 'No asignado'}</p>
                        <div class="mt-3">
                            <strong>Integrantes del Grupo:</strong>
                            ${grupo && grupo.integrantes ? `
                                <ul class="list-group mt-2">
                                    ${grupo.integrantes.split(',').map(integrante => 
                                        `<li class="list-group-item">${integrante.trim()}</li>`
                                    ).join('')}
                                </ul>
                            ` : '<p>No hay integrantes asignados</p>'}
                        </div>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar los detalles de la capacitación: ' + error.message);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    fetchCapacitaciones();
});