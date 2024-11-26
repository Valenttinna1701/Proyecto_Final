document.addEventListener("DOMContentLoaded", function() {
    const loginButton = document.getElementById("loginButton");
    const articleContent = document.getElementById("articleContent");
    const navButtons = document.querySelectorAll(".nav-button");

    // Evento de clic para el botón de iniciar sesión
    loginButton.addEventListener("click", function(event) {
        event.preventDefault();
        console.log("Login button clicked.");
        window.location.href = "./login1.html"; // Asegúrate de que esta ruta sea correcta
    });

    // Eventos de clic para los botones de navegación
    navButtons.forEach(button => {
        button.addEventListener("click", function() {
            const id = button.id;
            console.log(`Button clicked: ${id}`);
            
            // Añadir clase de animación fade-out al contenido
            articleContent.classList.remove('fade-in');
            articleContent.classList.add('fade-out');

            // Cambia el contenido después de la animación
            setTimeout(() => {
                switch (id) {
                    case 'homeButton':
                        articleContent.innerHTML = `
                            <h2 class="mb-4">Nuestra Misión</h2>
                            <p>En Imperseg, nos dedicamos a la confección de impermeables y trajes de seguridad
                                 industrial de alta calidad. Nuestro objetivo es proteger a los trabajadores en 
                                 entornos adversos y condiciones extremas, utilizando materiales resistentes y 
                                 tecnología de vanguardia para garantizar la máxima seguridad y comodidad.</p>
                            <p>Nos enfocamos en la innovación constante para ofrecer productos duraderos que cumplan 
                                con las normativas de seguridad más exigentes, contribuyendo así a la protección y 
                                bienestar de nuestros clientes.</p>
                        `;
                        break;
                    case 'aboutUsButton':
                        articleContent.innerHTML = `
                            <h2 class="mb-4">Sobre Nosotros</h2>
                            <p>En Imperseg, nos dedicamos a la creación de impermeables y trajes de seguridad industrial diseñados 
                                para ofrecer la máxima protección en condiciones extremas. Nuestra pasión es resguardar a los 
                                trabajadores en entornos difíciles mediante el uso de materiales de alta resistencia y tecnología 
                                avanzada. Estamos comprometidos con la innovación constante, lo que nos permite desarrollar productos duraderos 
                                que cumplen con las normativas de seguridad más rigurosas. Nuestro objetivo es asegurar que cada prenda 
                                no solo ofrezca una protección efectiva, sino también un alto nivel de comodidad, contribuyendo así al 
                                bienestar de quienes confían en nosotros. En Imperseg, no solo fabricamos equipos de protección; estamos 
                                dedicados a fortalecer la seguridad y la confianza de nuestros clientes en cada desafío que enfrenten.</p>
                        `;
                        break;
                    case 'faqButton':
                        articleContent.innerHTML = `
                            <h2>Preguntas Frecuentes</h2>
                            <p>¿Qué tipo de trajes para la lluvia ofrecen?</p>
                            <p>Nuetros trajes para la lluvia están diseñados para proporcionar protección completa en condiciones adversas. Ofrecemos modelos para uso industrial, comercial y personal, con opciones que incluyen impermeabilidad, visibilidad y resistencia al desgaste.</p>
                            <p>¿Tienen opciones de personalización para los trajes?</p>
                            <p>Sí, ofrecemos opciones de personalización que incluyen la incorporación de logotipos, colores específicos y ajustes personalizados para asegurar que el traje cumpla con las necesidades exactas de su empresa.</p>
                        `;
                        break;
                    case 'locationButton':
                        articleContent.innerHTML = `
                            <h2>Ubicación</h2>
                            <p><strong>Dirección:</strong> Calle 30 Sur #52-13, Bogotá</p>
                            <p><strong>Horario de Atención:</strong></p>
                            <ul>
                             <li>Lunes a Viernes: 7:30AM - 6:00 PM</li>
                            <li>Sábado: Cerrado</li>
                            <li>Domingo: Cerrado</li>
                            </ul>
                            <h4>Cómo Llegar</h4>
                            <p>Estamos ubicados cerca de la Estación de Transmilenio NQS Calle 30 Sur</p>
                        `;
                        break;
                }    

               
            }); 
            // Resaltar el botón activo
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
});
