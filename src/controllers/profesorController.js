////// ITEMS //////🦖🦖🦖
const pool = require('../database');

function index(req, res) {

    req.getConnection((err, conn) => {
      conn.query('SELECT * FROM horarios, materias, profesores WHERE materiasID = idMateria AND profeCargo = idProfe AND idProfe = ?', [req.user.idProfe], (err, horario) => {
        if(err) {
          res.json(err);
        }
        res.render('materias/verHorarios', { horario });
      });
    });
  }

  function addMateria(req, res) {
    
    req.getConnection((err, conn) => {
        
        conn.query('SELECT * FROM materias, profesores WHERE profeCargo = idProfe AND idProfe = ?',[req.user.idProfe], (err, materia) => {
        if(err) {
          res.json(err);
        }
        res.render('materias/agregarHorario', { materia });
      });

  });
}
  
  function insertMateria(req, res) {
    let myVar = undefined;
    var {materiasID, horaInicioLunes, horaFinLunes, lunes, horaInicioMartes, horaFinMartes, martes, horaInicioMiercoles, horaFinMiercoles, miercoles, horaInicioJueves, horaFinJueves, jueves, horaInicioViernes, horaFinViernes, viernes } = req.body;
    console.log(horaInicioLunes);
    if( horaInicioLunes === "" && horaFinLunes === ""){
        horaInicioLunes = null;
        horaFinLunes = null;
    }
    if( horaInicioMartes === "" && horaFinMartes === ""){
        horaInicioMartes = null;
        horaFinMartes = null;
    }
    if( horaInicioMiercoles === "" && horaFinMiercoles === ""){
        horaInicioMiercoles = null;
        horaFinMiercoles = null;
    }
    if( horaInicioJueves === "" && horaFinJueves === ""){
        horaInicioJueves = null;
        horaFinJueves = null;
    }
    if( horaInicioViernes === "" && horaFinViernes === ""){
        horaInicioViernes = null;
        horaFinViernes = null;
    }
    const  nuevoHorario = {
        materiasID,
        horaInicioLunes,
        horaFinLunes,
        lunes,
        horaInicioMartes,
        horaFinMartes,
        martes,
        horaInicioMiercoles,
        horaFinMiercoles,
        miercoles,
        horaInicioJueves,
        horaFinJueves,
        jueves,
        horaInicioViernes,
        horaFinViernes,
        viernes
    };

    req.getConnection((err, conn) => {
        conn.query('SELECT materiasID FROM `horarios` WHERE materiasID = ? ', [materiasID], (err, materia) => {
        console.log(materia[0]);
        if( materia[0] == myVar){
          conn.query('INSERT INTO horarios set ?',[nuevoHorario], (err, lista) => {
          if(err) {
            res.json(err);
          }
          res.redirect('/materias');
        });
    }
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

    const fecha = await pool.query('SELECT DISTINCT fecha FROM asistencias, horarios, alumnos WHERE horaId = idHorarios AND alumnoId = idAlum AND horaId = ?', [id])
    const asist = await pool.query('SELECT DISTINCT email, nombre, apellido, fecha, presente FROM asistencias, horarios, alumnos WHERE horaId = idHorarios AND idAlum = alumnoId AND horaId = ? ', [id]);
    const nombreMat = await pool.query('SELECT nombreMateria FROM `materias` WHERE idMateria = ?', [materia]);


    const asist5 = await pool.query('CALL PR_TABLA(?,?)', [id, materia]);
    const [asistZZ] = asist5;
    const keys = [...new Set(asistZZ.flatMap((content) => Object.keys(content)))];
    const titleKeys = keys.map((key) => key.replace('_', '/'));
    res.render('materias/asistencia', {asist, fecha, id,  asistZZ , titleKeys, keys, nombreMat});
  
  }


  async function inscriptos(req, res) {
    const {id} = req.params;
    const alumnos = await pool.query('SELECT DISTINCT * FROM inscripciones, alumnos WHERE alumnoId = idAlum  AND materiaId = ?  ', [id]);
    const materias = await pool.query('SELECT DISTINCT * FROM materias WHERE  idMateria = ?', [id]);
    const horarios = await pool.query('SELECT DISTINCT * FROM horarios, materias, profesores WHERE (materiasID = idMateria) AND (profeCargo = idProfe) AND materiasID = ?', [id])
  
    switch (new Date().getDay()) {
        case 1:



        break;    
    }

    var alumitos = [];
    
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
    }

    res.render('inscripcion/alumnosinscriptos',{alumnos, materias, alumitos, horarios});
  }


  async function estadoInscrip ( req, res) { 
    
    const {id} = req.params;
    console.log(id)
    const {materia} = req.params;
  
    const estado = await pool.query('SELECT valAlumno FROM inscripciones WHERE alumnoId = ? AND materiaId = ?  ', [id, materia]);
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

    await pool.query('UPDATE inscripciones set ? WHERE alumnoId = ? AND materiaId = ?' , [cambiarEsta, id, materia ], );
    res.redirect('/inscripcion/listarAlumnos/' + materia );
  
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
  }