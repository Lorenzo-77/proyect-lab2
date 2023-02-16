const express = require('express');
const AsistenciaController = require('../controllers/AsistenciaController');
const { isLoggedIn } = require('../lib/auth');
const routerAsistencia= express.Router();

routerAsistencia.get('/', (req, res) => {
    res.render('index');
});

routerAsistencia.get('/asistencia',isLoggedIn, AsistenciaController.index);

routerAsistencia.get('/asistencia/agregarAsistencia/:id',isLoggedIn, AsistenciaController.asistencia);



module.exports = routerAsistencia;