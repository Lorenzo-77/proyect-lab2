const express = require('express');
const passport = require('passport');
const pool = require('../database');
const CoordinadorController = require('../controllers/CoordinadorController');
const { isLoggedIn, auth } = require('../lib/auth');
const routerCoordinador = express.Router();


routerCoordinador.get('/',isLoggedIn,auth("coordinador"), async (req,  res) => {
    const todos = await pool.query('SELECT COUNT(presente) AS todos FROM asistencias ');
    const presentes = await pool.query ('SELECT COUNT(presente) AS presentes FROM asistencias WHERE presente = "Si"; ') 
    const noDictado = await pool.query ('SELECT COUNT(presente) AS presentes FROM asistencias WHERE presente = "No hubo dictado"; ') 
    const [todos1] =  todos;
    const [presentes1] =  presentes;
    const [noDictado1] =  noDictado;
    var porcentaje = Math.trunc(((presentes1.presentes ) * 100) / (todos1.todos - noDictado1.presentes));
    res.render('index', {porcentaje});
});


routerCoordinador.get('/createMateria',isLoggedIn,auth("coordinador"), CoordinadorController.createMateria);
routerCoordinador.post('/createMateria',isLoggedIn, CoordinadorController.storeMateria);


routerCoordinador.get('/asignarProfesor',isLoggedIn,auth("coordinador"), CoordinadorController.edit);
routerCoordinador.post('/asignarProfesor',isLoggedIn, CoordinadorController.update);

routerCoordinador.get('/total',isLoggedIn,auth("coordinador"), CoordinadorController.total);

routerCoordinador.get('/crearProfesor',auth("coordinador"), (req, res) => { //direccion para crear al profesor
    res.render('crear/createProfesor');
  });

routerCoordinador.post('/crearProfesor', passport.authenticate('local.registrateProfe', {
    successRedirect: '/profile',
    failureRedirect: '/crearProfesor',
  }));


module.exports = routerCoordinador;