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
    console.log(id,req.user.id);
    const horarios = await pool.query(` SELECT idHorarios, alumnos.id as alumnoID, materiasID, idMateria, profesores.id as profesorID, horariosdetalles.dia, horariosdetalles.hora_inicio, horariosdetalles.hora_fin, profesores.nombre, profesores.apellido, nombreMateria 
    FROM horarios, materias, profesores, alumnos, horariosdetalles 
    WHERE (materias.idMateria = horarios.materiasID) 
        AND (materias.profeCargo = profesores.id) 
        AND horariosdetalles.idHorario = horarios.idhorarios 
        AND alumnos.id = ? AND horarios.idhorarios = ?`, [req.user.id, id])
    const [horaZ] = horarios;
    console.log(horaZ);
    const nuevaInscripcion = {
        idAlumno: horaZ.alumnoID,
        idProfesor: horaZ.profesorID,
        materiaId:  horaZ.idMateria,
        valAlumno: "Invalido"
    }
    const condi = await pool.query (`SELECT DISTINCT IF(idAlumno = ? AND idProfesor = ?
        AND materiaId = ?, "YES", "NO") AS condi FROM inscripciones  
        ORDER BY condi DESC LIMIT 1 `, [horaZ.id, horaZ.profeCargo, horaZ.idMateria])
    const [con] =  condi;
    console.log("Nuena inscr:",nuevaInscripcion);
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