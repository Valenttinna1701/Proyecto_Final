const cerrarSesionButton = document.getElementById("cerrarSesionButton");
cerrarSesionButton.addEventListener("click", function(event) {
    event.preventDefault();
    window.location.href = "./../login1.html"; 
});

const capacitacionesButton = document.getElementById("capacitacionesButton");
capacitacionesButton.addEventListener("click", function(event) {
    event.preventDefault();
    window.location.href = "./../administrador/capacitacionesAdmin.html"; 
});

const verReporteButton = document.getElementById("verReporteButton");
verReporteButton.addEventListener("click", function(event) {
    event.preventDefault();
    window.location.href = "../administrador/verReporteAdmin.html";
});

const reporteButton = document.getElementById("reporteButton");
reporteButton.addEventListener("click", function(event) {
    event.preventDefault();
    window.location.href = "../administrador/generarReporteAdmin.html"; 
});

const registroButton = document.getElementById("registroButton");
registroButton.addEventListener("click", function(event) {
    event.preventDefault();
    window.location.href = "./../administrador/registrarEmpleado.html";
});

const gruposButton = document.getElementById("gruposButton");
document.getElementById("gruposButton").addEventListener("click", function(event) {
    event.preventDefault();
    window.location.href = "./../administrador/gruposGesAdmin.html";
});

// Función para cargar los grupos desde la base de datos
function loadEmployees() {
    fetch('http://localhost:3000/api/empleados')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('employeeTableBody');
            tableBody.innerHTML = '';
            data.forEach(employee => {
                // Asumimos que si el estado no está definido, el empleado está activo
                const isInactive = employee.estado === 'inactivo';
                console.log(`Empleado ${employee.nombre_completo}: estado = ${employee.estado || 'activo (por defecto)'}`);
                const row = `
                    <tr class="${isInactive ? 'employee-inactive' : ''}"> 
                        <td>${employee.IdUsuario}</td>
                        <td>${employee.nombre_completo}</td>
                        <td>${employee.numero_identificacion}</td>
                        <td>${employee.correo_electronico}</td>
                        <td>${employee.telefono}</td>
                        <td><button class="btn btn-primary btn-sm ver-mas" data-id="${employee.IdUsuario}">Ver más</button></td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
            addEventListenersToButtons();
        })
        .catch(error => console.error('Error:', error));
}

// Llamar a la función cuando se carga la página
document.addEventListener('DOMContentLoaded', loadEmployees);
// Función de búsqueda de empleados
function searchEmployee() {
    const searchType = document.getElementById('searchType').value;
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const tableBody = document.getElementById('employeeTableBody');
    const rows = tableBody.getElementsByTagName('tr');
    Array.from(rows).forEach(row => {
        const name = row.cells[1].textContent.toLowerCase();
        const id = row.cells[2].textContent.toLowerCase();
        if ((searchType === 'nombre' && name.includes(searchInput)) ||
            (searchType === 'número de identificacion' && id.includes(searchInput))) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Agregar event listener para la búsqueda en tiempo real
document.getElementById('searchInput').addEventListener('keyup', searchEmployee);
document.getElementById('searchType').addEventListener('change', searchEmployee);

// Agregar eventos a los botones "Ver más"
function addEventListenersToButtons() {
    const buttons = document.querySelectorAll('.ver-mas');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const employeeId = button.getAttribute('data-id');
            showEmployeeDetails(employeeId);
        });
    });
} 

function showEmployeeDetails(employeeId) {
    fetch(`http://localhost:3000/api/empleados/${employeeId}`)
        .then(response => response.json())
        .then(employee => {
            const modalBody = document.getElementById('modalBody');
            const modalFooter = document.getElementById('modalFooter');

            modalBody.innerHTML = `
                <form id="editEmployeeForm">
                    <div class="mb-3">
                        <label for="nombre" class="form-label">Nombre:</label>
                        <input type="text" class="form-control" id="nombre" value="${employee.nombre_completo}">
                    </div>
                    <div class="mb-3">
                        <label for="identificacion" class="form-label">Número de Identificación:</label>
                        <input type="text" class="form-control" id="identificacion" value="${employee.numero_identificacion}">
                    </div>
                    <div class="mb-3">
                        <label for="correo" class="form-label">Correo Electrónico:</label>
                        <input type="email" class="form-control" id="correo" value="${employee.correo_electronico}">
                    </div>
                    <div class="mb-3">
                        <label for="telefono" class="form-label">Teléfono:</label>
                        <input type="text" class="form-control" id="telefono" value="${employee.telefono}">
                    </div>
                    <div class="mb-3">
                        <label for="emergencia" class="form-label">Número de Emergencia:</label>
                        <input type="text" class="form-control" id="emergencia" value="${employee.num_emergencia}">
                    </div>
                    <div class="mb-3">
                        <label for="eps" class="form-label">EPS:</label>
                        <input type="text" class="form-control" id="eps" value="${employee.EPS}">
                    </div>
                    <div class="mb-3">
                        <label for="rh" class="form-label">RH:</label>
                        <input type="text" class="form-control" id="rh" value="${employee.RH}">
                    </div>
                    <div class="mb-3">
                        <label for="direccion" class="form-label">Dirección:</label>
                        <input type="text" class="form-control" id="direccion" value="${employee.direccion}">
                    </div>
                    <div class="mb-3">
                        <label for="rol" class="form-label">Rol:</label>
                        <input type="text" class="form-control" id="rol" value="${employee.rol_usuario}">
                    </div>
                </form>
            `;

            document.getElementById('editButton').onclick = function() {
                updateEmployee(employee.IdUsuario);
            };

            document.getElementById('inactivateButton').onclick = function() {
                inactivateEmployee(employee.IdUsuario);
            };

            const employeeModal = new bootstrap.Modal(document.getElementById('employeeModal'));
            employeeModal.show();
        })
        .catch(error => console.error('Error:', error));
}

function updateEmployee(employeeId) {
    const formData = {
        nombre_completo: document.getElementById('nombre').value,
        numero_identificacion: document.getElementById('identificacion').value,
        correo_electronico: document.getElementById('correo').value,
        telefono: document.getElementById('telefono').value,
        num_emergencia: document.getElementById('emergencia').value,
        EPS: document.getElementById('eps').value,
        RH: document.getElementById('rh').value,
        direccion: document.getElementById('direccion').value,
        rol_usuario: document.getElementById('rol').value
    };

    fetch(`http://localhost:3000/api/empleados/${employeeId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(data => {
        alert('Empleado actualizado correctamente');
        loadEmployees(); // Recargar la lista de empleados
        bootstrap.Modal.getInstance(document.getElementById('employeeModal')).hide();
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Error al actualizar el empleado');
    });
}

function inactivateEmployee(employeeId) {
    if (confirm('¿Está seguro de que desea inactivar este empleado?')) {
        fetch(`http://localhost:3000/api/empleados/${employeeId}/inactivar`, {
            method: 'PUT',
        })
        .then(response => response.json())
        .then(data => {
            alert('Empleado inactivado correctamente');
            loadEmployees(); // Recargar la lista de empleados
            bootstrap.Modal.getInstance(document.getElementById('employeeModal')).hide();
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Error al inactivar el empleado');
        });
    }
}


// Función para imprimir el reporte
function printReport() {
    window.print();
}

// Cargar empleados al inicio
document.addEventListener('DOMContentLoaded', loadEmployees);