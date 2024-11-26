
const cerrarSesionButton = document.getElementById("cerrarSesionButton");
document.getElementById("cerrarSesionButton").addEventListener("click", function(event) {
  event.preventDefault();
  window.location.href = "./../login1.html"; 
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

const verReporteButton = document.getElementById("verReporteButton");
document.getElementById("verReporteButton").addEventListener("click", function(event) {
  event.preventDefault();
  window.location.href = "../administrador/verReporteAdmin.html";
});

const reporteButton = document.getElementById("reporteButton");
document.getElementById("reporteButton").addEventListener("click", function(event) {
  event.preventDefault();
  window.location.href = "../administrador/generarReporteAdmin.html"; 
});

const registroButton = document.getElementById("registroButton");
document.getElementById("registroButton").addEventListener("click", function(event) {
    event.preventDefault();
    window.location.href = "./../administrador/registrarEmpleado.html";
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