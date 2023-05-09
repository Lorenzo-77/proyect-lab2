-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 09-05-2023 a las 02:41:36
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
-- Base de datos: `integrador`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alumnos`
--

CREATE TABLE `alumnos` (
  `id` int(11) NOT NULL,
  `dni` varchar(20) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `rol` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `alumnos`
--

INSERT INTO `alumnos` (`id`, `dni`, `nombre`, `apellido`, `email`, `password`, `rol`) VALUES
(1, '50505050', 'Samuel', 'Joya', 'joya@gmail.com', '$2a$10$dEW38abpA8pmiG3CBEFUq.TMkelKdj0FpjsUBm.OpFOTAqtALQC5y', 'alumno'),
(2, '12345678', 'Ana', 'García', 'ana.garcia@gmail.com', '$2a$10$cXNC/g/iqFaYXHLjMS3JceAh.K/yn05uh3vIDqk1BhUOeBsZBrj.m', 'alumno'),
(3, '2345678', 'Juan', 'Pérez', 'juan.perez@gmail.com', '$2a$10$TrPefVea623cueDsvM8/..cjlqosMwQrBQ2RGMsPBFzYvEfgd9Nyi', 'alumno'),
(4, '34567890', 'María', 'Fernández', 'maria.fernandez@gmail.com', '$2a$10$8RRMGvcLGcDCSRN/xkK00OS3mYfqUY8rEhlcT/FjXbX4DtZvkVCaG', 'alumno'),
(5, '45678901', ' Pedro', 'Sánchez', 'pedro.sanchez@gmail.com', '$2a$10$ncJnw.8pE.VPkzzffok3Qe5u5sDE71pQo9Osn9.5pBkf9TVnChn/a', 'alumno');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asistencias`
--

CREATE TABLE `asistencias` (
  `idAsistencia` int(11) NOT NULL,
  `alumnoId` int(11) NOT NULL,
  `horaId` int(11) NOT NULL,
  `materiaId` int(11) NOT NULL,
  `presente` tinyint(1) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `dictado` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `coordinadores`
--

CREATE TABLE `coordinadores` (
  `id` int(11) NOT NULL,
  `dni` varchar(20) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `rol` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `coordinadores`
--

INSERT INTO `coordinadores` (`id`, `dni`, `nombre`, `apellido`, `email`, `password`, `rol`) VALUES
(1, '39796666', 'Lorenzo', 'Muñoz', 'Coordinador@gmail.com', '$2a$10$hMalpyylDjS5ekWveAvo7.g6.y.nf8ClN9bYCdB1PSghS7HAdDvju', 'coordinador');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `fechas`
--

CREATE TABLE `fechas` (
  `idfechas` int(11) NOT NULL,
  `materiaId` int(11) DEFAULT NULL,
  `tipo_fecha` varchar(20) DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `fechas`
--

INSERT INTO `fechas` (`idfechas`, `materiaId`, `tipo_fecha`, `fecha_inicio`, `fecha_fin`) VALUES
(0, 14, 'cuatrimestre', '2023-05-15', '2023-09-14');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horarios`
--

CREATE TABLE `horarios` (
  `idhorarios` int(11) NOT NULL,
  `materiasID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `horarios`
--

INSERT INTO `horarios` (`idhorarios`, `materiasID`) VALUES
(14, 14);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horariosdetalles`
--

CREATE TABLE `horariosdetalles` (
  `idDetalle` int(11) NOT NULL,
  `idHorario` int(11) NOT NULL,
  `dia` varchar(50) NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `horariosdetalles`
--

INSERT INTO `horariosdetalles` (`idDetalle`, `idHorario`, `dia`, `hora_inicio`, `hora_fin`) VALUES
(8, 14, 'Lunes', '14:00:00', '16:00:00'),
(9, 14, 'Jueves', '15:00:00', '17:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inscripciones`
--

CREATE TABLE `inscripciones` (
  `idInscripcion` int(11) NOT NULL,
  `idAlumno` int(11) NOT NULL,
  `idProfesor` int(11) NOT NULL,
  `materiaId` int(11) NOT NULL,
  `valAlumno` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `inscripciones`
--

INSERT INTO `inscripciones` (`idInscripcion`, `idAlumno`, `idProfesor`, `materiaId`, `valAlumno`) VALUES
(4, 1, 1, 14, 'Valido'),
(5, 4, 1, 14, 'Valido'),
(6, 2, 1, 14, 'Invalido'),
(7, 3, 1, 14, 'Valido'),
(9, 5, 1, 14, 'Valido');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `materias`
--

CREATE TABLE `materias` (
  `idMateria` int(11) NOT NULL,
  `nombreMateria` varchar(100) NOT NULL,
  `profeCargo` int(11) DEFAULT NULL,
  `Año` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `materias`
--

INSERT INTO `materias` (`idMateria`, `nombreMateria`, `profeCargo`, `Año`) VALUES
(14, 'Matematica', 1, 2023);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profesores`
--

CREATE TABLE `profesores` (
  `id` int(11) NOT NULL,
  `dni` varchar(20) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `rol` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `profesores`
--

INSERT INTO `profesores` (`id`, `dni`, `nombre`, `apellido`, `email`, `password`, `rol`) VALUES
(1, '40404040', 'David', 'Lucero', 'david@gmail.com', '$2a$10$U3/J2J5BKNEg3h.loLrlHuWzSq1Y.DMF25tICXYabDVCE2t58Ff8O', 'profesor'),
(2, '45293238', 'Diego', 'Funes', 'diego@gmail.com', '$2a$10$ljqbW1ruwnvRrCSA0wy2fevVbGTwZtGRC2y277wCOXJgyOdF7X0lu', 'profesor');

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
('Du-DL_MZNC-QBKc-jLz1J8sN8_sV-wSz', 1683679261, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":{\"id\":1,\"rol\":\"profesor\",\"email\":\"david@gmail.com\"}}}');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `alumnos`
--
ALTER TABLE `alumnos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `asistencias`
--
ALTER TABLE `asistencias`
  ADD PRIMARY KEY (`idAsistencia`),
  ADD KEY `alumnoId` (`alumnoId`),
  ADD KEY `horaId` (`horaId`),
  ADD KEY `materiaId` (`materiaId`);

--
-- Indices de la tabla `coordinadores`
--
ALTER TABLE `coordinadores`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `fechas`
--
ALTER TABLE `fechas`
  ADD PRIMARY KEY (`idfechas`),
  ADD KEY `materiaId` (`materiaId`);

--
-- Indices de la tabla `horarios`
--
ALTER TABLE `horarios`
  ADD PRIMARY KEY (`idhorarios`),
  ADD KEY `idmateria` (`materiasID`);

--
-- Indices de la tabla `horariosdetalles`
--
ALTER TABLE `horariosdetalles`
  ADD PRIMARY KEY (`idDetalle`),
  ADD KEY `idHorario` (`idHorario`);

--
-- Indices de la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  ADD PRIMARY KEY (`idInscripcion`),
  ADD KEY `idAlumno` (`idAlumno`),
  ADD KEY `idProfesor` (`idProfesor`),
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
  ADD PRIMARY KEY (`id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `asistencias`
--
ALTER TABLE `asistencias`
  MODIFY `idAsistencia` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `coordinadores`
--
ALTER TABLE `coordinadores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `horarios`
--
ALTER TABLE `horarios`
  MODIFY `idhorarios` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `horariosdetalles`
--
ALTER TABLE `horariosdetalles`
  MODIFY `idDetalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  MODIFY `idInscripcion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `materias`
--
ALTER TABLE `materias`
  MODIFY `idMateria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `profesores`
--
ALTER TABLE `profesores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `asistencias`
--
ALTER TABLE `asistencias`
  ADD CONSTRAINT `asistencias_ibfk_1` FOREIGN KEY (`alumnoId`) REFERENCES `alumnos` (`id`),
  ADD CONSTRAINT `asistencias_ibfk_2` FOREIGN KEY (`horaId`) REFERENCES `horarios` (`idhorarios`),
  ADD CONSTRAINT `asistencias_ibfk_3` FOREIGN KEY (`materiaId`) REFERENCES `materias` (`idMateria`);

--
-- Filtros para la tabla `fechas`
--
ALTER TABLE `fechas`
  ADD CONSTRAINT `fechas_ibfk_1` FOREIGN KEY (`materiaId`) REFERENCES `materias` (`idMateria`);

--
-- Filtros para la tabla `horarios`
--
ALTER TABLE `horarios`
  ADD CONSTRAINT `horarios_ibfk_1` FOREIGN KEY (`materiasID`) REFERENCES `materias` (`idMateria`);

--
-- Filtros para la tabla `horariosdetalles`
--
ALTER TABLE `horariosdetalles`
  ADD CONSTRAINT `horariosdetalles_ibfk_1` FOREIGN KEY (`idHorario`) REFERENCES `horarios` (`idhorarios`);

--
-- Filtros para la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  ADD CONSTRAINT `inscripciones_ibfk_1` FOREIGN KEY (`idAlumno`) REFERENCES `alumnos` (`id`),
  ADD CONSTRAINT `inscripciones_ibfk_2` FOREIGN KEY (`idProfesor`) REFERENCES `profesores` (`id`),
  ADD CONSTRAINT `inscripciones_ibfk_3` FOREIGN KEY (`materiaId`) REFERENCES `materias` (`idMateria`);

--
-- Filtros para la tabla `materias`
--
ALTER TABLE `materias`
  ADD CONSTRAINT `materias_ibfk_1` FOREIGN KEY (`profeCargo`) REFERENCES `profesores` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
