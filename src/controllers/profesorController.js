////// ITEMS //////🦖🦖🦖
const pool = require('../database');
const moment = require('moment');

function index(req, res) {
  req.getConnection((err, conn) => {
    conn.query(`SELECT materias.idMateria, materias.nombreMateria, horariosdetalles.dia, horariosdetalles.hora_inicio, horariosdetalles.hora_fin, profesores.nombre, profesores.apellido, horarios.idhorarios
    FROM horarios
    JOIN materias ON materias.idMateria = horarios.materiasID
    JOIN horariosdetalles ON horariosdetalles.idHorario = horarios.idhorarios
    JOIN profesores ON profesores.id = materias.profeCargo
    WHERE profesores.id = ?
    GROUP BY materias.idMateria, horariosdetalles.dia, horariosdetalles.hora_inicio, horariosdetalles.hora_fin, horarios.idhorarios    
    `, [req.user.id], (err, horario) => {
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
      res.render('materias/verHorarios', { materiasArr });
    });
  });
  
  }

  function addMateria(req, res) {
    
    req.getConnection((err, conn) => {
        
        conn.query('SELECT * FROM materias, profesores WHERE profeCargo = id AND id = ?',[req.user.id], (err, materia) => {
        if(err) {
          res.json(err);
        }
        res.render('materias/agregarHorario', { materia });
      });

  });
}

function insertMateria(req, res) {
  const { materiasID, dia, hora_inicio, hora_fin } = req.body;
  const mate = { materiasID };
  req.getConnection((err, conn) => {
    conn.query('INSERT INTO horarios SET ?', [mate], (err, materia) => {
      if (err) {
        res.json(err);
      }
      const idHorario = materia.insertId;
      const horarios = [];
      for (let i = 0; i < dia.length; i++) {
        horarios.push([idHorario, dia[i], hora_inicio[i], hora_fin[i]]);
      }
      conn.query('INSERT INTO horariosdetalles (idHorario, dia, hora_inicio, hora_fin) VALUES ?', [horarios], (err, result) => {
        if (err) {
          res.json(err);
        }
        res.redirect('/horarios');
      });
    });
  });
}
  
  function create(req, res) {
    res.render('tasks/create');
  }
  
  function store(req, res) {
    const {titulo,descripcion,prioridad,fechaLimite,estado} = req.body;
    const data = {
      titulo,descripcion,prioridad,fechaLimite,estado, //hay q ver 🦖🦖🦖
      idUser: req.user.id 
    };

    req.getConnection((err, conn) => {
      conn.query('INSERT INTO item SET ?', [data], (err, rows) => {
        res.redirect('/tasks');
      });
    });
  }
 
  
  async function asistencia ( req, res) { //Ver
    const {id} = req.params;
    const {materia} = req.params;

    console.log(materia, id)


    const nombreMat = await pool.query('SELECT nombreMateria FROM `materias` WHERE idMateria = ?', [materia]);

    const fechas = await pool.query('CALL sp_obtener_fechas(?)', [materia]);
    const fechas2 = await pool.query(`SELECT DISTINCT DATE_ADD(fecha_inicio, INTERVAL n.num DAY) AS fecha 
    FROM fechas INNER JOIN materias ON fechas.materiaId = materias.idMateria 
    INNER JOIN horariosdetalles ON horariosdetalles.idHorario = materias.idMateria
    CROSS JOIN (
        SELECT a.N + b.N * 10 + c.N * 100 + d.N * 1000 AS num
         FROM (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a,
              (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b,
              (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) c,
              (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) d
    ) n WHERE materias.idMateria = ?
        AND DATE_ADD(fecha_inicio, INTERVAL n.num DAY) BETWEEN fecha_inicio AND fecha_fin
      AND (DAYOFWEEK(DATE_ADD(fecha_inicio, INTERVAL n.num DAY)) = 2 OR DAYOFWEEK(DATE_ADD(fecha_inicio, INTERVAL n.num DAY)) = 5)`, [materia]);

    console.log(fechas2)
    
    const alumnos = await pool.query(`SELECT DISTINCT email, nombre, apellido, fecha, presente, dni, hora, dictado FROM asistencias, horarios, alumnos 
    WHERE asistencias.horaId = horarios.idhorarios AND alumnos.id = asistencias.alumnoId AND idhorarios = ?`, [id]);

    const asist5  = await pool.query('CALL sp_obtener_datos(?, ?)', [materia, id]);
    const [asistZZ] = asist5;
    const keys = [...new Set(asistZZ.flatMap((content) => Object.keys(content)))];
    const titleKeys = keys.map((key) => key.replace('_', '/'));

    res.render('materias/asistencia',{nombreMat,fechas, alumnos,  asistZZ , titleKeys, keys}); //res.render('horarios/asistencia', {asist, fecha, id,  asistZZ , titleKeys, keys, nombreMat});
  
  }


  async function inscriptos(req, res) {
    const {id} = req.params;
    const alumnos = await pool.query('SELECT DISTINCT * FROM inscripciones, alumnos WHERE inscripciones.idAlumno = alumnos.id  AND inscripciones.materiaId = ?  ', [id]);
    const materias = await pool.query('SELECT DISTINCT * FROM materias WHERE  idMateria = ?', [id]);
    const horarios = await pool.query('SELECT DISTINCT * FROM horarios, materias, profesores,horariosdetalles WHERE (horarios.materiasID = materias.idMateria) AND (profeCargo = profesores.id) AND horarios.idhorarios = horariosdetalles.idHorario AND materiasID = ?', [id]);

    const idHorariosArray = Array.from(new Set(horarios.map((row) => row.idhorarios)));
 

    const conflicto = await pool.query(`SELECT m1.dia, m1.hora_inicio, m1.hora_fin, m1.idHorario as idHorario1, m2.idHorario as idHorario2, 
    m2.idDetalle as idDetalle2 FROM horariosdetalles m1 JOIN horariosdetalles m2 ON (m1.idHorario <> m2.idHorario AND m1.dia = m2.dia)
    WHERE ((m2.hora_inicio BETWEEN m1.hora_inicio AND m1.hora_fin) OR (m2.hora_fin BETWEEN m1.hora_inicio AND m1.hora_fin))
    AND m1.idHorario = ? `,[idHorariosArray]);
    console.log("conflicto",conflicto);
    


    switch (new Date().getDay()) {
        case 1:



        break;    
    }

    var alumitos = [];
    /*
    const horaIniPrincipalLunes = await pool.query('SELECT horaInicioLunes FROM `horarios` WHERE materiasID = ?', [id]);
    const horaIniFinLunes = await pool.query('SELECT horaFinLunes FROM `horarios` WHERE materiasID = ?', [id]);

    const horaIniPrincipalMartes = await pool.query('SELECT horaInicioMartes FROM `horarios` WHERE materiasID = ?', [id]);
    const horaIniFinMartes = await pool.query('SELECT horaFinMartes FROM `horarios` WHERE materiasID = ?', [id]);

    const horaIniPrincipalMiercoles = await pool.query('SELECT horaInicioMiercoles FROM `horarios` WHERE materiasID = ?', [id]);
    const horaIniFinMiercoles = await pool.query('SELECT horaFinMiercoles FROM `horarios` WHERE materiasID = ?', [id]);
    
    const horaIniPrincipalJueves = await pool.query('SELECT horaInicioJueves FROM `horarios` WHERE materiasID = ?', [id]);
    const horaIniFinJueves = await pool.query('SELECT horaFinJueves FROM `horarios` WHERE materiasID = ?', [id]);

    const horaIniPrincipalViernes = await pool.query('SELECT horaInicioViernes FROM `horarios` WHERE materiasID = ?', [id]);
    const horaIniFinViernes = await pool.query('SELECT horaFinViernes FROM `horarios` WHERE materiasID = ?', [id]);
    

    for (i = 0; i < alumnos.length; i++) {

        var arregloConflictoLunes = [];
        var arregloConflictoMartes = [];
        var arregloConflictoMiercoles = [];
        var arregloConflictoJueves = [];
        var arregloConflictoViernes = [];                                          
        const horaIniMateriasLunes = await pool.query('SELECT DISTINCT nombreMateria, horaInicioLunes FROM horarios, inscripciones, materias WHERE  materiasID = idMateria AND horaInicioLunes != "" AND materiasID = materiaId AND materiasID != ? AND alumnoId = ?',  [id, alumnos[i].alumnoId ]);  
        const horaFinalMateriasLunes = await pool.query('SELECT DISTINCT nombreMateria, horaFinLunes FROM horarios, inscripciones, materias WHERE  materiasID = idMateria AND horaFinLunes != "" AND materiasID = materiaId AND materiasID != ? AND alumnoId = ?',  [id, alumnos[i].alumnoId ]);
        const horaIniMateriasMartes = await pool.query('SELECT DISTINCT nombreMateria, horaInicioMartes FROM horarios, inscripciones, materias WHERE  materiasID = idMateria AND horaInicioMartes != "" AND materiasID = materiaId AND materiasID != ? AND alumnoId = ?',  [id, alumnos[i].alumnoId ]);  
        const horaFinalMateriasMartes = await pool.query('SELECT DISTINCT nombreMateria, horaFinMartes FROM horarios, inscripciones, materias WHERE  materiasID = idMateria AND horaFinMartes != "" AND materiasID = materiaId AND materiasID != ? AND alumnoId = ?',  [id, alumnos[i].alumnoId ]);
        const horaIniMateriasMiercoles = await pool.query('SELECT DISTINCT nombreMateria, horaInicioMiercoles FROM horarios, inscripciones, materias WHERE  materiasID = idMateria AND horaInicioMiercoles != "" AND materiasID =materiaId AND materiasID != ? AND alumnoId = ?',  [id, alumnos[i].alumnoId ]);  
        const horaFinalMateriasMiercoles = await pool.query('SELECT DISTINCT nombreMateria, horaFinMiercoles FROM horarios, inscripciones, materias WHERE  materiasID = idMateria AND horaFinMiercoles != "" AND materiasID = materiaId AND materiasID != ? AND alumnoId = ?',  [id, alumnos[i].alumnoId ]);
        const horaIniMateriasJueves = await pool.query('SELECT DISTINCT nombreMateria, horaInicioJueves FROM horarios, inscripciones, materias WHERE  materiasID = idMateria AND horaInicioJueves != "" AND materiasID = materiaId AND materiasID != ? AND alumnoId = ?',  [id, alumnos[i].alumnoId ]);  
        const horaFinalMateriasJueves = await pool.query('SELECT DISTINCT nombreMateria, horaFinJueves FROM horarios, inscripciones, materias WHERE  materiasID =idMateria AND horaFinJueves != "" AND materiasID = materiaId AND materiasID != ? AND alumnoId = ?',  [id, alumnos[i].alumnoId ]);
        const horaIniMateriasViernes = await pool.query('SELECT DISTINCT nombreMateria, horaInicioViernes FROM horarios, inscripciones, materias WHERE  materiasID = idMateria AND horaInicioViernes != "" AND materiasID = materiaId AND materiasID != ? AND alumnoId = ?',  [id, alumnos[i].alumnoId ]);  
        const horaFinalMateriasViernes = await pool.query('SELECT DISTINCT nombreMateria, horaFinViernes FROM horarios, inscripciones, materias WHERE  materiasID = idMateria AND horaFinViernes != "" AND materiasID = materiaId AND materiasID != ? AND alumnoId = ?',  [id, alumnos[i].alumnoId ]);
        
        for (z = 0; z < horaIniMateriasLunes.length; z++) {
            if(horaIniPrincipalLunes[0].horaInicioLunes >= horaIniMateriasLunes[z].horaInicioLunes && horaIniPrincipalLunes[0].horaInicioLunes >= horaFinalMateriasLunes[z].horaFinLunes || horaIniFinLunes[0].horaFinLunes <= horaIniMateriasLunes[z].horaInicioLunes && horaIniFinLunes[0].horaFinLunes <= horaFinalMateriasLunes[z].horaFinLunes || horaIniPrincipalLunes[0].horaInicioLunes == null){  
            }else{
                arregloConflictoLunes[z] = horaIniMateriasLunes[z].nombreMateria  ;
            }  
        }

        arregloConflictoLunes = arregloConflictoLunes.filter(item => item);

        for (z = 0; z < horaIniMateriasMartes.length; z++) {
            if(horaIniPrincipalMartes[0].horaInicioMartes >= horaIniMateriasMartes[z].horaInicioMartes && horaIniPrincipalMartes[0].horaInicioMartes >= horaFinalMateriasMartes[z].horaFinMartes || horaIniFinMartes[0].horaFinMartes <= horaIniMateriasMartes[z].horaInicioMartes && horaIniFinMartes[0].horaFinMartes <= horaFinalMateriasMartes[z].horaFinMartes || horaIniPrincipalMartes[0].horaInicioMartes == null){  
            }else{
                arregloConflictoMartes[z] = horaIniMateriasMartes[z].nombreMateria  ;
            }  
        }

        arregloConflictoMiercoles = arregloConflictoMiercoles.filter(item => item);

        for (z = 0; z < horaIniMateriasMiercoles.length; z++) {
            if(horaIniPrincipalMiercoles[0].horaInicioMiercoles >= horaIniMateriasMiercoles[z].horaInicioMiercoles && horaIniPrincipalMiercoles[0].horaInicioMiercoles >= horaFinalMateriasMiercoles[z].horaFinMiercoles || horaIniFinMiercoles[0].horaFinMiercoles <= horaIniMateriasMiercoles[z].horaInicioMiercoles && horaIniFinMiercoles[0].horaFinMiercoles <= horaFinalMateriasMiercoles[z].horaFinMiercoles || horaIniPrincipalMiercoles[0].horaInicioMiercoles == null){  
            }else{
                arregloConflictoMiercoles[z] = horaIniMateriasMiercoles[z].nombreMateria  ;
            }  
        }

        arregloConflictoMiercoles = arregloConflictoMiercoles.filter(item => item);

        for (z = 0; z < horaIniMateriasJueves.length; z++) {
            if(horaIniPrincipalJueves[0].horaInicioJueves >= horaIniMateriasJueves[z].horaInicioJueves && horaIniPrincipalJueves[0].horaInicioJueves >= horaFinalMateriasJueves[z].horaFinJueves || horaIniFinJueves[0].horaFinJueves <= horaIniMateriasJueves[z].horaInicioJueves && horaIniFinJueves[0].horaFinJueves <= horaFinalMateriasJueves[z].horaFinJueves || horaIniPrincipalJueves[0].horaInicioJueves == null){  
            }else{
                arregloConflictoJueves[z] = horaIniMateriasJueves[z].nombreMateria  ;
            }  
        }

        arregloConflictoViernes = arregloConflictoViernes.filter(item => item);

        for (z = 0; z < horaIniMateriasViernes.length; z++) {
            if(horaIniPrincipalViernes[0].horaInicioViernes >= horaIniMateriasViernes[z].horaInicioViernes && horaIniPrincipalViernes[0].horaInicioViernes >= horaFinalMateriasViernes[z].horaFinViernes || horaIniFinViernes[0].horaFinViernes <= horaIniMateriasViernes[z].horaInicioViernes && horaIniFinViernes[0].horaFinViernes <= horaFinalMateriasViernes[z].horaFinViernes || horaIniPrincipalViernes[0].horaInicioViernes == null){  
            }else{
                arregloConflictoViernes[z] = horaIniMateriasViernes[z].nombreMateria  ;
            }  
        }

        arregloConflictoViernes = arregloConflictoViernes.filter(item => item);
        
        alumitos.push({ 
            email: alumnos[i].email, 
            nombre: alumnos[i].nombre, 
            apellido: alumnos[i].apellido, 
            valAlumno: alumnos[i].valAlumno, 
            conflictoLunes: arregloConflictoLunes,
            conflictoMartes: arregloConflictoMartes,
            conflictoMiercoles: arregloConflictoMiercoles,
            conflictoJueves: arregloConflictoJueves,
            conflictoViernes: arregloConflictoViernes,
            alumnoId: alumnos[i].alumnoId,
            materiaId: alumnos[i].materiaId
        });
    }*/

    res.render('inscripcion/alumnosinscriptos',{alumnos, materias, horarios,conflicto}); //,{alumnos, materias, alumitos, horarios}
  }


  async function estadoInscrip ( req, res) { 
    
    const {id} = req.params;
    console.log(id)
    const {materia} = req.params;
    console.log(materia
      )
    const estado = await pool.query('SELECT valAlumno FROM inscripciones WHERE idAlumno = ? AND materiaId = ?  ', [id, materia]);
    const [estadosZ] = estado;
    if(estadosZ.valAlumno == "Invalido"){
        var cambiarEsta = {
        valAlumno: "Valido"
    }
    }else{
        var cambiarEsta = {
            valAlumno: "Invalido"
        }
    }

    await pool.query('UPDATE inscripciones set ? WHERE idAlumno = ? AND materiaId = ?' , [cambiarEsta, id, materia ], );
    res.redirect('/listarAlumnos/' + materia );
  
  }

  async function asistPD ( req, res) { 
    var z = Date.parse(req.query.asisSel);
    var y = moment(z);
    const asi = await pool.query('SELECT DISTINCT email, nombre, apellido, presente, dictado FROM asistencias, horarios, alumnos WHERE horaId = idHorarios AND idAlum = alumnoId AND horaId = ? AND fecha = ?', [req.query.id, y.format("YYYY-MM-DD") ]);
    const fecha = await pool.query('SELECT DISTINCT fecha FROM asistencias, horarios, alumnos WHERE horaId = idHorarios AND idAlum = alumnoId AND horaId = ? AND fecha = ? ', [req.query.id, y.format("YYYY-MM-DD") ]);
    const dic = await pool.query('SELECT DISTINCT horaId, fecha FROM asistencias, horarios WHERE horaId = idHorarios AND horaId = ? AND fecha = ? ', [req.query.id, y.format("YYYY-MM-DD") ]);
    const nombreMat = await pool.query('SELECT DISTINCT nombreMateria FROM horarios, materias WHERE materiasID = idMateria AND idHorarios = ?' , [req.query.id]);
    res.render('materias/asisPD', {asi, fecha, dic, nombreMat});

  }

 function asistPD2(req,res){
  res.redirect('/asistencia/asisPD');
 }

  module.exports = {
    index: index,
    create: create,
    store: store,
    addMateria:addMateria,
    insertMateria:insertMateria,
    asistencia: asistencia,
    inscriptos:inscriptos,
    estadoInscrip:estadoInscrip,
    asistPD: asistPD,
    asistPD2:asistPD2
  }