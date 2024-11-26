const ingresarButton = document.getElementById("ingresarButton");
ingresarButton.addEventListener("click", function(event) {
    event.preventDefault(); // Evita la redirección automática del enlace

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Verificamos que los campos no estén vacíos
    if (!email || !password) {
        document.getElementById("warningMessage").textContent = "Por favor, completa todos los campos.";
        return;
    }

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            correo_electronico: email,
            contrasena: password
        })
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 403) {
                // Usuario inactivo
                throw new Error("Usuario inactivo. Contacte al administrador.");
            }
            if (response.status === 401) {
                // Credenciales incorrectas
                throw new Error("Credenciales incorrectas.");
            }
            throw new Error("Error desconocido. Intente más tarde.");
        }
        return response.json();
    })
    .then(data => {
        if (data.mensaje === 'Login exitoso') {
            // Almacenar el usuarioId en localStorage
            localStorage.setItem('usuarioId', data.IdUsuario);
            console.log('IdUsuario almacenado:', data.IdUsuario);

            // Redirigir según el rol del usuario
            switch (data.rol) {
                case '1': // Administrador
                    window.location.href = "./administrador/inicioAdmin.html";
                    break;
                case '2': // Empleado
                    window.location.href = "./empleado/inicioEmpleado.html";
                    break;
                default:
                    document.getElementById("warningMessage").textContent = "Rol no reconocido.";
                    break;
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById("warningMessage").textContent = error.message;
    });
});

// Acción del botón "volver"
const volverButton = document.getElementById("volverButton");
volverButton.addEventListener("click", function(event) {
    event.preventDefault(); // Evita la redirección automática del enlace
    window.location.href = "./index.html"; // Redirige manualmente a la página de inicio de sesión
});
