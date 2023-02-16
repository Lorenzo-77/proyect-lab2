-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 16-02-2023 a las 04:04:56
-- Versión del servidor: 10.4.24-MariaDB
-- Versión de PHP: 7.4.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `to-do`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `PR_TABLA` (IN `P_HORARIO` INT, IN `P_MATERIA` INT)   BEGIN
SET @sql = NULL;
SELECT
  GROUP_CONCAT(DISTINCT
    CONCAT(
      'max(case when fecha = ''', fecha, ''' then presente end) ', DATE_FORMAT(fecha, '%d_%m_%Y')
    )
  ) INTO @sql
FROM
  asistencias, inscripciones WHERE fecha IN (SELECT FECHA FROM asistencias WHERE horaId = P_HORARIO AND materiaId = P_MATERIA AND alumnoId = alumnoId);
SET @sql = CONCAT('SELECT email, nombre, apellido, ', @sql, ' 
                  FROM asistencias, alumnos, materias 
			      WHERE idAlum = alumnoId AND materiaId = idMateria AND materiaId = ', P_MATERIA, ' 
                   GROUP BY email');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;	
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alumnos`
--

CREATE TABLE `alumnos` (
  `idAlum` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(150) NOT NULL,
  `rol` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `alumnos`
--

INSERT INTO `alumnos` (`idAlum`, `nombre`, `apellido`, `email`, `password`, `rol`) VALUES
(1, 'David', 'Valdez', 'ivan@ulp.com', '$2a$10$Ep6h78mhSxp.In/lMmyvOeApQtf1XhlJPNnaPggLMwRNzv0zPLrwm', 'alumno');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asistencias`
--

CREATE TABLE `asistencias` (
  `idAsistencia` int(20) NOT NULL,
  `alumnoId` int(20) NOT NULL,
  `horaId` int(20) NOT NULL,
  `materiaId` int(20) DEFAULT NULL,
  `presente` varchar(15) NOT NULL,
  `fecha` date NOT NULL DEFAULT current_timestamp(),
  `hora` time NOT NULL DEFAULT current_timestamp(),
  `dictado` varchar(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `asistencias`
--

INSERT INTO `asistencias` (`idAsistencia`, `alumnoId`, `horaId`, `materiaId`, `presente`, `fecha`, `hora`, `dictado`) VALUES
(1, 1, 7, 27, 'Si', '2023-02-14', '22:10:39', NULL),
(2, 1, 4, NULL, 'No', '2023-02-16', '00:00:00', 'Si');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `coordinadores`
--

CREATE TABLE `coordinadores` (
  `idCoor` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(150) NOT NULL,
  `rol` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `coordinadores`
--

INSERT INTO `coordinadores` (`idCoor`, `nombre`, `apellido`, `email`, `password`, `rol`) VALUES
(1, 'Lorenzo', 'Muñoz', 'Coordinador@gmail.com', '$2a$10$.gMCJmah.Ft0UYP/GgxFG./Km3kAdxJp3syO4I3yuKnno8zgJUIra', 'coordinador');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horarios`
--

CREATE TABLE `horarios` (
  `idHorarios` int(20) NOT NULL,
  `materiasID` int(20) NOT NULL,
  `horaInicioLunes` time DEFAULT NULL,
  `horaFinLunes` time DEFAULT NULL,
  `lunes` varchar(20) DEFAULT NULL,
  `horaInicioMartes` time DEFAULT NULL,
  `horaFinMartes` time DEFAULT NULL,
  `martes` varchar(20) DEFAULT NULL,
  `horaInicioMiercoles` time DEFAULT NULL,
  `horaFinMiercoles` time DEFAULT NULL,
  `miercoles` varchar(20) DEFAULT NULL,
  `horaInicioJueves` time DEFAULT NULL,
  `horaFinJueves` time DEFAULT NULL,
  `jueves` varchar(20) DEFAULT NULL,
  `horaInicioViernes` time DEFAULT NULL,
  `horaFinViernes` time DEFAULT NULL,
  `viernes` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `horarios`
--

INSERT INTO `horarios` (`idHorarios`, `materiasID`, `horaInicioLunes`, `horaFinLunes`, `lunes`, `horaInicioMartes`, `horaFinMartes`, `martes`, `horaInicioMiercoles`, `horaFinMiercoles`, `miercoles`, `horaInicioJueves`, `horaFinJueves`, `jueves`, `horaInicioViernes`, `horaFinViernes`, `viernes`) VALUES
(3, 24, '11:00:00', '14:00:00', 'Lunes', NULL, NULL, NULL, '12:01:00', '16:01:00', 'Miercoles', NULL, NULL, NULL, '14:01:00', '18:00:00', 'Viernes'),
(4, 25, '12:00:00', '15:00:00', 'Lunes', '10:00:00', '13:00:00', 'Martes', NULL, NULL, NULL, '16:00:00', '20:00:00', 'Jueves', NULL, NULL, NULL),
(7, 27, NULL, NULL, NULL, '21:46:00', '22:46:00', 'Martes', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inscripciones`
--

CREATE TABLE `inscripciones` (
  `idInscripcion` int(20) NOT NULL,
  `alumnoId` int(20) NOT NULL,
  `profesorId` int(20) NOT NULL,
  `materiaId` int(20) NOT NULL,
  `valAlumno` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `inscripciones`
--

INSERT INTO `inscripciones` (`idInscripcion`, `alumnoId`, `profesorId`, `materiaId`, `valAlumno`) VALUES
(5, 1, 1, 24, 'Valido'),
(6, 1, 1, 25, 'Valido'),
(7, 1, 1, 26, 'Valido'),
(8, 1, 1, 27, 'Valido');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `materias`
--

CREATE TABLE `materias` (
  `idMateria` int(11) NOT NULL,
  `nombreMateria` varchar(50) NOT NULL,
  `profeCargo` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `materias`
--

INSERT INTO `materias` (`idMateria`, `nombreMateria`, `profeCargo`) VALUES
(24, 'Base de datos', 1),
(25, 'Android', 1),
(26, 'Ingles', 1),
(27, 'Ingenieria', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profesores`
--

CREATE TABLE `profesores` (
  `idProfe` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(150) NOT NULL,
  `rol` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `profesores`
--

INSERT INTO `profesores` (`idProfe`, `nombre`, `apellido`, `email`, `password`, `rol`) VALUES
(1, 'Pedro', 'Blanco', 'pe@ulp.com', '$2a$10$q2l7bME3TWvabuudrVX0rOo9ljSmfmGv.2Aaxg4YFEKQq2hVQfIPe', 'profesor');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('Dt8O9hJjLUrwbdre7Ya05WbaGfUHskXJ', 1676603059, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('UMPBqPd-hwy4gwcmySkRcjO2C0wUForQ', 1676593393, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":{\"rol\":\"profesor\",\"email\":\"pe@ulp.com\"}}}'),
('WVyqlD2SN76EfDUhaaQlL-VDvo51-38M', 1676581012, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":{\"rol\":\"profesor\",\"email\":\"pe@ulp.com\"}}}'),
('ou8TfZwLhar3DN7k6WIIrIZgLEpKbra4', 1676599110, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `alumnos`
--
ALTER TABLE `alumnos`
  ADD PRIMARY KEY (`idAlum`);

--
-- Indices de la tabla `asistencias`
--
ALTER TABLE `asistencias`
  ADD PRIMARY KEY (`idAsistencia`),
  ADD KEY `alumnoId` (`alumnoId`,`horaId`,`materiaId`),
  ADD KEY `horaId` (`horaId`),
  ADD KEY `materiaId` (`materiaId`);

--
-- Indices de la tabla `coordinadores`
--
ALTER TABLE `coordinadores`
  ADD PRIMARY KEY (`idCoor`);

--
-- Indices de la tabla `horarios`
--
ALTER TABLE `horarios`
  ADD PRIMARY KEY (`idHorarios`),
  ADD UNIQUE KEY `materiasID` (`materiasID`);

--
-- Indices de la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  ADD PRIMARY KEY (`idInscripcion`),
  ADD KEY `alumnoId` (`alumnoId`,`profesorId`,`materiaId`),
  ADD KEY `profesorId` (`profesorId`),
  ADD KEY `materiaId` (`materiaId`);

--
-- Indices de la tabla `materias`
--
ALTER TABLE `materias`
  ADD PRIMARY KEY (`idMateria`),
  ADD KEY `profeCargo` (`profeCargo`);

--
-- Indices de la tabla `profesores`
--
ALTER TABLE `profesores`
  ADD PRIMARY KEY (`idProfe`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `alumnos`
--
ALTER TABLE `alumnos`
  MODIFY `idAlum` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `asistencias`
--
ALTER TABLE `asistencias`
  MODIFY `idAsistencia` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `coordinadores`
--
ALTER TABLE `coordinadores`
  MODIFY `idCoor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `horarios`
--
ALTER TABLE `horarios`
  MODIFY `idHorarios` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  MODIFY `idInscripcion` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `materias`
--
ALTER TABLE `materias`
  MODIFY `idMateria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT de la tabla `profesores`
--
ALTER TABLE `profesores`
  MODIFY `idProfe` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `asistencias`
--
ALTER TABLE `asistencias`
  ADD CONSTRAINT `asistencias_ibfk_1` FOREIGN KEY (`alumnoId`) REFERENCES `inscripciones` (`alumnoId`),
  ADD CONSTRAINT `asistencias_ibfk_2` FOREIGN KEY (`horaId`) REFERENCES `horarios` (`idHorarios`),
  ADD CONSTRAINT `asistencias_ibfk_3` FOREIGN KEY (`materiaId`) REFERENCES `horarios` (`materiasID`);

--
-- Filtros para la tabla `horarios`
--
ALTER TABLE `horarios`
  ADD CONSTRAINT `horarios_ibfk_1` FOREIGN KEY (`materiasID`) REFERENCES `materias` (`idMateria`);

--
-- Filtros para la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  ADD CONSTRAINT `inscripciones_ibfk_1` FOREIGN KEY (`profesorId`) REFERENCES `materias` (`profeCargo`),
  ADD CONSTRAINT `inscripciones_ibfk_2` FOREIGN KEY (`materiaId`) REFERENCES `materias` (`idMateria`),
  ADD CONSTRAINT `inscripciones_ibfk_3` FOREIGN KEY (`alumnoId`) REFERENCES `alumnos` (`idAlum`);

--
-- Filtros para la tabla `materias`
--
ALTER TABLE `materias`
  ADD CONSTRAINT `materias_ibfk_1` FOREIGN KEY (`profeCargo`) REFERENCES `profesores` (`idProfe`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
