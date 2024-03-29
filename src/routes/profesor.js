const express = require('express');
const ProfeController = require('../controllers/profesorController');
const { isLoggedIn,auth } = require('../lib/auth');
const routerProfe = express.Router();

routerProfe.get('/', (req, res) => {
    res.render('index');
});

routerProfe.get('/horarios',isLoggedIn,auth("profesor"), ProfeController.index);
routerProfe.get('/agregar',isLoggedIn, auth("profesor"),ProfeController.addMateria);
routerProfe.post('/agregar', isLoggedIn, ProfeController.insertMateria);

routerProfe.get('/asistencia/:id/:materia',isLoggedIn,auth("profesor"), ProfeController.asistencia);

routerProfe.get('/listarAlumnos/:id',isLoggedIn,auth("profesor"), ProfeController.inscriptos);

routerProfe.post('/inscripcion/cambiarEstado/:id/:materia', isLoggedIn, ProfeController.estadoInscrip);

routerProfe.get('/asistencia/asisPD', isLoggedIn, ProfeController.asistPD);
routerProfe.post('/asistencia/asisPD', isLoggedIn, ProfeController.asistPD2);

module.exports = routerProfe;