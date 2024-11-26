  // app.js
  const express = require("express");
  const mysql = require("mysql2");
  const bodyParser = require("body-parser");
  const cors = require("cors");
  const bcrypt = require("bcrypt");

  const app = express();
  const port = 3000; // Puedes cambiar el puerto si lo necesitas

  // Configura el middleware para manejar datos JSON y URL-encoded
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());
  app.use(express.json());

  // Configura la conexión a la base de datos
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "bd_oficial",
  });

  // Conecta a la base de datos
  connection.connect((err) => {
    if (err) {
      console.error("Error conectando a la base de datos:", err.stack);
      return;
    }
    console.log("Conectado a la base de datos como id " + connection.threadId);
  });


  // Ruta para obtener la lista de empleados
  app.get("/api/empleados", (req, res) => {
    const query = "SELECT * FROM usuario"; // Cambia 'usuario' por el nombre correcto de tu tabla
    connection.query(query, (error, results) => {
      if (error) {
        console.error("Error al obtener empleados:", error);
        return res.status(500).json({ error: "Error al obtener empleados" });
      }
      res.json(results); // Envía la lista de empleados como respuesta
    });
  });

 
// Ruta para registrar un empleado en la tabla 'usuario'
app.post("/registrarEmpleado", async (req, res) => {
  const {
    nombre_completo,
    numero_identificacion,
    correo_electronico,
    telefono,
    num_emergencia,
    EPS,
    RH,
    direccion,
    contrasena,
    rol_usuario,
  } = req.body;

  try {
    // Encriptamos la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const query = `
      INSERT INTO usuario 
      (nombre_completo, numero_identificacion, correo_electronico, telefono, num_emergencia, EPS, RH, direccion, contrasena, rol_usuario) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(
      query,
      [
        nombre_completo,
        numero_identificacion,
        correo_electronico,
        telefono,
        num_emergencia,
        EPS,
        RH,
        direccion,
        hashedPassword, // Usamos la contraseña encriptada
        rol_usuario,
      ],
      (error, results) => {
        if (error) {
          res.status(500).send("Error al registrar el empleado.");
          console.error("Error al insertar en la base de datos:", error);
          return;
        }
        res.status(200).send("Empleado registrado correctamente.");
      }
    );
  } catch (error) {
    res.status(500).send("Error al procesar el registro.");
    console.error(error);
  }
});

  // Ruta para inactivar un empleado
  app.put('/api/empleados/:id/inactivar', (req, res) => {
    const id = req.params.id;
    const query = 'UPDATE usuario SET Activo = 0 WHERE IdUsuario = ?';
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al inactivar el empleado:', error);
            return res.status(500).json({ error: 'Error al inactivar el empleado' });
        }
        res.json({ message: 'Empleado inactivado correctamente' });
    });
});

app.post("/login", (req, res) => {
  const { correo_electronico, contrasena } = req.body;

  if (!correo_electronico || !contrasena) {
      console.log("Faltan datos en la solicitud de login.");
      return res.status(400).json({ mensaje: "Correo electrónico y contraseña son obligatorios." });
  }

  // Consulta a la tabla 'usuario' para obtener los detalles del usuario
  const query = "SELECT * FROM usuario WHERE correo_electronico = ?";
  connection.query(query, [correo_electronico], async (error, results) => {
      if (error) {
          console.error("Error en la consulta a la base de datos:", error);
          return res.status(500).json({ mensaje: "Error en el servidor. Intente más tarde." });
      }

      if (results.length === 0) {
          console.log("Usuario no encontrado.");
          return res.status(401).json({ mensaje: "Credenciales incorrectas." });
      }

      const user = results[0];

      // Convertir el valor de `Activo` si es un Buffer
      const isActive = Buffer.isBuffer(user.Activo)
          ? user.Activo[0] === 1 // Buffer devuelve un array de bytes, tomamos el primer byte
          : user.Activo === 1;

      if (!isActive) {
          console.log("El usuario está inactivo. Impidiendo el acceso.");
          return res.status(403).json({ mensaje: "Usuario inactivo. No puede acceder al sistema." });
      }

      try {
          // Validar la contraseña
          const match = await bcrypt.compare(contrasena, user.contrasena);
          if (!match) {
              console.log("Contraseña incorrecta.");
              return res.status(401).json({ mensaje: "Credenciales incorrectas." });
          }

          // Si la validación es exitosa
          const { rol_usuario, IdUsuario } = user;

          console.log("Inicio de sesión exitoso.");
          return res.status(200).json({
              mensaje: "Login exitoso",
              rol: rol_usuario,
              IdUsuario,
          });
      } catch (error) {
          console.error("Error al comparar contraseñas:", error);
          return res.status(500).json({ mensaje: "Error al validar las credenciales." });
      }
  });
});




  // Ruta para obtener un empleado específico
  app.get("/api/empleados/:id", (req, res) => {
    const id = req.params.id;
    const query = "SELECT * FROM usuario WHERE IdUsuario = ?"; // Cambia 'IdUsuario' según el nombre de tu columna
    connection.query(query, [id], (error, results) => {
      if (error) {
        console.error("Error al obtener el empleado:", error);
        return res.status(500).json({ error: "Error al obtener el empleado" });
      }
      if (results.length > 0) {
        res.json(results[0]); // Envía el empleado encontrado como respuesta
      } else {
        res.status(404).json({ error: "Empleado no encontrado" });
      }
    });
  });

  // Ruta para actualizar un empleado
  app.put("/api/empleados/:id", (req, res) => {
    const id = req.params.id;
    const {
      nombre_completo,
      numero_identificacion,
      correo_electronico,
      telefono,
      num_emergencia,
      EPS,
      RH,
      direccion,
      rol_usuario,
    } = req.body;
    const query = `
              UPDATE usuario 
              SET nombre_completo = ?, numero_identificacion = ?, correo_electronico = ?, 
                  telefono = ?, num_emergencia = ?, EPS = ?, RH = ?, direccion = ?, rol_usuario = ?
              WHERE IdUsuario = ?
          `;
    connection.query(
      query,
      [
        nombre_completo,
        numero_identificacion,
        correo_electronico,
        telefono,
        num_emergencia,
        EPS,
        RH,
        direccion,
        rol_usuario,
        id,
      ],
      (error, results) => {
        if (error) {
          console.error("Error al actualizar el empleado:", error);
          return res
            .status(500)
            .json({ error: "Error al actualizar el empleado" });
        }
        res.json({ message: "Empleado actualizado correctamente" });
      }
    );
  });

  // Ruta para inactivar un capacitación
  app.put("/api/capacitaciones/:idCapacitacion/inactivar", (req, res) => {
    const id = req.params.idCapacitacion; // Cambiado de req.params.id a req.params.idCapacitacion
    console.log("Attempting to inactivate group with id:", id);

    const query = "UPDATE capacitaciones SET Activo = 0 WHERE IdCapacitacion = ?";
    connection.query(query, [id], (error, results) => {
      if (error) {
        console.error("Error al inactivar la capacitacion:", error);
        return res.status(500).json({ error: "Error al inactivar el grupo" });
      }
      console.log("Query results:", results);
      res.json({ message: "capacitacion inactivada correctamente" });
    });
  });

  // Ruta para obtener la lista de grupos con sus integrantes
  app.get("/api/gruposGes", (req, res) => {
    const query = `
              SELECT g.IdGrupo, g.nombre_grupo, GROUP_CONCAT(u.nombre_completo) AS integrantes
              FROM grupos_ges g
              LEFT JOIN usuario_grupo ug ON g.IdGrupo = ug.IdGrupo
              LEFT JOIN usuario u ON ug.IdUsuario = u.IdUsuario
              GROUP BY g.IdGrupo;
          `;

    connection.query(query, (error, results) => {
      if (error) {
        console.error("Error al obtener grupos:", error);
        return res
          .status(500)
          .json({ error: "Error en la consulta de la base de datos" });
      }
      res.json(results);
    });
  });



  const processedRequests = new Set();

  app.post('/registrarGrupo', async (req, res) => {
    const { nombre_grupo, integrantes, requestId } = req.body;

    console.log('Recibida solicitud con ID:', requestId);

    // Validación más estricta del requestId
    if (!requestId) {
        return res.status(400).json({
            error: 'requestId es requerido'
        });
    }

    // Verificar si esta solicitud ya fue procesada
    if (processedRequests.has(requestId)) {
        console.log('Solicitud duplicada detectada:', requestId);
        return res.status(409).json({
            error: 'Solicitud duplicada',
            details: 'Esta solicitud ya fue procesada'
        });
    }

    // Validaciones básicas
    if (!nombre_grupo || !integrantes || !Array.isArray(integrantes) || integrantes.length === 0) {
        return res.status(400).json({
            error: 'Datos inválidos',
            details: 'Nombre de grupo e integrantes son requeridos'
        });
    }

    try {
        // Agregar el ID de solicitud al conjunto de solicitudes procesadas
        processedRequests.add(requestId);

        // Programar la limpieza del ID después de 5 minutos
        setTimeout(() => {
            processedRequests.delete(requestId);
        }, 300000); // 5 minutos

        // Verificar si el grupo existe
        const [gruposExistentes] = await connection.promise().query(
            'SELECT * FROM grupos_ges WHERE nombre_grupo = ?',
            [nombre_grupo]
        );

        if (gruposExistentes.length > 0) {
            throw new Error('El grupo ya existe');
        }

        // Insertar el nuevo grupo
        const [resultGrupo] = await connection.promise().query(
            'INSERT INTO grupos_ges (nombre_grupo) VALUES (?)',
            [nombre_grupo]
        );

        const idGrupo = resultGrupo.insertId;

        // Preparar los valores para insertar los integrantes en la tabla usuario_grupo
        const valoresIntegrantes = integrantes.map(idUsuario => [idUsuario, idGrupo]);

        // Insertar los integrantes en usuario_grupo
        await connection.promise().query(
            'INSERT INTO usuario_grupo (IdUsuario, IdGrupo) VALUES ?',
            [valoresIntegrantes]
        );

        // Ahora registrar a los integrantes en la tabla asistencia con el valor 'asistencia = 0'
        const valoresAsistencia = integrantes.map(idUsuario => [idGrupo, idUsuario, 0]); // 0 indica que no han asistido aún

        // Insertar los registros en la tabla asistencia
        await connection.promise().query(
            'INSERT INTO asistencia (IdGrupo, IdUsuario, asistencia) VALUES ?',
            [valoresAsistencia]
        );

        res.status(200).json({
            success: true,
            message: 'Grupo y asistencia registrados correctamente',
            idGrupo: idGrupo
        });

    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({
            error: 'Error al procesar la solicitud',
            details: error.message
        });
    }
  });



  app.put("/api/gruposGes/:id", (req, res) => {
    const id = req.params.id;
    const { nombre_grupo, integrantes } = req.body; // Cambia Integrantes a integrantes

    const query = `
              UPDATE grupos_ges
              SET nombre_grupo = ?
              WHERE IdGrupo = ?
          `;

    connection.query(query, [nombre_grupo, id], (error, results) => {
      if (error) {
        console.error("Error al actualizar el grupo:", error);
        return res.status(500).json({ error: "Error al actualizar el grupo" });
      }

      // Aquí es donde debes colocar el bloque de código para eliminar los integrantes anteriores
      const deleteQuery = `
                  DELETE FROM usuario_grupo
                  WHERE IdGrupo = ?
              `;
      connection.query(deleteQuery, [id], (error) => {
        if (error) {
          console.error("Error al eliminar integrantes anteriores:", error);
          return res
            .status(500)
            .json({ error: "Error al eliminar integrantes anteriores" });
        }

        // Ahora inserta los nuevos integrantes en la tabla usuario_grupo
        const insertQuery = `
                      INSERT INTO usuario_grupo (IdUsuario, IdGrupo)
                      VALUES ?
                  `;

        const values = integrantes.map((integrante) => [integrante, id]); // Prepara los valores para la inserción

        connection.query(insertQuery, [values], (error) => {
          if (error) {
            console.error("Error al insertar integrantes:", error);
            return res
              .status(500)
              .json({ error: "Error al insertar integrantes" });
          }
          res.json({ message: "Grupo actualizado correctamente" });
        });
      });
    });
  });

  // Ruta para obtener la lista de capacitaciones con el nombre del grupo
  app.get("/api/capacitaciones", (req, res) => {
      const query = `
        SELECT c.IdCapacitacion, c.nombre_grupo AS nombre_capacitacion, g.nombre_grupo AS nombre_grupo, 
              c.fecha_inicio, c.fecha_fin, c.Descripcion, c.IdGrupo, c.Activo
        FROM capacitaciones c
        LEFT JOIN grupos_ges g ON c.IdGrupo = g.IdGrupo;
      `;

      connection.query(query, (error, results) => {
          if (error) {
              console.error("Error al obtener capacitaciones:", error);
              return res.status(500).json({ error: "Error al obtener capacitaciones" });
          }
          res.status(200).json(results); // Devuelve los resultados obtenidos
      });
  });

    

  // Ruta para obtener un empleado específico
  app.get("/api/capacitaciones/:id", (req, res) => {
    const id = req.params.id;
    const query = "SELECT * FROM capacitaciones WHERE IdCapacitacion = ?";
    connection.query(query, [id], (error, results) => {
      if (error) {
        console.error("Error al obtener el capacitacion:", error);
        return res
          .status(500)
          .json({ error: "Error al obtener el capacitacion" });
      }
      if (results.length > 0) {
        res.json(results[0]); // Envía el empleado encontrado como respuesta
      } else {
        res.status(404).json({ error: "capacitacion no encontrada" });
      }
    });
  });

  app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });

  // Código para formulario de reportes de accidentes
  app.post("/api/generarReporte", (req, res) => {
    const { fecha_hora, descripcion, nombre_area, nombre, url, IdUsuario } =
      req.body; // Incluimos IdUsuario

    // Verificar que todos los campos necesarios estén presentes
    if (
      !fecha_hora ||
      !descripcion ||
      !nombre_area ||
      !nombre ||
      !url ||
      !IdUsuario
    ) {
      return res
        .status(400)
        .json({ mensaje: "Todos los campos son obligatorios." });
    }

    // Iniciar una transacción para asegurarse de que todas las consultas se ejecuten o ninguna
    connection.beginTransaction((err) => {
      if (err) {
        console.error("Error al iniciar la transacción:", err);
        return res
          .status(500)
          .json({ mensaje: "Error al iniciar la transacción." });
      }

      // Primera consulta: insertar en la tabla accidentes_incidentes
      const queryAccidentes = `
              INSERT INTO accidentes_incidentes (fecha_hora, descripcion, IdUsuario)
              VALUES (?, ?, ?)
          `;
      connection.query(
        queryAccidentes,
        [fecha_hora, descripcion, IdUsuario],
        (error, results) => {
          if (error) {
            console.error("Error al insertar en accidentes_incidentes:", error);
            return connection.rollback(() => {
              res
                .status(500)
                .json({ mensaje: "Error al registrar accidente/incidente." });
            });
          }

          const idReporte = results.insertId; // Obtener el id del reporte insertado

          // Segunda consulta: insertar en la tabla area
          const queryArea = `
                  INSERT INTO area (nombre_area, idReporte)
                  VALUES (?, ?)
              `;
          connection.query(queryArea, [nombre_area, idReporte], (error) => {
            if (error) {
              console.error("Error al insertar en area:", error);
              return connection.rollback(() => {
                res.status(500).json({ mensaje: "Error al registrar el área." });
              });
            }

            // Tercera consulta: insertar en la tabla sector
            const querySector = `
                      INSERT INTO sector (nombre, idReporte)
                      VALUES (?, ?)
                  `;
            connection.query(querySector, [nombre, idReporte], (error) => {
              if (error) {
                console.error("Error al insertar en sector:", error);
                return connection.rollback(() => {
                  res
                    .status(500)
                    .json({ mensaje: "Error al registrar en la tabla sector." });
                });
              }

              // Cuarta consulta: insertar en la tabla adjunto
              const queryAdjunto = `
                          INSERT INTO adjunto (url, idReporte)
                          VALUES (?, ?)
                      `;
              connection.query(queryAdjunto, [url, idReporte], (error) => {
                if (error) {
                  console.error("Error al insertar en adjunto:", error);
                  return connection.rollback(() => {
                    res
                      .status(500)
                      .json({
                        mensaje: "Error al registrar en la tabla adjunto.",
                      });
                  });
                }

                // Si todo va bien, hacemos commit de la transacción
                connection.commit((err) => {
                  if (err) {
                    console.error("Error al realizar el commit:", err);
                    return connection.rollback(() => {
                      res
                        .status(500)
                        .json({ mensaje: "Error al realizar el commit." });
                    });
                  }
                  res
                    .status(200)
                    .json({ mensaje: "Reporte registrado correctamente." });
                });
              });
            });
          });
        }
      );
    });
  });

  //Ruta

  app.get("/api/area", (req, res) => {
    const query = "SELECT * FROM area";
    connection.query(query, (error, results) => {
      if (error) {
        console.error("Error al obtener áreas:", error);
        return res.status(500).json({ error: "Error al obtener áreas" });
      }
      res.status(200).json(results);
    });
  });

  // Ruta para registrar un área
  app.post("/registrarArea", (req, res) => {
    const { nombre_area } = req.body;

    const query = `INSERT INTO area (nombre_area) VALUES (?)`;
    connection.query(query, [nombre_area], (error, results) => {
      if (error) {
        console.error("Error al registrar el área:", error);
        return res.status(500).json({ error: "Error al registrar el área" });
      }
      res.status(201).json({ message: "Área registrada correctamente" });
    });
  });
  //Editar
  app.put("/api/area/:id", (req, res) => {
    const id = req.params.id;
    const { nombre_area } = req.body;

    if (!nombre_area) {
      return res.status(400).json({ error: "El nombre del área es requerido" });
    }

    const query = "UPDATE area SET nombre_area = ? WHERE IdArea = ?";
    connection.query(query, [nombre_area, id], (error, results) => {
      if (error) {
        console.error("Error al actualizar el área:", error);
        return res.status(500).json({ error: "Error al actualizar el área" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Área no encontrada" });
      }

      res.status(200).json({ message: "Área actualizada correctamente" });
    });
  });
  // Ruta para eliminar un área
  // Ruta para eliminar un área
  app.delete("/api/area/:id", (req, res) => {
    const id = req.params.id;
    console.log(`Intentando eliminar el área con ID: ${id}`);

    const query = "DELETE FROM area WHERE IdArea = ?"; // Asegúrate de que 'IdArea' es correcto
    connection.query(query, [id], (error, results) => {
      if (error) {
        console.error("Error al eliminar el área:", error);
        return res.status(500).json({ error: "Error al eliminar el área" });
      }

      console.log(`Resultados de la eliminación: ${JSON.stringify(results)}`);

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Área no encontrada" });
      }

      res.status(200).json({ message: "Área eliminada correctamente" });
    });
  });

  // Ruta para obtener todos los sectores
app.get('/api/sector', (req, res) => {
    const query = 'SELECT * FROM sector';
    
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener sectores:', error);
            return res.status(500).json({ error: 'Error al obtener sectores' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No se encontraron sectores' });
        }

        res.status(200).json(results);
    });
});

// Ruta para registrar un sector
app.post('/registrarSector', (req, res) => {
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).json({ error: 'El nombre del sector es requerido' });
    }

    const query = 'INSERT INTO sector (nombre) VALUES (?)';
    
    connection.query(query, [nombre], (error, results) => {
        if (error) {
            console.error('Error al registrar el sector:', error);
            return res.status(500).json({ error: 'Error al registrar el sector' });
        }

        res.status(201).json({ message: 'Sector registrado correctamente', sectorId: results.insertId });
    });
});

// Ruta para editar un sector
app.put('/api/sector/:id', (req, res) => {
    const id = req.params.id;
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).json({ error: 'El nombre del sector es requerido' });
    }

    const query = 'UPDATE sector SET nombre = ? WHERE id_sector = ?';
    
    connection.query(query, [nombre, id], (error, results) => {
        if (error) {
            console.error('Error al actualizar el sector:', error);
            return res.status(500).json({ error: 'Error al actualizar el sector' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Sector no encontrado' });
        }

        res.status(200).json({ message: 'Sector actualizado correctamente' });
    });
});
// Ruta para eliminar un sector
app.delete('/api/sector/:id', (req, res) => {
    const id = req.params.id;

    const query = 'DELETE FROM sector WHERE id_sector = ?';

    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al eliminar el sector:', error);
            return res.status(500).json({ error: 'Error al eliminar el sector' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Sector no encontrado' });
        }

        res.status(200).json({ message: 'Sector eliminado correctamente' });
    });
});


   // Ruta para inactivar un grupo
app.put("/api/gruposGes/:id/inactivar", (req, res) => {
  const id = req.params.id; // Obtener el ID del grupo desde los parámetros de la URL

  // Consulta SQL para inactivar el grupo
  const query = "UPDATE grupos_ges SET Activo = 0 WHERE IdGrupo = ?";

  // Ejecutar la consulta con el ID del grupo
  connection.query(query, [id], (error, results) => {
    if (error) {
      console.error("Error al inactivar el grupo:", error);
      return res.status(500).json({ error: "Error al inactivar el grupo" }); // Responder con error si algo falla
    }

    // Verificar si se afectó alguna fila (si no, significa que no se encontró el grupo)
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Grupo no encontrado" });
    }

    // Responder con éxito si se inactivó el grupo correctamente
    res.json({ message: "Grupo inactivado correctamente" });
  });
});

  app.post("/api/capacitaciones", (req, res) => {
    const { nombre_grupo, IdGrupo, fecha_inicio, fecha_fin, descripcion } = req.body;
  
    // Validar que los campos requeridos estén presentes
    if (!nombre_grupo || !IdGrupo || !fecha_inicio || !fecha_fin || !descripcion) {
      console.log("Error: faltan datos requeridos.");
      return res.status(400).json({
        error: "Faltan datos requeridos. Todos los campos deben estar completos.",
      });
    }
  
    const query = `
      INSERT INTO capacitaciones 
      (nombre_grupo, IdGrupo, fecha_inicio, fecha_fin, Descripcion)
      VALUES (?, ?, ?, ?, ?)
    `;
  
    connection.query(
      query,
      [nombre_grupo, IdGrupo, fecha_inicio, fecha_fin, descripcion],
      (error, results) => {
        if (error) {
          console.error("Error al crear la capacitación:", error);
          return res.status(500).json({
            error: "Error al crear la capacitación",
            details: error.message,
          });
        }
  
        res.status(201).json({
          message: "Capacitación creada correctamente",
          id: results.insertId,
        });
      }
    );
}); 

  app.put("/api/capacitaciones/:id", (req, res) => {
    const id = req.params.id;
    const { nombre_grupo, fecha_inicio, fecha_fin, grupos_ges, Descripcion } = req.body;

    // Crear array de sets dinámicos según los campos recibidos
    const fieldsToUpdate = [];
    const values = [];

    if (nombre_grupo) {
        fieldsToUpdate.push("nombre_grupo = ?");
        values.push(nombre_grupo);
    }
    if (fecha_inicio) {
        fieldsToUpdate.push("fecha_inicio = ?");
        values.push(fecha_inicio);
    }
    if (fecha_fin !== undefined) {  // Aceptamos NULL si se manda explícitamente
        fieldsToUpdate.push("fecha_fin = ?");
        values.push(fecha_fin);
    }
    if (grupos_ges) {
        fieldsToUpdate.push("grupos_ges = ?");
        values.push(grupos_ges);
    }
    if (Descripcion !== undefined) {  // Aceptamos NULL si se manda explícitamente
        fieldsToUpdate.push("Descripcion = ?");
        values.push(Descripcion);
    }

    // Si no se mandó ningún campo, respondemos con un error
    if (fieldsToUpdate.length === 0) {
        return res.status(400).json({
            error: "No se enviaron campos para actualizar"
        });
    }

    // Construir la consulta dinámica
    const query = `
        UPDATE capacitaciones 
        SET ${fieldsToUpdate.join(", ")}
        WHERE IdCapacitacion = ?
    `;
    values.push(id);  // Añadir el ID al final de los valores

    // Log para depuración
    console.log('Query:', query);
    console.log('Values:', values);

    // Ejecutar la consulta
    connection.query(query, values, (error, results) => {
        if (error) {
            console.error("Error al actualizar la capacitación:", error);
            return res.status(500).json({
                error: "Error al actualizar la capacitación",
                details: error.message
            });
        }

        res.json({
            message: "Capacitación actualizada correctamente",
            affectedRows: results.affectedRows
        });
    });
  });
  // Ruta para obtener los usuarios asociados a un grupo específico
app.get('/api/usuariosPorGrupo/:id', (req, res) => {
  const grupoId = req.params.id;

  if (!grupoId) {
      return res.status(400).json({ error: "El ID del grupo es requerido" });
  }

  const query = `
      SELECT u.IdUsuario, u.nombre_completo
      FROM usuario u
      INNER JOIN usuario_grupo ug ON u.IdUsuario = ug.IdUsuario
      WHERE ug.IdGrupo = ?
  `;

  connection.query(query, [grupoId], (error, results) => {
      if (error) {
          console.error("Error al obtener los usuarios del grupo:", error);
          return res.status(500).json({ error: "Error al obtener los usuarios del grupo" });
      }

      res.json(results); // Devuelve los usuarios encontrados
  });
});

// Ruta existente para obtener todos los empleados
app.get("/api/empleados", (req, res) => {
  const query = "SELECT * FROM usuario"; // Cambia 'usuario' por el nombre correcto de tu tabla
  connection.query(query, (error, results) => {
      if (error) {
          console.error("Error al obtener empleados:", error);
          return res.status(500).json({ error: "Error al obtener empleados" });
      }
      res.json(results); // Envía la lista de empleados como respuesta
  });
});


  // Ruta para obtener los asistentes por capacitación
  app.get('/api/asistentes', async (req, res) => {
    const { capacitacionId } = req.query;

    if (!capacitacionId) {
        return res.status(400).json({ error: 'El parámetro capacitacionId es requerido' });
    }

    try {
        const query = `
            SELECT u.IdUsuario, u.nombre_completo, a.asistencia
            FROM asistencia a
            JOIN usuario u ON a.IdUsuario = u.IdUsuario
            JOIN grupos_ges g ON a.IdGrupo = g.IdGrupo
            JOIN capacitaciones c ON g.IdGrupo = c.IdGrupo
            WHERE c.IdCapacitacion = ?;
        `;
        const [asistentes] = await connection.promise().query(query, [capacitacionId]);

        if (asistentes.length === 0) {
            return res.status(404).json({ message: 'No se encontraron asistentes para esta capacitación.' });
        }

        res.status(200).json(asistentes);
    } catch (error) {
        console.error('Error al obtener los asistentes:', error);
        res.status(500).json({ error: 'Error al obtener los asistentes', details: error.message });
    }
  });


  // Middleware de validación de asistencia
  const validateAsistenciaBody = (req, res, next) => {
    const { grupoId, usuarioId, asistio } = req.body;

    if (!grupoId || !usuarioId) {
      return res.status(400).json({
        error: 'BAD_REQUEST',
        message: 'El ID del grupo y el ID del usuario son requeridos',
      });
    }

    if (typeof asistio !== 'boolean') {
      return res.status(400).json({
        error: 'BAD_REQUEST',
        message: 'El estado de asistencia debe ser un valor booleano',
      });
    }

    next(); // Llamar al siguiente middleware
  };

  // Ruta para registrar la asistencia
  app.post('/api/asistencia', async (req, res) => {
    const { idGrupo, asistentes } = req.body;

    if (!idGrupo || !asistentes) {
        return res.status(400).send({ message: 'Datos insuficientes' });
    }

    try {
        // Simula la inserción o actualización en la base de datos
        console.log('Guardando asistencia en la base de datos:', { idGrupo, asistentes });

        // Lógica para guardar en la base de datos aquí

        res.status(200).send({ message: 'Asistencia guardada correctamente' });
    } catch (error) {
        console.error('Error al guardar en la base de datos:', error);
        res.status(500).send({ message: 'Error al guardar la asistencia', error });
    }
});

  app.get("/api/accidentes_incidentes", (req, res) => {
    const { userId } = req.query; // Obtiene el userId desde la query string
    if (!userId) {
        return res.status(400).json({ error: "Falta el parámetro userId" });
    }
    const query = "SELECT * FROM accidentes_incidentes WHERE IdUsuario = ?";
    connection.query(query, [userId], (error, results) => {
        if (error) {
            console.error("Error al obtener accidentes e incidentes:", error);
            return res.status(500).json({ error: "Error al obtener accidentes e incidentes" });
        }
        res.json(results);
    });
  });
  
  app.get("/api/area", (req, res) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({ error: "Falta el parámetro userId" });
    }
    const query = "SELECT * FROM area WHERE IdUsuario = ?";
    connection.query(query, [userId], (error, results) => {
        if (error) {
            console.error("Error al obtener áreas:", error);
            return res.status(500).json({ error: "Error al obtener áreas" });
        }
        res.json(results);
    });
  });
  
  app.get("/api/sector", (req, res) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({ error: "Falta el parámetro userId" });
    }
    const query = "SELECT * FROM sector WHERE IdUsuario = ?";
    connection.query(query, [userId], (error, results) => {
        if (error) {
            console.error("Error al obtener sectores:", error);
            return res.status(500).json({ error: "Error al obtener sectores" });
        }
        res.json(results);
    });
  });
  
  app.get("/api/adjunto", (req, res) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({ error: "Falta el parámetro userId" });
    }
    const query = "SELECT * FROM adjunto WHERE IdUsuario = ?";
    connection.query(query, [userId], (error, results) => {
        if (error) {
            console.error("Error al obtener adjuntos:", error);
            return res.status(500).json({ error: "Error al obtener adjuntos" });
        }
        res.json(results);
    });
  });
  
  app.get("/api/responsable", (req, res) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({ error: "Falta el parámetro userId" });
    }
    const query = "SELECT nombre_completo as responsable FROM usuario WHERE IdUsuario = ?";
    connection.query(query, [userId], (error, results) => {
        if (error) {
            console.error("Error al obtener el responsable:", error);
            return res.status(500).json({ error: "Error al obtener el responsable" });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        // Devolver solo el primer resultado como un objeto
        res.json(results[0]); 
    });
  });
  
  app.get("/api/all_accidentes_incidentes", (req, res) => {
    const query = "SELECT * FROM accidentes_incidentes";
    connection.query(query, (error, results) => {
      if (error) {
        console.error("Error al obtener accidentes e incidentes:", error);
        return res.status(500).json({ error: "Error al obtener accidentes e incidentes" });
      }
      res.json(results);
    });
  });
  
  app.get("/api/all_area", (req, res) => {
    const query = "SELECT * FROM area";
    connection.query(query, (error, results) => {
      if (error) {
        console.error("Error al obtener áreas:", error);
        return res.status(500).json({ error: "Error al obtener áreas" });
      }
      res.json(results);
    });
  });
  
  app.get("/api/all_sector", (req, res) => {
    const query = "SELECT * FROM sector";
    connection.query(query, (error, results) => {
      if (error) {
        console.error("Error al obtener sectores:", error);
        return res.status(500).json({ error: "Error al obtener sectores" });
      }
      res.json(results);
    });
  });
  
  app.get("/api/all_adjunto", (req, res) => {
    const query = "SELECT * FROM adjunto";
    connection.query(query, (error, results) => {
      if (error) {
        console.error("Error al obtener adjuntos:", error);
        return res.status(500).json({ error: "Error al obtener adjuntos" });
      }
      res.json(results);
    });
  });
  
  app.get("/api/all_responsable", (req, res) => {
    const query = "SELECT IdUsuario, nombre_completo as responsable FROM usuario";
    connection.query(query, (error, results) => {
      if (error) {
        console.error("Error al obtener responsables:", error);
        return res.status(500).json({ error: "Error al obtener responsables" });
      }
      res.json(results);
    });
  });
  
  app.put("/api/accidentes_incidentes/:id", (req, res) => {
    const { id } = req.params; // Obtén el ID del reporte desde los parámetros de la URL
    const {
      responsable,
      fecha_hora,
      area,
      ubicacion,
      descripcion,
      sector,
    } = req.body; // Obtén los datos enviados desde el frontend
  
    // Validar que todos los campos necesarios estén presentes
    if (!responsable || !fecha_hora || !area || !ubicacion || !descripcion || !sector) {
      return res.status(400).json({
        error: "Faltan campos obligatorios para actualizar el reporte",
      });
    }
  
    // Consulta para actualizar el reporte
    const query = `
      UPDATE accidentes_incidentes
      SET
        responsable = ?,
        fecha_hora = ?,
        area = ?,
        ubicacion = ?,
        descripcion = ?,
        sector = ?
      WHERE IdReporte = ?
    `;
  
    const values = [responsable, fecha_hora, area, ubicacion, descripcion, sector, id];
  
    // Ejecutar la consulta
    connection.query(query, values, (error, results) => {
      if (error) {
        console.error("Error al actualizar el reporte:", error);
        return res.status(500).json({
          error: "Error al actualizar el reporte",
        });
      }
  
      // Verificar si se actualizó alguna fila
      if (results.affectedRows === 0) {
        return res.status(404).json({
          error: "No se encontró el reporte con el ID especificado",
        });
      }
  
      res.json({
        message: "Reporte actualizado correctamente",
      });
    });
  });
  
