const express = require('express');
const AlumnoController = require('../controllers/alumnoController');
const { isLoggedIn, auth } = require('../lib/auth');
const routerAlumno = express.Router();
const pool = require('../database');
routerAlumno.get('/', (req, res) => {
    res.render('index');
});

routerAlumno.get('/materias',isLoggedIn,auth("alumno"), AlumnoController.index);

routerAlumno.get('/materias/inscribir/:id', isLoggedIn,auth("alumno"), async (req,  res) => {
    const {id} = req.params;
    console.log(id);
    const horarios = await pool.query(`SELECT idHorarios, idAlum, materiasID, idMateria, profeCargo, idProfe, horaInicioLunes, 
    horaFinLunes, lunes, horaInicioMartes, horaFinMartes, martes, horaInicioMiercoles, horaFinMiercoles, miercoles, horaInicioJueves, 
    horaFinJueves, jueves, horaInicioViernes, horaFinViernes, viernes, profesores.nombre, profesores.apellido, 
    nombreMateria FROM horarios, materias, profesores, alumnos WHERE (materiasID = idMateria) 
    AND (profeCargo = idProfe) AND idAlum = ? AND idHorarios = ?`, [req.user.idAlum, id])
    const [horaZ] = horarios;
    console.log(horaZ);
    const nuevaInscripcion = {
        alumnoId: horaZ.idAlum,
        profesorId: horaZ.idProfe,
        materiaId:  horaZ.idMateria,
        valAlumno: "Invalido"
    }
    const condi = await pool.query (`SELECT DISTINCT IF(alumnoId = ? AND profesorId = ?
        AND materiaId = ?, "YES", "NO") AS condi FROM inscripciones  
        ORDER BY condi DESC LIMIT 1 `, [horaZ.idAlum, horaZ.idProfe, horaZ.idMateria])
    const [con] =  condi
    console.log(con);
    console.log(condi);
    
    if(con === undefined){
        await pool.query('INSERT INTO inscripciones set ?' , [nuevaInscripcion]);
        
        res.redirect('/asistencia');
    }
    
    
    else if(con.condi == "YES"  ){
       
        res.redirect('/asistencia');    
    }else{
    await pool.query('INSERT INTO inscripciones set ?' , [nuevaInscripcion]);
    
    res.redirect('/asistencia');}
});




module.exports = routerAlumno;