const pool = require('../database');
const moment = require('moment');

function index(req, res) {
  req.getConnection((err, conn) => {
    conn.query(`SELECT DISTINCT materias.idMateria, horarios.idhorarios, alumnos.id, materiasID, idMateria, 
    profeCargo, profesores.id, profesores.nombre, dia, horariosdetalles.hora_inicio, hora_fin, profesores.apellido, 
    nombreMateria, valAlumno FROM horarios, horariosdetalles, materias, profesores, alumnos, inscripciones 
    WHERE valAlumno = "Valido" AND (materiasID = idMateria) 
    AND materiaId = idMateria AND (profeCargo = profesores.id)  AND horariosdetalles.idHorario = horarios.idhorarios
    AND profesores.id = profeCargo AND alumnos.id = idAlumno AND alumnos.id =  ?`, [req.user.id], (err, horario) => {
      if(err) {
        res.json(err);
      }
      const materias = horario.reduce((acc, cur) => {
        if (!acc[cur.idMateria]) {
          acc[cur.idMateria] = {
            idMateria: cur.idMateria,
            idhorarios: cur.idhorarios,
            nombreMateria: cur.nombreMateria,
            nombre: cur.nombre,
            apellido: cur.apellido,
            horarios: []
          };
        }
        acc[cur.idMateria].horarios.push({
          idHorario: cur.idHorario,
          dia: cur.dia,
          hora_inicio: cur.hora_inicio,
          hora_fin: cur.hora_fin,
          
        });
        return acc;
      }, {});
  
      const materiasArr = Object.values(materias);
      console.log(materiasArr)
      res.render('materias/listaAsistencias', { materiasArr });
    });
  });
}

async function asistencia(req,res){
    var ahora = moment();
    ahora.format('HH:mm');
    const fechaHoy = new Date();
    const {id} = req.params;
    const horarios = await pool.query(`SELECT DISTINCT hora_inicio FROM inscripciones, horarios, horariosdetalles
    WHERE idAlumno = ? AND idHorarios = idhorario AND idhorarios = ?`, [req.user.id, id])
    console.log(horarios)

    const horario = horarios.find(horario => horario.idhorarios === id);
    const horaInicio = moment(horarios, 'HH:mm:ss');
    console.log(horaInicio);
    
    const hora = moment();
    const tiempoLimite = horaInicio.clone().add(30, 'minutes'); // Sumar 30 minutos a la hora de inicio
    console.log(hora);

    const dias = await pool.query(`SELECT DISTINCT DATE_ADD(fecha_inicio, INTERVAL n.num DAY) AS fecha 
    FROM fechas 
    INNER JOIN materias ON fechas.materiaId = materias.idMateria 
    INNER JOIN horariosdetalles ON horariosdetalles.idHorario = materias.idMateria
    CROSS JOIN (
        SELECT a.N + b.N * 10 + c.N * 100 + d.N * 1000 AS num
        FROM (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a,
            (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b,
            (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) c,
            (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) d
    ) n 
    WHERE materias.idMateria = ?
        AND DATE_ADD(fecha_inicio, INTERVAL n.num DAY) BETWEEN fecha_inicio AND fecha_fin
        AND (
            (horariosdetalles.dia = 'lunes' AND DAYOFWEEK(DATE_ADD(fecha_inicio, INTERVAL n.num DAY)) = 2)
            OR (horariosdetalles.dia = 'martes' AND DAYOFWEEK(DATE_ADD(fecha_inicio, INTERVAL n.num DAY)) = 3)
            OR (horariosdetalles.dia = 'miércoles' AND DAYOFWEEK(DATE_ADD(fecha_inicio, INTERVAL n.num DAY)) = 4)
            OR (horariosdetalles.dia = 'jueves' AND DAYOFWEEK(DATE_ADD(fecha_inicio, INTERVAL n.num DAY)) = 5)
            OR (horariosdetalles.dia = 'viernes' AND DAYOFWEEK(DATE_ADD(fecha_inicio, INTERVAL n.num DAY)) = 6)
        )
    `, [id]);

      let fechaDias;

      for (let i = 0; i < dias.length; i++) {
         fechaDias = new Date(dias[i].fecha);
         //console.log(fechaDias)
        if (fechaDias.toISOString().substring(0, 10) === fechaHoy.toISOString().substring(0, 10)) {
          console.log("La fecha coincide con la fecha actual.");
          fechaDias = fechaDias;
          break // Guardar la fecha coincidente en la variable
        } 
      }
       
      const nuevaAsistencia = {
        alumnoId: req.user.id,
        horaId: id ,
        materiaId: id,
        hora: ahora.format("HH:mm:ss"),
        presente: "Si",
        fecha: fechaHoy,
        dictado: "Si"
      };  
     
      console.log(fechaHoy,fechaDias)

      if (hora.isBefore(tiempoLimite)) {
        console.log("Hola")
      }
      if (fechaDias.toISOString().substring(0, 10) === fechaHoy.toISOString().substring(0, 10)) { // La fecha del día coincide con el día de hoy
        req.getConnection((err, conn) => {
            conn.query('INSERT INTO asistencias SET ?', [nuevaAsistencia], (err, rows) => {
              res.redirect('/asistencia?=La fecha del día SI coincide con el día de hoy');
            });
          });
        console.log('Hoy es el día que buscas');

      } else // La fecha del día no coincide con el día de hoy
      {  

        console.log('La fecha del día no coincide con el día que buscas');
        res.redirect('/asistencia?=La fecha del día NO coincide con el día que buscas');
        
      }

}



  module.exports = {
    index: index,
    asistencia:asistencia,
  }