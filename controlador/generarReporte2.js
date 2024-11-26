document.addEventListener("DOMContentLoaded", function() {
    function initializeFlatpickr() {
        const fechaHoraInput = document.getElementById("fechaHora");
        if (fechaHoraInput) {
            flatpickr(fechaHoraInput, {
                enableTime: true,
                dateFormat: "Y-m-d H:i",
                time_24hr: true,
                locale: {
                    firstDayOfWeek: 1
                }
            });
        }
    }

    initializeFlatpickr();
});

// Botón Capacitaciones
const capacitacionesButton = document.getElementById("capacitacionesButton");
capacitacionesButton.addEventListener("click", function(event) {
  event.preventDefault();
  window.location.href = "./capacitacionesEmpleado.html"; 
});

// Botón Ver Reporte
const verReporteButton = document.getElementById("verReporteButton");
verReporteButton.addEventListener("click", function(event) {
  event.preventDefault();
  window.location.href = "./verReporteEmpleado.html";
});

// Botón Cerrar Sesión
const cerrarSesionButton = document.getElementById("cerrarSesionButton");
cerrarSesionButton.addEventListener("click", function(event) {
  event.preventDefault();
  window.location.href = "../login1.html"; 
});

document.getElementById('reporteForm').addEventListener('submit', function (event) {
  event.preventDefault();

  // Recuperar el IdUsuario desde localStorage
  const usuarioId = localStorage.getItem('usuarioId'); 
  console.log('IdUsuario recuperado:', usuarioId); // Para depuración

  if (!usuarioId) {
      alert('Error: Usuario no autenticado.');
      return;
  }

  const fechaHora = document.getElementById('fechaHora').value;
  const descripcion = document.getElementById('descripcion').value;
  const nombre_area = document.getElementById('area').value;
  const nombre = document.getElementById('ubicacion').value;
  const url = document.getElementById('adjuntoUrl').value;

  // Verificar que todos los campos estén llenos
  if (!fechaHora || !descripcion || !nombre_area || !nombre || !url) {
      alert('Error: Todos los campos son obligatorios.');
      return;
  }

  const data = {
      fecha_hora: fechaHora,
      descripcion: descripcion,
      nombre_area: nombre_area,
      nombre: nombre,
      url: url,
      IdUsuario: usuarioId  // Incluimos el IdUsuario en los datos enviados
  };


  fetch('http://localhost:3000/api/generarReporte', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  })
  .then(response => {
      if (response.ok) {
          alert('Reporte enviado exitosamente.');
          // Opcional: limpiar el formulario después de enviar
          document.getElementById('reporteForm').reset();
      } else {
          return response.json().then(errorData => {
              throw new Error(errorData.mensaje || 'Error al enviar el reporte.');
          });
      }
  })
  .catch(error => {
      console.error('Error:', error);
      alert('Error al enviar el reporte: ' + error.message);
  });
});


// Función para mostrar el popup de agregar área
function showAddAreaPopup() {
  const popup = document.getElementById('addAreaPopup');
  popup.style.display = 'block'; // Mostrar el popup

  // Llama a la función para cargar las áreas existentes
  fetchAreas(); 
}

// Función para llenar las áreas existentes
function fetchAreas() {
  fetch('http://localhost:3000/api/area') // Cambia la URL si es necesario
      .then(response => {
          if (!response.ok) {
              throw new Error('Error al obtener las áreas: ' + response.statusText);
          }
          return response.json();
      })
      .then(data => {
          const areaList = document.getElementById('areaList');
          areaList.innerHTML = ''; // Limpiar la lista antes de llenarla

          data.forEach(area => {
              const li = document.createElement('li');
              li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
              li.innerHTML = `
                  <span>${area.nombre_area}</span>
                  <div>
                      <button class="btn btn-warning btn-sm me-2" onclick="editArea(${area.IdArea})">Editar</button>
                      <button class="btn btn-danger btn-sm" onclick="eliminarArea(${area.IdArea})">Eliminar</button>
                  </div>
              `;
              areaList.appendChild(li);
          });
      })
      .catch(error => {
          console.error('Error al obtener las áreas:', error);
          alert('Error al cargar las áreas.');
      });
}

// Función para cerrar el popup de agregar área
function closeAddAreaPopup() {
  const popup = document.getElementById('addAreaPopup');
  popup.style.display = 'none'; // Ocultar el popup
}

// Manejador del formulario de agregar área
document.getElementById('addAreaForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Previene el comportamiento por defecto del formulario
  const areaName = document.getElementById('newAreaName').value; // Ajusta aquí el ID

  if (!areaName) {
      alert('El nombre del área es obligatorio.');
      return;
  }

  fetch('http://localhost:3000/registrarArea', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre_area: areaName }),
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Error al agregar el área');
      }
      alert('Área agregada correctamente');
      document.getElementById('addAreaForm').reset(); // Limpiar el formulario
      fetchAreas(); // Actualiza la lista de áreas
      closeAddAreaPopup(); // Cierra el popup de agregar área
  })
  .catch(error => {
      console.error('Error al agregar el área:', error);  
      alert('Error al agregar el área.');
  });
});

// Función para eliminar un área
function eliminarArea(idArea) {
  fetch(`http://localhost:3000/api/area/${idArea}`, {
      method: 'DELETE',
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Error al eliminar el área');
      }
      alert('Área eliminada correctamente');
      fetchAreas(); // Actualiza la lista de áreas
  })
  .catch(error => {
      console.error('Error al eliminar el área:', error);
      alert('Error al eliminar el área.');
  });
}
//Editar 
function editArea(id) {
  console.log('Editando área con ID:', id); // Verifica que se está pasando el ID correcto
  const newAreaName = prompt('Introduce el nuevo nombre del área:');
  if (newAreaName) {
      fetch(`http://localhost:3000/api/area/${id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nombre_area: newAreaName }),
      })
      .then(response => {
          console.log('Respuesta del servidor:', response); // Verifica la respuesta del servidor
          if (!response.ok) {
              throw new Error('Error al actualizar el área: ' + response.statusText);
          }
          return response.json();
      })
      .then(data => {
          alert(data.message);
          fetchAreas(); // Actualiza la lista de áreas
      })
      .catch(error => {
          console.error('Error al actualizar el área:', error);
          alert('Error al actualizar el área.');
      });
  }
}
// Función para eliminar un área
function deleteArea(id) {
  if (confirm('¿Estás seguro de que deseas eliminar esta área?')) {
      const url = `http://localhost:3000/api/area/${id}`;
      console.log(`URL de eliminación: ${url}`); // Verifica la URL

      fetch(url, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
          },
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Error al eliminar el área: ' + response.statusText);
          }
          alert('Área eliminada correctamente');
          fetchAreas(); // Actualiza la lista de áreas
      })
      .catch(error => {
          console.error('Error al eliminar el área:', error);
          alert('Error al eliminar el área.');
      });
  }
}
// Función para mostrar el popup de agregar sector
function showAddSectorPopup() {
  const popup = document.getElementById('addSectorPopup');
  popup.style.display = 'block';
  fetchSectors();
}

// Función para cerrar el popup de agregar sector
function closeAddSectorPopup() {
  const popup = document.getElementById('addSectorPopup');
  popup.style.display = 'none';
}

// Función para llenar los sectores existentes
function fetchSectors() {
  fetch('http://localhost:3000/api/sector')
      .then(response => {
          if (!response.ok) {
              throw new Error('Error al obtener los sectores: ' + response.statusText);
          }
          return response.json();
      })
      .then(data => {
          const sectorList = document.getElementById('sectorList');
          sectorList.innerHTML = '';

          data.forEach(sector => {
              const li = document.createElement('li');
              li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
              li.innerHTML = `
                  <span>${sector.nombre}</span>
                  <div>
                      <button class="btn btn-warning btn-sm me-2" onclick="editSector(${sector.id_sector})">Editar</button>
                      <button class="btn btn-danger btn-sm" onclick="eliminarSector(${sector.id_sector})">Eliminar</button>
                  </div>
              `;
              sectorList.appendChild(li);
          });
      })
      .catch(error => {
          console.error('Error al obtener los sectores:', error);
          alert('Error al cargar los sectores.'); // Muestra el error como alerta
      });
}

// Manejador del formulario de agregar sector
document.getElementById('addSectorForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const sectorName = document.getElementById('newSectorName').value;

  if (!sectorName) {
      alert('El nombre del sector es obligatorio.'); // Mensaje de alerta
      return;
  }

  fetch('http://localhost:3000/registrarSector', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre: sectorName }),
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Error al agregar el sector');
      }
      alert('Sector agregado correctamente'); // Mensaje de éxito
      document.getElementById('addSectorForm').reset();
      fetchSectors(); // Actualiza la lista de sectores
      closeAddSectorPopup();
  })
  .catch(error => {
      console.error('Error al agregar el sector:', error);
      alert('Error al agregar el sector.'); // Mensaje de error
  });
});

// Función para editar un sector
function editSector(id) {
  const newSectorName = prompt('Introduce el nuevo nombre del sector:');
  if (newSectorName) {
      fetch(`http://localhost:3000/api/sector/${id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nombre: newSectorName }),
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Error al actualizar el sector: ' + response.statusText);
          }
          alert('Sector actualizado correctamente'); // Mensaje de éxito
          fetchSectors(); // Actualiza la lista de sectores
      })
      .catch(error => {
          console.error('Error al actualizar el sector:', error);
          alert('Error al actualizar el sector.'); // Mensaje de error
      });
  }
}

// Función para eliminar un sector
function eliminarSector(id) {
  if (confirm('¿Estás seguro de que deseas eliminar este sector?')) {
      fetch(`http://localhost:3000/api/sector/${id}`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
          },
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Error al eliminar el sector');
          }
          alert('Sector eliminado correctamente'); // Mensaje de éxito
          fetchSectors(); // Actualiza la lista de sectores
      })
      .catch(error => {
          console.error('Error al eliminar el sector:', error);
          alert('Error al eliminar el sector.'); // Mensaje de error
      });
  }
}

// Función para editar un sector
function editSector(id) {
  const newSectorName = prompt('Introduce el nuevo nombre del sector:');
  if (newSectorName) {
      fetch(`http://localhost:3000/api/sector/${id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nombre: newSectorName }),
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Error al actualizar el sector: ' + response.statusText);
          }
          return response.json();
      })
      .then(data => {
          document.getElementById('sectorSuccess').innerText = data.message;
          fetchSectors(); // Actualizar la lista de sectores automáticamente
      })
      .catch(error => {
          console.error('Error al actualizar el sector:', error);
          document.getElementById('sectorError').innerText = 'Error al actualizar el sector.';
      });
  }
}

// Función para eliminar un sector
function eliminarSector(id) {
  if (confirm('¿Estás seguro de que deseas eliminar este sector?')) {
      fetch(`http://localhost:3000/api/sector/${id}`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
          },
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Error al eliminar el sector');
          }
          document.getElementById('sectorSuccess').innerText = 'Sector eliminado correctamente';
          fetchSectors(); // Actualizar la lista de sectores automáticamente
      })
      .catch(error => {
          console.error('Error al eliminar el sector:', error);
          document.getElementById('sectorError').innerText = 'Error al eliminar el sector.';
      });
  }
}
