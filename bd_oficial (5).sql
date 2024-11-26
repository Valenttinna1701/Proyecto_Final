-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 26-11-2024 a las 21:21:33
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bd_oficial`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `spActivar_Capacitacion` (IN `p_IdCapacitacion` INT)   BEGIN
   
    UPDATE capacitaciones
    SET Activo = 1
    WHERE IdCapacitacion = p_IdCapacitacion;

    SELECT 'Capacitación activada correctamente' AS mensaje;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spActivar_Grupo_GES` (IN `p_IdGrupo` INT)   BEGIN
  
    UPDATE grupos_ges
    SET Activo = 1
    WHERE IdGrupo = p_IdGrupo;


    SELECT 'Grupo GES activado correctamente' AS mensaje;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spActivar_Reporte` (IN `p_IdReporte` INT)   BEGIN
   
    UPDATE accidentes_incidentes
    SET Activo = 1
    WHERE IdReporte = p_IdReporte;

    SELECT 'Reporte activado correctamente' AS mensaje;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spActivar_Usuario` (IN `p_IdUsuario` INT)   BEGIN
    -- Actualizar el estado del usuario a activo (1)
    UPDATE Usuario
    SET Activo = 1
    WHERE IdUsuario = p_IdUsuario;

    -- Mensaje de confirmación
    SELECT 'Usuario activado correctamente' AS mensaje;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spActualizar_accidente_incidente` (IN `p_idReporte` INT(11), IN `p_fecha_hora` DATETIME, IN `p_descripcion` TEXT, IN `p_idUsuario` INT(11))   BEGIN
    UPDATE accidentes_incidentes
    SET 
        fecha_hora = p_fecha_hora,
        descripcion = p_descripcion,
        idUsuario = p_idUsuario
    WHERE 
        idReporte = p_idReporte;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spActualizar_adjunto` (IN `p_id` INT(11), IN `p_url` VARCHAR(255), IN `p_idReporte` INT(11))   BEGIN
    UPDATE adjunto
    SET url = p_url,
        idReporte = p_idReporte
    WHERE id = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spActualizar_area` (IN `p_idArea` INT(11), IN `p_nombre_area` VARCHAR(255), IN `p_idReporte` INT(11))   BEGIN UPDATE area
SET nombre_area = p_nombre_area, idReporte = p_idReporte
WHERE idArea = p_idArea;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spActualizar_capacitacion` (IN `p_IdCapacitacion` INT(11), IN `p_fecha_inicio` DATETIME, IN `p_fecha_fin` DATETIME, IN `p_nombre_capacitacion` VARCHAR(255), IN `p_IdUsuario` INT(11), IN `p_IdGrupo` INT(11))   BEGIN
    UPDATE capacitaciones
    SET 
        fecha_inicio = p_fecha_inicio,
        fecha_fin = p_fecha_fin,
        nombre_capacitacion = p_nombre_capacitacion,
        idUsuario = p_IdUsuario,
        idGrupo = p_IdGrupo
    WHERE IdCapacitacion = p_IdCapacitacion;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spActualizar_clase` (IN `p_idClase` INT(11), IN `p_tipo_clase` VARCHAR(70), IN `p_id` INT(11))   BEGIN
    UPDATE clase
    SET tipo_clase = p_tipo_clase,
        id = p_id
    WHERE id_clase = p_idClase;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spActualizar_gruposGes` (IN `p_idGrupo` INT, IN `p_integrantes` TEXT, IN `p_nombre_grupo` VARCHAR(255), IN `p_id_horario` INT, IN `p_idCapacitacion` INT)   BEGIN
    UPDATE grupos_ges
    SET
        integrantes = p_integrantes,
        nombre_grupo = p_nombre_grupo,
        id_horario = p_id_horario,
        idCapacitacion = p_idCapacitacion
    WHERE idGrupo = p_idGrupo;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spActualizar_horario` (IN `p_id_horario` INT(11), IN `p_nombre_capacitaciones` VARCHAR(250), IN `p_fecha_inicio` DATE, IN `p_fecha_fin` DATE, IN `p_idUsuario` INT(11), IN `p_idCapacitacion` INT(11), IN `p_idGrupo` INT(11))   BEGIN
    UPDATE horario
    SET
        nombre_capacitaciones = p_nombre_capacitaciones,
        fecha_inicio = p_fecha_inicio,
        fecha_fin = p_fecha_fin,
        IdUsuario = p_idUsuario,
        IdCapacitacion = p_idCapacitacion,
        IdGrupo = p_idGrupo
    WHERE id_horario = p_id_horario;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spActualizar_sector` (IN `p_id_sector` INT(11), IN `p_nombre` VARCHAR(50), IN `p_id_area` INT(11))   BEGIN UPDATE sector
SET nombre = p_nombre,id_area = p_id_area
WHERE id_sector = p_id_sector;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spActualizar_usuario` (IN `p_IdUsuario` INT(11), IN `p_nombre_completo` VARCHAR(255), IN `p_numero_identificacion` VARCHAR(50), IN `p_correo_electronico` VARCHAR(255), IN `p_telefono` VARCHAR(50), IN `p_num_emergencia` INT(11), IN `p_EPS` VARCHAR(15), IN `p_RH` VARCHAR(10), IN `p_direccion` VARCHAR(255), IN `p_contrasena` VARCHAR(255), IN `p_rol_usuario` CHAR(1), IN `p_IdReporte` INT(11), IN `p_Id_horario` INT(11), IN `p_IdCapacitacion` INT(11))   BEGIN
    UPDATE usuario
    SET
        nombre_completo = p_nombre_completo,
        numero_identificacion = p_numero_identificacion,
        correo_electronico = p_correo_electronico,
        telefono = p_telefono,
        num_emergencia = p_num_emergencia,
        EPS = p_EPS,
        RH = p_RH,
        direccion = p_direccion,
        contrasena = p_contrasena,
        rol_usuario = p_rol_usuario,
        IdReporte = p_IdReporte,
        Id_horario = p_Id_horario,
        IdCapacitacion = p_IdCapacitacion
    WHERE IdUsuario = p_IdUsuario;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spAgregar_accidenteEincidente` (IN `p_fechaHora` DATETIME, IN `p_descripcion` TEXT, IN `p_IdUsuario` INT)   BEGIN 
    INSERT INTO accidentes_incidentes (fecha_hora, descripcion, IdUsuario)
    VALUES (p_fechaHora, p_descripcion, p_IdUsuario);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spAgregar_adjunto` (`evidencia_url` VARCHAR(255))   BEGIN INSERT INTO adjunto (url)
VALUES (evidencia_url);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spAgregar_area` (`area_nombre` VARCHAR(255))   BEGIN INSERT INTO area (nombre_area)
VALUES (area_nombre);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spAgregar_Capacitacion` (IN `p_nombre_grupo` TEXT, IN `p_grupos_ges` VARCHAR(100), IN `p_fecha_inicio` DATETIME, IN `p_fecha_fin` DATETIME, IN `p_descripcion` TEXT)   BEGIN
    INSERT INTO Capacitaciones (nombre_grupo, grupos_ges, fecha_inicio, fecha_fin, Descripcion)
    VALUES (p_nombre_grupo, p_grupos_ges, p_fecha_inicio, p_fecha_fin, p_descripcion);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spAgregar_clase` (`clase_tipo` VARCHAR(50))   BEGIN INSERT INTO clase (tipo_clase)
VALUES (clase_tipo);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spAgregar_GES` (IN `p_integrantes` TEXT(600), IN `p_nombre_grupo` VARCHAR(255))   BEGIN 
    INSERT INTO grupos_ges (integrantes, nombre_grupo)
    VALUES (p_integrantes, p_nombre_grupo);
   END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spAgregar_horario` (IN `p_nombre_capacitaciones` VARCHAR(250), IN `p_fecha_fin` DATE, IN `p_fecha_inicio` DATE)   BEGIN 
    INSERT INTO horario (nombre_capacitaciones, fecha_inicio, fecha_fin)
    VALUES (p_nombre_capacitaciones, p_fecha_inicio, p_fecha_fin);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spAgregar_sector` (`sector_nombre` VARCHAR(50))   BEGIN INSERT INTO sector (nombre)
VALUES (sector_nombre);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spAgregar_usuario` (IN `nombre_completo` VARCHAR(255), IN `numero_identificacion` VARCHAR(50), IN `correo_electronico` VARCHAR(255), IN `telefono` VARCHAR(50), IN `num_emergencia` VARCHAR(50), IN `EPS` VARCHAR(15), IN `RH` VARCHAR(10), IN `direccion` VARCHAR(255), IN `contrasena` VARCHAR(255), IN `rol_usuario` CHAR(1))   BEGIN
    INSERT INTO usuario 
    (
        nombre_completo, 
        numero_identificacion, 
        correo_electronico, 
        telefono, 
        num_emergencia, 
        EPS, 
        RH, 
        direccion, 
        contrasena, 
        rol_usuario
    )
    VALUES 
    (
        nombre_completo, 
        numero_identificacion, 
        correo_electronico, 
        telefono, 
        num_emergencia, 
        EPS, 
        RH, 
        direccion, 
        contrasena, 
        rol_usuario
    );
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spAgregar_usuario_encriptado` (IN `nombre_completo` VARCHAR(255), IN `numero_identificacion` VARCHAR(50), IN `correo_electronico` VARCHAR(255), IN `telefono` VARCHAR(50), IN `num_emergencia` VARCHAR(50), IN `EPS` VARCHAR(50), IN `RH` VARCHAR(5), IN `direccion` VARCHAR(255), IN `contrasena` VARCHAR(255), IN `rol_usuario` CHAR(1))   BEGIN
    -- Encriptar la contraseña con SHA2
    INSERT INTO usuario (
        nombre_completo, numero_identificacion, correo_electronico,
        telefono, num_emergencia, EPS, RH, direccion, contrasena, rol_usuario
    ) VALUES (
        nombre_completo, numero_identificacion, correo_electronico,
        telefono, num_emergencia, EPS, RH, direccion,
        SHA2(contrasena, 256), -- Contraseña encriptada
        rol_usuario
    );
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spConsultar_accidentes_incidentes` (IN `p_idReporte` INT(11), IN `p_fecha_hora` DATETIME, IN `p_idUsuario` INT(11))   BEGIN
    SELECT idReporte, fecha_hora, descripcion, idUsuario
    FROM accidentes_incidentes
    WHERE (p_idReporte IS NULL OR idReporte = p_idReporte)
      AND (p_fecha_hora IS NULL OR fecha_hora = p_fecha_hora)
      AND (p_idUsuario IS NULL OR idUsuario = p_idUsuario);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spConsultar_adjunto` (IN `adjunto_url` VARCHAR(255))   BEGIN
    SELECT id, url, idReporte
    FROM adjunto
    WHERE url = adjunto_url;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spConsultar_area` (IN `area_nombre` VARCHAR(255))   BEGIN
    SELECT id_area, nombre_area, id_reporte
    FROM area
    WHERE nombre_area = area_nombre;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spConsultar_capacitaciones` (IN `p_idUsuario` INT, IN `p_idGrupo` INT, IN `p_fecha_inicio` DATETIME, IN `p_fecha_fin` DATETIME)   BEGIN
    SELECT idCapacitacion, fecha_inicio, fecha_fin, nombre_capacitacion, idUsuario, idGrupo
    FROM capacitaciones
    WHERE (idUsuario = p_idUsuario OR p_idUsuario IS NULL)
      AND (idGrupo = p_idGrupo OR p_idGrupo IS NULL)
      AND (fecha_inicio >= p_fecha_inicio OR p_fecha_inicio IS NULL)
      AND (fecha_fin <= p_fecha_fin OR p_fecha_fin IS NULL);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spConsultar_clase` (IN `clase_id` INT)   BEGIN
    SELECT id_clase, tipo_clase
    FROM clase
    WHERE id = clase_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spConsultar_grupo` (IN `grupo_id` INT)   BEGIN
    SELECT idGrupo, integrantes, nombre_grupo, id_horario, idCapacitacion
    FROM grupos_ges
    WHERE idGrupo = grupo_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spConsultar_horario` (IN `nombre_cap` VARCHAR(250))   BEGIN
    SELECT 
        id_horario, 
        nombre_capacitaciones, 
        fecha_inicio, 
        fecha_fin, 
        idGrupo, 
        idUsuario, 
        idCapacitacion
    FROM 
        horario
    WHERE 
        nombre_capacitaciones = nombre_cap;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spConsultar_sector` (IN `sector_nombre` VARCHAR(50))   BEGIN
    SELECT id_sector, nombre, id_area
    FROM sector
    WHERE nombre = sector_nombre;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spConsultar_usuario` (IN `p_idUsuario` INT, IN `p_nombre_completo` VARCHAR(255), IN `p_numero_identificacion` VARCHAR(50), IN `p_correo_electronico` VARCHAR(255), IN `p_telefono` VARCHAR(50), IN `p_num_emergencia` INT, IN `p_EPS` VARCHAR(15), IN `p_RH` VARCHAR(10), IN `p_direccion` VARCHAR(255), IN `p_rol_usuario` CHAR(1))   BEGIN
    SELECT 
        idUsuario, nombre_completo, numero_identificacion, correo_electronico, 
        telefono, num_emergencia, EPS, RH, direccion, contrasena, rol_usuario,
        idReporte, id_horario, idCapacitacion
    FROM 
        usuario
    WHERE 
        (p_idUsuario IS NULL OR idUsuario = p_idUsuario) AND
        (p_nombre_completo IS NULL OR nombre_completo LIKE CONCAT('%', p_nombre_completo, '%')) AND
        (p_numero_identificacion IS NULL OR numero_identificacion = p_numero_identificacion) AND
        (p_correo_electronico IS NULL OR correo_electronico = p_correo_electronico) AND
        (p_telefono IS NULL OR telefono = p_telefono) AND
        (p_num_emergencia IS NULL OR num_emergencia = p_num_emergencia) AND
        (p_EPS IS NULL OR EPS = p_EPS) AND
        (p_RH IS NULL OR RH = p_RH) AND
        (p_direccion IS NULL OR direccion LIKE CONCAT('%', p_direccion, '%')) AND
        (p_rol_usuario IS NULL OR rol_usuario = p_rol_usuario);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spInactivar_Capacitacion` (IN `p_IdCapacitacion` INT)   BEGIN
    -- Update the status of the capacitacion to inactive (0)
    UPDATE capacitaciones
    SET Activo = 0
    WHERE IdCapacitacion = p_IdCapacitacion;

 
    SELECT 'Capacitación inactivada correctamente' AS mensaje;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spInactivar_Grupo_GES` (IN `p_IdGrupo` INT)   BEGIN
    
    UPDATE grupos_ges
    SET Activo = 0
    WHERE IdGrupo = p_IdGrupo;

 
    SELECT 'Grupo GES inactivado correctamente' AS mensaje;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spInactivar_Reporte` (IN `p_IdReporte` INT)   BEGIN
    -- Update the status of the capacitacion to inactive (0)
    UPDATE accidentes_incidentes
    SET Activo = 0
    WHERE IdReporte = p_IdReporte;

 
    SELECT 'Reporte inactivado correctamente' AS mensaje;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spInactivar_Usuario` (IN `p_IdUsuario` INT)   BEGIN
    -- Actualizar el estado del usuario a inactivo (0)
    UPDATE Usuario
    SET Activo = 0
    WHERE IdUsuario = p_IdUsuario;

    -- Mensaje de confirmación
    SELECT 'Usuario inactivado correctamente' AS mensaje;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `accidentes_incidentes`
--

CREATE TABLE `accidentes_incidentes` (
  `IdReporte` int(11) NOT NULL,
  `fecha_hora` datetime DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `IdUsuario` int(11) NOT NULL,
  `Activo` int(1) DEFAULT 0,
  `IdSector` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `accidentes_incidentes`
--

INSERT INTO `accidentes_incidentes` (`IdReporte`, `fecha_hora`, `descripcion`, `IdUsuario`, `Activo`, `IdSector`) VALUES
(8, '2024-11-22 12:00:00', 'caida de segundo piso', 3, 0, NULL),
(12, '2024-11-13 12:00:00', 'tengo chichi', 3, 0, NULL),
(13, '2024-11-13 17:00:00', 'corte con maquina industrial', 3, 0, NULL),
(14, '2024-11-16 10:00:00', 'caída y esguince antes de la hora de salida ', 6, 0, NULL),
(15, '2024-11-23 12:00:00', 'desmayo y golpe en pierna derecha', 3, 0, NULL),
(16, '2024-11-06 12:00:00', 'hola', 6, 0, NULL),
(17, '2024-11-14 12:00:00', 'Me caí entrando al baño por que había una baldosa suelta  ', 4, 0, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `adjunto`
--

CREATE TABLE `adjunto` (
  `id` int(11) NOT NULL,
  `url` varchar(255) NOT NULL,
  `IdReporte` int(11) DEFAULT NULL,
  `IdUsuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `adjunto`
--

INSERT INTO `adjunto` (`id`, `url`, `IdReporte`, `IdUsuario`) VALUES
(5, 'C:\\Users\\Santy\\Desktop\\FondoMovil.png', 8, NULL),
(6, 'C:\\Users\\Santy\\Desktop\\FondoMovil.png', 12, 3),
(7, 'C:\\Users\\Santy\\Desktop\\FondoMovil.png', 13, NULL),
(8, 'C:\\Users\\Santy\\Desktop\\FondoMovil.png', 14, NULL),
(9, 'C:\\Users\\Santy\\Desktop\\FondoMovil.png', 15, NULL),
(10, 'C:\\Users\\Santy\\Desktop\\FondoMovil.png', 16, NULL),
(11, 'https://www.apachefriends.org/es/download.html', 0, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `area`
--

CREATE TABLE `area` (
  `IdArea` int(11) NOT NULL,
  `nombre_area` varchar(255) NOT NULL,
  `IdReporte` int(11) DEFAULT NULL,
  `IdUsuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `area`
--

INSERT INTO `area` (`IdArea`, `nombre_area`, `IdReporte`, `IdUsuario`) VALUES
(7, 'confeccion', 12, 3),
(8, 'confeccion', 13, NULL),
(9, 'corte', 14, NULL),
(10, 'oficina', 15, NULL),
(11, 'confeccion', 16, NULL),
(12, 'sellado', 0, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asistencia`
--

CREATE TABLE `asistencia` (
  `id_Asistencia` int(11) NOT NULL,
  `IdGrupo` int(11) DEFAULT NULL,
  `asistencia` tinyint(1) NOT NULL,
  `IdUsuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `asistencia`
--

INSERT INTO `asistencia` (`id_Asistencia`, `IdGrupo`, `asistencia`, `IdUsuario`) VALUES
(1, 1, 0, 6),
(2, 1, 0, 7),
(3, 1, 0, 11),
(4, 2, 0, 3),
(5, 2, 0, 4),
(6, 3, 0, 7),
(7, 3, 0, 11);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `capacitaciones`
--

CREATE TABLE `capacitaciones` (
  `IdCapacitacion` int(11) NOT NULL,
  `nombre_grupo` text NOT NULL,
  `fecha_inicio` datetime NOT NULL,
  `fecha_fin` datetime NOT NULL,
  `Descripcion` text NOT NULL,
  `IdGrupo` int(11) DEFAULT NULL,
  `Activo` int(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `capacitaciones`
--

INSERT INTO `capacitaciones` (`IdCapacitacion`, `nombre_grupo`, `fecha_inicio`, `fecha_fin`, `Descripcion`, `IdGrupo`, `Activo`) VALUES
(4, 'confeccion textil', '2024-11-19 00:00:00', '2024-11-21 00:00:00', 'se realizara la capacitación de patronaje y correcta costura a los trajes industriales para cuartos fríos', 1, 0),
(5, 'manejo quimico', '2024-11-28 00:00:00', '2024-11-30 00:00:00', 'se dara la capacitacion para el manejo y desecho de qumicos y elementos toxicos', 2, 0),
(6, 'maquinaria pesada', '2024-11-22 00:00:00', '2024-11-25 00:00:00', 'se capacitara para el manejo de maquinaria pesada', 3, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clase`
--

CREATE TABLE `clase` (
  `IdClase` int(11) NOT NULL,
  `tipo_clase` varchar(70) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clase`
--

INSERT INTO `clase` (`IdClase`, `tipo_clase`) VALUES
(1, 'Nuevo Tipo de Clase'),
(2, 'Nuevo Tipo de Clase');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grupos_ges`
--

CREATE TABLE `grupos_ges` (
  `IdGrupo` int(11) NOT NULL,
  `nombre_grupo` varchar(255) DEFAULT NULL,
  `Activo` int(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `grupos_ges`
--

INSERT INTO `grupos_ges` (`IdGrupo`, `nombre_grupo`, `Activo`) VALUES
(1, 'textil', 0),
(2, 'quimico', 0),
(3, 'productos qumicos', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horario`
--

CREATE TABLE `horario` (
  `id_horario` int(11) NOT NULL,
  `nombre_capacitaciones` varchar(250) NOT NULL,
  `fecha_fin` date NOT NULL,
  `fecha_inicio` date NOT NULL,
  `IdGrupo` int(11) DEFAULT NULL,
  `IdUsuario` int(11) DEFAULT NULL,
  `IdCapacitacion` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `horario`
--

INSERT INTO `horario` (`id_horario`, `nombre_capacitaciones`, `fecha_fin`, `fecha_inicio`, `IdGrupo`, `IdUsuario`, `IdCapacitacion`) VALUES
(1, 'Nuevo Horario', '2024-10-11', '2024-10-10', NULL, NULL, NULL),
(2, 'Nuevo Horario', '2024-10-11', '2024-10-10', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sector`
--

CREATE TABLE `sector` (
  `id_sector` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `IdReporte` int(11) DEFAULT NULL,
  `IdUsuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `sector`
--

INSERT INTO `sector` (`id_sector`, `nombre`, `IdReporte`, `IdUsuario`) VALUES
(6, 'balcon', 8, NULL),
(7, 'cocina', 12, 3),
(8, 'pasillo', 13, NULL),
(9, 'escaleras', 14, NULL),
(10, 'banos', 15, NULL),
(11, 'balcon', 16, NULL),
(12, '11', 0, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `IdUsuario` int(11) NOT NULL,
  `nombre_completo` varchar(255) NOT NULL,
  `numero_identificacion` varchar(50) NOT NULL,
  `correo_electronico` varchar(255) NOT NULL,
  `telefono` varchar(50) NOT NULL,
  `num_emergencia` int(11) NOT NULL,
  `EPS` varchar(15) NOT NULL,
  `RH` varchar(10) NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `contrasena` varchar(255) DEFAULT NULL,
  `rol_usuario` char(1) DEFAULT NULL CHECK (`rol_usuario` between '0' and '9'),
  `Activo` bit(1) DEFAULT b'1',
  `IdGrupo` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`IdUsuario`, `nombre_completo`, `numero_identificacion`, `correo_electronico`, `telefono`, `num_emergencia`, `EPS`, `RH`, `direccion`, `contrasena`, `rol_usuario`, `Activo`, `IdGrupo`) VALUES
(3, 'ana mesias', '1013596595', 'anamesias32@gmail.com', '3202236535', 2147483647, 'capital salud', '0+', 'carrera8a#8 06 sur', '123', '2', b'1', NULL),
(6, 'santiago rodriguez', '1030541315', 'santiago025@gmail.com', '3002062358', 2147483647, 'SURA', 'A+', 'calle74Bsur#18-33', '123', '2', b'1', NULL),
(7, 'juan perez', '101403256', 'juan,perez@gmail.com', '3202567098', 2147483647, 'EPS Nueva', 'AB+', 'calle76#bsur', '333', '1', b'1', NULL),
(13, 'Ana Sofia Mendoza Cortes ', '1014479569', 'danysantana258@gmail.com', '3195167343', 2147483647, 'Nueva EPS', 'O+', 'calle 2 sur #11c 25', '$2b$10$IvghlkdJNiA0nczdhtyx/..QrLY/VrGIJ5lsvvJGlF13OLKwxSbQW', '1', b'1', NULL),
(14, 'Valentina Andrade Paez', '1028662757', 'paezvalentina330@gmail.com', '3002495873', 2147483647, 'Capital Salud', 'O+', 'calle 2 sur #11 28', '$2b$10$xJIo8kODKU05SmVTaLLsQOI0iGkyidb89mFh1Oy5gv0snJS.AEssW', '1', b'1', NULL);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `usuarioxcapacitacion`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `usuarioxcapacitacion` (
`IdUsuario` int(11)
,`nombre_completo` varchar(255)
,`correo_electronico` varchar(255)
,`IdGrupo` int(11)
,`nombre_grupo` varchar(255)
,`grupoActivo` int(1)
,`IdCapacitacion` int(11)
,`nombre_capacitacion` text
,`fecha_inicio` datetime
,`fecha_fin` datetime
,`descripcion` text
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_grupo`
--

CREATE TABLE `usuario_grupo` (
  `IdUsuario` int(11) NOT NULL,
  `IdGrupo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario_grupo`
--

INSERT INTO `usuario_grupo` (`IdUsuario`, `IdGrupo`) VALUES
(3, 2),
(4, 2),
(6, 1),
(7, 1),
(7, 3),
(11, 1),
(11, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vista_areas`
--

CREATE TABLE `vista_areas` (
  `nombre_area` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vista_rh`
--

CREATE TABLE `vista_rh` (
  `nombre_completo` varchar(255) DEFAULT NULL,
  `EPS` varchar(15) DEFAULT NULL,
  `RH` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vista_usuario`
--

CREATE TABLE `vista_usuario` (
  `IdUsuario` int(11) DEFAULT NULL,
  `nombre_completo` varchar(255) DEFAULT NULL,
  `numero_identificacion` varchar(50) DEFAULT NULL,
  `telefono` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vista_usuarios`
--

CREATE TABLE `vista_usuarios` (
  `IdUsuario` int(11) DEFAULT NULL,
  `nombre_completo` varchar(255) DEFAULT NULL,
  `numero_identificacion` varchar(50) DEFAULT NULL,
  `telefono` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura para la vista `usuarioxcapacitacion`
--
DROP TABLE IF EXISTS `usuarioxcapacitacion`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `usuarioxcapacitacion`  AS SELECT `ug`.`IdUsuario` AS `IdUsuario`, `u`.`nombre_completo` AS `nombre_completo`, `u`.`correo_electronico` AS `correo_electronico`, `gg`.`IdGrupo` AS `IdGrupo`, `gg`.`nombre_grupo` AS `nombre_grupo`, `gg`.`Activo` AS `grupoActivo`, `c`.`IdCapacitacion` AS `IdCapacitacion`, `c`.`nombre_grupo` AS `nombre_capacitacion`, `c`.`fecha_inicio` AS `fecha_inicio`, `c`.`fecha_fin` AS `fecha_fin`, `c`.`Descripcion` AS `descripcion` FROM (((`usuario_grupo` `ug` join `usuario` `u`) join `grupos_ges` `gg`) join `capacitaciones` `c`) WHERE `ug`.`IdUsuario` = `u`.`IdUsuario` AND `ug`.`IdGrupo` = `gg`.`IdGrupo` AND `ug`.`IdGrupo` = `c`.`IdGrupo` ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `accidentes_incidentes`
--
ALTER TABLE `accidentes_incidentes`
  ADD PRIMARY KEY (`IdReporte`);

--
-- Indices de la tabla `adjunto`
--
ALTER TABLE `adjunto`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `area`
--
ALTER TABLE `area`
  ADD PRIMARY KEY (`IdArea`);

--
-- Indices de la tabla `asistencia`
--
ALTER TABLE `asistencia`
  ADD PRIMARY KEY (`id_Asistencia`);

--
-- Indices de la tabla `capacitaciones`
--
ALTER TABLE `capacitaciones`
  ADD PRIMARY KEY (`IdCapacitacion`);

--
-- Indices de la tabla `clase`
--
ALTER TABLE `clase`
  ADD PRIMARY KEY (`IdClase`);

--
-- Indices de la tabla `grupos_ges`
--
ALTER TABLE `grupos_ges`
  ADD PRIMARY KEY (`IdGrupo`);

--
-- Indices de la tabla `horario`
--
ALTER TABLE `horario`
  ADD PRIMARY KEY (`id_horario`);

--
-- Indices de la tabla `sector`
--
ALTER TABLE `sector`
  ADD PRIMARY KEY (`id_sector`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`IdUsuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `accidentes_incidentes`
--
ALTER TABLE `accidentes_incidentes`
  MODIFY `IdReporte` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `adjunto`
--
ALTER TABLE `adjunto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `area`
--
ALTER TABLE `area`
  MODIFY `IdArea` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `asistencia`
--
ALTER TABLE `asistencia`
  MODIFY `id_Asistencia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `capacitaciones`
--
ALTER TABLE `capacitaciones`
  MODIFY `IdCapacitacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `clase`
--
ALTER TABLE `clase`
  MODIFY `IdClase` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `grupos_ges`
--
ALTER TABLE `grupos_ges`
  MODIFY `IdGrupo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `horario`
--
ALTER TABLE `horario`
  MODIFY `id_horario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `sector`
--
ALTER TABLE `sector`
  MODIFY `id_sector` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `IdUsuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
