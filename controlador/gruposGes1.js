const navButtons = document.querySelectorAll(".nav .btn-secondary");
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

// Redirecciones
const cerrarSesionButton = document.getElementById("cerrarSesionButton");
document.getElementById("cerrarSesionButton").addEventListener("click", function (event) {
    event.preventDefault();
    window.location.href = "./../login1.html";
});

const registroButton = document.getElementById("registroButton");
document.getElementById("registroButton").addEventListener("click", function (event) {
    event.preventDefault();
    window.location.href = "./../administrador/registrarEmpleado.html";
});

const empleadosButton = document.getElementById("empleadosButton");
document.getElementById("empleadosButton").addEventListener("click", function (event) {
    event.preventDefault();
    window.location.href = "./../administrador/listaEmpleados.html";
});

const verReporteButton = document.getElementById("verReporteButton");
document.getElementById("verReporteButton").addEventListener("click", function (event) {
    event.preventDefault();
    window.location.href = "../administrador/verReporteAdmin.html";
});

const reporteButton = document.getElementById("reporteButton");
document.getElementById("reporteButton").addEventListener("click", function (event) {
    event.preventDefault();
    window.location.href = "../administrador/generarReporteAdmin.html";
});

const capacitacionesButton = document.getElementById("capacitacionesButton");
document.getElementById("capacitacionesButton").addEventListener("click", function (event) {
    event.preventDefault();
    window.location.href = "../administrador/capacitacionesAdmin.html";
});

function printReport() {
    window.print("imprimirButton");
}

// Agregar evento al botón de agregar nuevo grupo
document.getElementById("registroGrupoButton").addEventListener("click", function () {
    // Mostrar el modal
    const addGrupoModal = new bootstrap.Modal(document.getElementById('addGrupoModal'));
    addGrupoModal.show();
});

// Obtén el elemento tbody donde se agregarán las filas
const tableBody = document.getElementById("employeeTableBody"); // Asegúrate de que el ID coincida con el de tu HTML

// Agregar evento al formulario de agregar nuevo grupo
addGrupoForm.addEventListener("submit", function (event) {
    event.preventDefault();
    
    // Obtener los datos del formulario
    const grupo = document.getElementById("grupo").value;
    const selectedOptions = document.getElementById("integrantes").selectedOptions;
    
    // Obtener los valores de los integrantes seleccionados
    const integrantes = Array.from(selectedOptions).map(option => option.value); 

    // Verifica si se seleccionaron integrantes
    if (integrantes.length === 0) {
        console.error("No se seleccionaron integrantes.");
        return;
    }

    // Agregar el nuevo grupo a la lista
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td>${grupo}</td>
        <td>${integrantes.join(", ")}</td>
        <td>
            <button class="btn btn-primary" id="editButton">Editar</button>
            <button class="btn btn-danger" id="inactivateButton">Inactivar</button>
        </td>
    `;
    tableBody.appendChild(newRow);
    
    // Crear objeto con los datos
    const data = {
        nombre_grupo: grupo,
        integrantes: integrantes
    };

    // Enviar los datos al backend
    fetch('http://localhost:3000/registrarGrupo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (!response.ok) throw new Error('Error en la creación del grupo');
        return response.json(); // Cambia esto si solo envías texto
    })
    .then(data => {
        console.log('Grupo creado:', data);
        // Cerrar el modal y reiniciar el formulario
        const addGrupoModal = document.getElementById('addGrupoModal');
        const modalInstance = bootstrap.Modal.getInstance(addGrupoModal);
        modalInstance.hide(); // Cerrar el modal
        addGrupoForm.reset(); // Reiniciar el formulario
        // Llamar a la función para recargar la lista de grupos
        loadGrupos();
    })
    .catch(error => console.error('Error:', error));
});

// Llamar a la función cuando se abra el modal
document.getElementById('addGrupoModal').addEventListener('shown.bs.modal', loadUsuarios);

// Función para cargar grupos en la tabla
function loadGrupos() {
    fetch('http://localhost:3000/api/gruposGes')
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar grupos');
            return response.json();
        })
        .then(data => {
            const tableBody = document.getElementById('employeeTableBody');
            tableBody.innerHTML = '';

            data.forEach(grupo => {
                const integrantes = grupo.integrantes || 'Sin integrantes';
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${grupo.IdGrupo}</td>
                    <td>${grupo.nombre_grupo}</td>
                    <td>${integrantes}</td>
                    <td>
                        <button class="btn btn-primary btn-editar" data-id="${grupo.IdGrupo}">Editar</button>
                        <button class="btn btn-danger btn-inactivar" data-id="${grupo.IdGrupo}">Inactivar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            // Agregar event listeners a los botones
            addEventListenersToButtons();
        })
        .catch(error => {
            console.error('Error al cargar grupos:', error);
            alert('No se pudieron cargar los grupos');
        });
}

// Función para inactivar grupo
function inactivarGrupo(grupoId) {
    console.log(`Inactivando grupo con ID: ${grupoId}`);
    if (!confirm('¿Está seguro de que desea inactivar este grupo?')) return;

    fetch(`http://localhost:3000/api/gruposGes/${grupoId}/inactivar`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('Error al inactivar el grupo');
        return response.json();
    })
    .then(() => {
        alert('Grupo inactivado correctamente');
        loadGrupos(); // Recargar la lista de grupos
    })
    .catch(error => {
        console.error('Error:', error);
        alert('No se pudo inactivar el grupo');
    });
}


    document.addEventListener('DOMContentLoaded', function () {
        document.getElementById('employeeTableBody').addEventListener('click', function(event) {
            if (event.target.classList.contains('btn-inactivar')) {
                const grupoId = event.target.getAttribute('data-id');
                if (grupoId) {
                    inactivarGrupo(grupoId);
                } else {
                    console.error("El botón no tiene un 'data-id'.");
                }
            }
        });
    });
    

// Agregar evento al formulario de agregar nuevo grupo
const addGrupoModal = document.getElementById("addGrupoModal"); // Asegúrate de que el ID sea correcto

addGrupoModal.addEventListener("submit", function (event) {
    event.preventDefault();

    // Obtener los datos del formulario
    const grupo = document.getElementById("grupo").value;
    const selectedOptions = document.getElementById("integrantes").selectedOptions;
    const integrantes = Array.from(selectedOptions).map(option => option.value); // Obtener valores seleccionados

    // Crear objeto con los datos
    const nuevoGrupo = {
        nombre_grupo: grupo,
        integrantes: integrantes // Cambiado a "integrantes"
    };

    // Enviar la solicitud POST al servidor
    fetch('http://localhost:3000/registrarGrupo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoGrupo)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al registrar el grupo');
        }
        return response.text(); // Si la respuesta es texto
    })
    .then(message => {
        console.log(message); // Mensaje de éxito
        loadGrupos(); // Recargar la lista de grupos
        // Cerrar el modal
        const addGrupoModal = bootstrap.Modal.getInstance(document.getElementById('addGrupoModal'));
        addGrupoModal.hide();
        // Limpiar los campos del formulario
        addGrupoForm.reset();
    })
    .catch(error => console.error('Error:', error));
});

function updateGrupo(grupoId) {
    const formData = {
        nombre_grupo: document.getElementById('editGrupo').value,
        integrantes: Array.from(document.getElementById('editIntegrantes').selectedOptions).map(option => option.value).join(', ') // Convertir a cadena
    };

    fetch(`http://localhost:3000/api/gruposGes/${grupoId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al actualizar el grupo');
            }
            return response.json();
        })
        .then(data => {
            alert('Grupo actualizado correctamente');
            loadGrupos(); // Recargar la lista de grupos
            bootstrap.Modal.getInstance(document.getElementById('editGrupoModal')).hide();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al actualizar el grupo');
        });
}


function loadUsuariosForEdit() {
    const grupoId = document.getElementById("grupoId").value; // Obtener el ID del grupo

    // Primero, obtener los integrantes actuales del grupo
    fetch(`http://localhost:3000/api/usuariosPorGrupo/${grupoId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(integrantes => {
            // Guardar los IDs de los integrantes actuales en un array
            const idsIntegrantes = integrantes.map(integrante => integrante.IdUsuario);

            // Ahora, obtener todos los usuarios disponibles
            return fetch('http://localhost:3000/api/empleados')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(usuarios => {
                    const usuarioSelect = document.getElementById("editIntegrantes");
                    usuarioSelect.innerHTML = ''; // Limpiar opciones existentes

                    // Agregar opciones de usuarios al select
                    usuarios.forEach(usuario => {
                        const option = document.createElement("option");
                        option.value = usuario.IdUsuario; // Asegúrate de que esto sea el ID del usuario
                        option.textContent = usuario.nombre_completo; // Mostrar el nombre completo en la opción

                        // Marcar como seleccionado si está en los integrantes actuales
                        if (idsIntegrantes.includes(usuario.IdUsuario)) {
                            option.selected = true; // Marcar como seleccionado
                        }

                        usuarioSelect.appendChild(option);
                    });
                });
        })
        .catch(error => console.error('Error:', error));
}


function addEventListenersToButtons() {
    const editButtons = document.querySelectorAll("#employeeTableBody .btn-primary");
    editButtons.forEach(button => {
        button.addEventListener("click", function () {
            const row = button.closest("tr");
            const grupoId = row.children[0].textContent;
            const nombreGrupo = row.children[1].textContent;
            const integrantes = row.children[2].textContent.split(', '); // Extraer los nombres de los integrantes
    
            // Rellenar el modal con los datos actuales
            document.getElementById("editGrupo").value = nombreGrupo;
            document.getElementById("grupoId").value = grupoId;
    
            // Cargar los integrantes seleccionados
            loadUsuariosForEdit(integrantes);
    
            // Mostrar el modal
            const editGrupoModal = new bootstrap.Modal(document.getElementById('editGrupoModal'));
            editGrupoModal.show();
        });
    });
}

const editGrupoForm = document.getElementById("editGrupoForm");
editGrupoForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const grupoId = document.getElementById("grupoId").value; // Obtener el ID del grupo
    const formData = {
        nombre_grupo: document.getElementById('editGrupo').value,
        integrantes: Array.from(document.getElementById('editIntegrantes').selectedOptions).map(option => option.value) // Obtener IDs de los usuarios seleccionados
    };

    console.log(formData); // Verifica qué valores estás obteniendo

    // Enviar la solicitud PUT al servidor
    fetch(`http://localhost:3000/api/gruposGes/${grupoId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al actualizar el grupo');
        }
        return response.json();
    })
    .then(data => {
        alert('Grupo actualizado correctamente');
        loadGrupos(); // Recargar la lista de grupos
        bootstrap.Modal.getInstance(document.getElementById('editGrupoModal')).hide();
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Error al actualizar el grupo');
    });
});


// Llamar a la función cuando se carga la página
document.addEventListener('DOMContentLoaded', loadGrupos);


// Función para cargar los usuarios disponibles en el modal
function loadUsuarios() {
    fetch('http://localhost:3000/api/empleados')
        .then(response => response.json())
        .then(data => {
            const selectIntegrantes = document.getElementById('integrantes');
            selectIntegrantes.innerHTML = '';  // Limpiar el contenido antes de agregar los usuarios
            data.forEach(usuario => {
                const option = document.createElement('option');
                option.value = usuario.IdUsuario; // Puedes ajustar el valor según lo que necesitas enviar al backend
                option.text = usuario.nombre_completo;
                selectIntegrantes.appendChild(option);
            });
        })
        .catch(error => console.error('Error:', error));
}

// Llamar a la función cuando se abra el modal
document.getElementById('addGrupoModal').addEventListener('shown.bs.modal', loadUsuarios);


let isSubmitting = false;

function initAddGrupoForm() {
    const form = document.getElementById('addGrupoForm');
    
    if (!form) {
        console.error('No se encontró el formulario');
        return;
    }

    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        if (isSubmitting) {
            console.log('Ya hay un envío en proceso');
            return;
        }

        try {
            isSubmitting = true;
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
            }

            // Generar ID único para esta solicitud
            const requestId = Date.now().toString() + Math.random().toString(36).substring(2);
            
            const formData = new FormData(form);
            const data = {
                nombre_grupo: formData.get('grupo'),
                integrantes: formData.getAll('integrantes[]'),
                requestId: requestId // Incluir el requestId en los datos
            };

            console.log('Enviando solicitud con ID:', requestId);

            const response = await fetch('http://localhost:3000/registrarGrupo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error || 'Error al registrar el grupo');
            }

            // Si todo sale bien, cerrar el modal y limpiar el formulario
            const modal = document.getElementById('addGrupoModal');
            if (modal) {
                const modalInstance = bootstrap.Modal.getInstance(modal);
                if (modalInstance) {
                    modalInstance.hide();
                }
            }
            form.reset();
            alert('Grupo registrado exitosamente');

        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        } finally {
            isSubmitting = false;
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = false;
            }
        }
    });
}
// Función para habilitar selección de múltiples opciones con un solo clic
function setupMultiSelectBehavior(selectElement) {
    selectElement.addEventListener('mousedown', function(e) {
        e.preventDefault(); // Prevenir el comportamiento predeterminado
        
        const option = e.target.closest('option');
        if (!option) return;

        // Alternar selección de la opción
        option.selected = !option.selected;

        // Disparar el evento change
        const event = new Event('change');
        selectElement.dispatchEvent(event);
    });

    // Opcional: Añadir soporte para teclado
    selectElement.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const option = this.options[this.selectedIndex];
            option.selected = !option.selected;
            
            const event = new Event('change');
            this.dispatchEvent(event);
        }
    });
}

// Inicializar en el modal de agregar grupo
document.addEventListener('DOMContentLoaded', () => {
    const addIntegrantesSelect = document.getElementById('integrantes');
    if (addIntegrantesSelect) {
        addIntegrantesSelect.setAttribute('multiple', 'multiple');
        setupMultiSelectBehavior(addIntegrantesSelect);
    }

    // Repetir para el modal de edición
    const editIntegrantesSelect = document.getElementById('editIntegrantes');
    if (editIntegrantesSelect) {
        editIntegrantesSelect.setAttribute('multiple', 'multiple');
        setupMultiSelectBehavior(editIntegrantesSelect);
    }
});

// Asegurarnos de que el formulario se inicializa una sola vez cuando el DOM está listo
document.addEventListener('DOMContentLoaded', initAddGrupoForm);

