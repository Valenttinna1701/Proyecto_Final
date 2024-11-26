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
