 // Datos de ejemplo para los reportes
 const reportDescriptions = {
  1: 'Descripción del reporte 1.',
  2: 'Descripción del reporte 2.',
  3: 'Descripción del reporte 3.',
  4: 'Descripción del reporte 4.',
  5: 'Descripción del reporte 5.'
};

// Selecciona todos los botones "Ver más"
const verMasButtons2 = document.querySelectorAll('.ver-mas');

// Añade un event listener a cada botón
verMasButtons2.forEach(button => {
  button.addEventListener('click', function () {
      // Encuentra la fila más cercana al botón
      const row = this.closest('tr');
      const id = row.cells[0].textContent;
      const responsable = row.cells[1].textContent;
      const fecha = row.cells[2].textContent;
      const hora = row.cells[3].textContent;
      const area = row.cells[4].textContent;
      const ubicacion = row.cells[5].textContent;

      // Obtén la descripción del reporte basado en el ID
      const description = reportDescriptions[id] || 'No hay descripción disponible';

      // Actualiza el contenido del modal
      document.getElementById('modalContent').innerHTML = `
          <p><strong>ID:</strong> ${id}</p>
          <p><strong>Responsable:</strong> ${responsable}</p>
          <p><strong>Fecha:</strong> ${fecha}</p>
          <p><strong>Hora:</strong> ${hora}</p>
          <p><strong>Área:</strong> ${area}</p>
          <p><strong>Ubicación:</strong> ${ubicacion}</p>
          <p><strong>Descripción:</strong> ${description}</p>
          <div class="mt-3">
              <button class="btn btn btn-dark" onclick="printReport()">Imprimir Reportes</button>
          </div>
      `;
  });
});

// Actualizar la función de búsqueda
const searchEmployee2 = () => {
    const searchType = document.getElementById('searchType').value;
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const tableBody = document.getElementById('employeeTableBody');
    const rows = tableBody.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const nameCell = rows[i].getElementsByTagName('td')[1];
        const dateCell = rows[i].getElementsByTagName('td')[2];

        if (nameCell && dateCell) {
            const name = nameCell.textContent.toLowerCase();
            const date = dateCell.textContent;

            if (searchType === 'nombre' && name.includes(searchInput)) {
                rows[i].style.display = '';
            } else if (searchType === 'fecha' && date.includes(searchInput)) {
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
    if (this.value === 'nombre') {
        searchInput.placeholder = 'Ingrese el nombre';
    } else if (this.value === 'fecha') {
        searchInput.placeholder = 'Ingrese la fecha (dd/mm/yyyy)';
    }
});

// Agregar event listener para la búsqueda en tiempo real
document.getElementById('searchInput').addEventListener('keyup', searchEmployee2);
document.getElementById('searchType').addEventListener('change', searchEmployee2);


const cerrarSesionButton = document.getElementById("cerrarSesionButton");
document.getElementById("cerrarSesionButton").addEventListener("click", function(event) {
  event.preventDefault();
  window.location.href = "./../login1.html"; 
});

const registroButton = document.getElementById("registroButton");
document.getElementById("registroButton").addEventListener("click", function(event) {
  event.preventDefault();
  window.location.href = "./../administrador/registrarEmpleado.html";
});

const capacitacionesButton = document.getElementById("capacitacionesButton");
document.getElementById("capacitacionesButton").addEventListener("click", function(event) {
  event.preventDefault();
  window.location.href = "./../administrador/capacitacionesAdmin.html"; 
});

const empleadosButton = document.getElementById("empleadosButton");
document.getElementById("empleadosButton").addEventListener("click", function(event) {
  event.preventDefault();
  window.location.href = "./../administrador/listaEmpleados.html"; 
});

const reporteButton = document.getElementById("reporteButton");
document.getElementById("reporteButton").addEventListener("click", function(event) {
  event.preventDefault();
  window.location.href = "../administrador/generarReporteAdmin.html"; 
});

const gruposButton = document.getElementById("gruposButton");
document.getElementById("gruposButton").addEventListener("click", function(event) {
    event.preventDefault();
    window.location.href = "./../administrador/gruposGesAdmin.html";
});

const misReportesButton = document.getElementById("misReportesButton");
document.getElementById("misReportesButton").addEventListener("click", function(event) {
    event.preventDefault();
    window.location.href = "./../administrador/misReportesAdmin.html";
});

function printReport() {
  window.print("imprimirButton");
}

async function fetchData() {
  try {
    // Obtener datos de responsables
    const responseResponsable = await fetch("http://localhost:3000/api/all_responsable");
    if (!responseResponsable.ok) {
      throw new Error("Error en la respuesta de la API de responsables");
    }
    const responsablesData = await responseResponsable.json();

    // Crear un mapa de responsables
    const responsablesMap = new Map();
    responsablesData.forEach(item => {
      responsablesMap.set(item.IdUsuario, item.responsable);
    });

    // Obtener accidentes
    const responseAccidentes = await fetch(`http://localhost:3000/api/all_accidentes_incidentes`);
    if (!responseAccidentes.ok) {
      throw new Error("Error en la respuesta de la API de accidentes");
    }
    const accidentes = await responseAccidentes.json();

    // Obtener áreas
    const responseAreas = await fetch(`http://localhost:3000/api/all_area`);
    if (!responseAreas.ok) {
      throw new Error("Error en la respuesta de la API de áreas");
    }
    const areas = await responseAreas.json();

    // Obtener sectores
    const responseSector = await fetch(`http://localhost:3000/api/all_sector`);
    if (!responseSector.ok) {
      throw new Error("Error en la respuesta de la API de sectores");
    }
    const sectores = await responseSector.json();

    // Obtener adjuntos
    const responseAdjuntos = await fetch(`http://localhost:3000/api/all_adjunto`);
    if (!responseAdjuntos.ok) {
      throw new Error("Error en la respuesta de la API de adjuntos");
    }
    const adjuntos = await responseAdjuntos.json();

    // Crear mapas de datos para búsquedas rápidas
    const adjuntosMap = new Map();
    adjuntos.forEach(adjunto => {
      if (adjunto.IdReporte) {
        adjuntosMap.set(adjunto.IdReporte, adjunto);
      }
    });

    const areasMap = new Map();
    areas.forEach(area => {
      if (area.IdReporte) {
        areasMap.set(area.IdReporte, area.nombre_area);
      }
    });

    const sectoresMap = new Map();
    sectores.forEach(sector => {
      if (sector.IdReporte) {
        sectoresMap.set(sector.IdReporte, sector.nombre);
      }
    });

    // Limpiar la tabla actual
    const tableBody = document.getElementById("employeeTableBody");
    tableBody.innerHTML = "";

    // Insertar datos de accidentes en la tabla
    accidentes.forEach(accidente => {
      const fecha = accidente.fecha_hora ? new Date(accidente.fecha_hora) : null;
      const fechaFormateada = fecha ? fecha.toLocaleDateString() : "No disponible";
      const horaFormateada = fecha ? fecha.toLocaleTimeString() : "No disponible";

      // Obtener datos relacionados
      const areaNombre = areasMap.get(accidente.IdReporte) || "No asignada";
      const sectorNombre = sectoresMap.get(accidente.IdReporte) || "No asignado";
      const adjuntoInfo = adjuntosMap.get(accidente.IdReporte) || {};
      const responsableNombre = responsablesMap.get(accidente.IdUsuario) || "No asignado";

      // Crear una fila para la tabla
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${accidente.IdReporte || "N/A"}</td>
        <td>${responsableNombre}</td>
        <td>${fechaFormateada}</td>
        <td>${horaFormateada}</td>
        <td>${areaNombre}</td>
        <td>${sectorNombre}</td>
        <td>
          <button
            class="btn btn-primary btn-sm ver-mas"
            data-id="${accidente.IdReporte}"
            data-bs-toggle="modal"
            data-bs-target="#reportModal"
            onclick="showReportDetails(${JSON.stringify(accidente).replace(/"/g, "&quot;")}, 
                '${areaNombre}', 
                '${sectorNombre}', 
                '${responsableNombre}', 
                ${JSON.stringify(adjuntoInfo).replace(/"/g, "&quot;")})">
            Ver más
          </button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    // Agregar event listeners para los botones "Ver más"

  } catch (error) {
    console.error("Error al obtener datos:", error);
    alert("Error al obtener datos: " + error.message);
  }
}


 
  function showReportDetails(accidente, areaNombre, sectorNombre, responsableNombre, adjuntoInfo) {
    const fecha = accidente.fecha_hora ? new Date(accidente.fecha_hora) : null;
    const fechaFormateada = fecha ? fecha.toLocaleDateString() : 'No disponible';
    const horaFormateada = fecha ? fecha.toLocaleTimeString() : 'No disponible';

    // Preparar la información del adjunto
    const adjuntoDisplay = adjuntoInfo && adjuntoInfo.url
        ? `<a href="http://localhost:3000/uploads/${adjuntoInfo.url}" target="_blank">${adjuntoInfo.url}</a>`
        : 'Sin adjunto';

    // Preparar la información del responsable
    const responsableDisplay = responsableNombre || 'No asignado';

    document.getElementById('modalContent').innerHTML = `
      <p><strong>ID:</strong> ${accidente.IdReporte}</p>
      <p><strong>Responsable:</strong> ${responsableDisplay}</p>
      <p><strong>Fecha:</strong> ${fechaFormateada}</p>
      <p><strong>Hora:</strong> ${horaFormateada}</p>
      <p><strong>Área:</strong> ${areaNombre}</p>
      <p><strong>Sector:</strong> ${sectorNombre}</p>
      <p><strong>Descripción:</strong> ${accidente.descripcion || 'Sin descripción'}</p>
      <p><strong>Adjunto:</strong> ${adjuntoDisplay}</p>
    `;
}


  // Función para agregar event listeners a los botones "Ver más"
  function addVerMasEventListeners() {
    const verMasButtons = document.querySelectorAll('.ver-mas');
    verMasButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const reportId = this.getAttribute('data-id');
            // Los detalles se manejan ahora en showReportDetails
        });
    });
  }
  
  // Cargar datos cuando se carga la página
  document.addEventListener('DOMContentLoaded', fetchData);