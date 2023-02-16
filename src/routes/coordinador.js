const express = require('express');
const passport = require('passport');

const CoordinadorController = require('../controllers/CoordinadorController');
const { isLoggedIn, auth } = require('../lib/auth');
const routerCoordinador = express.Router();

routerCoordinador.get('/crear/createMateria',isLoggedIn,auth("coordinador"), CoordinadorController.createMateria);
routerCoordinador.post('/crear/createMateria',isLoggedIn, CoordinadorController.storeMateria);


routerCoordinador.get('/crear/asignarProfesor',isLoggedIn,auth("coordinador"), CoordinadorController.edit);
routerCoordinador.post('/crear/asignarProfesor',isLoggedIn, CoordinadorController.update);

routerCoordinador.get('/total',isLoggedIn,auth("coordinador"), CoordinadorController.total);

routerCoordinador.get('/crearProfesor',auth("coordinador"), (req, res) => { //direccion para crear al profesor
    res.render('crear/createProfesor');
  });

routerCoordinador.post('/crearProfesor', passport.authenticate('local.registrateProfe', {
    successRedirect: '/profile',
    failureRedirect: '/crearProfesor',
  }));


module.exports = routerCoordinador;