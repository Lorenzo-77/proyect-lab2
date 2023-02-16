const pool = require('../database');
const moment = require('moment');

function index(req, res) {
  req.getConnection((err, conn) => {
    conn.query(`SELECT DISTINCT materiaId, idHorarios, idAlum, materiasID, idMateria, profeCargo, idProfe, horaInicioLunes, 
    horaFinLunes, lunes, horaInicioMartes, horaFinMartes, martes, horaInicioMiercoles, horaFinMiercoles, miercoles, 
    horaInicioJueves, horaFinJueves, jueves, horaInicioViernes, horaFinViernes, viernes, profesores.nombre, 
    profesores.apellido, nombreMateria, valAlumno FROM horarios, materias, profesores, alumnos, 
    inscripciones WHERE valAlumno = "Valido" AND (materiasID = idMateria) 
    AND materiaId = idMateria AND (profeCargo = profesorId) 
    AND idProfe = profeCargo AND idAlum = alumnoId AND idAlum = ?`, [req.user.idAlum], (err, horario) => {
      if(err) {
        res.json(err);
      }
      res.render('materias/listaAsistencias', { horario });
    });
  });
}

function contadorDias(){
  const horaActual = new Date();
  var horaProgramada = new Date();
  horaProgramada.setHours(00);
  horaProgramada.setMinutes(00);
  horaProgramada.setSeconds(00);
  const x = horaProgramada.getTime() - horaActual.getTime();
  console.log(horaProgramada);
  console.log(horaActual);
  console.log(Math.abs(x))
  return Math.abs(x);
}   


async function cargaAsistencias() {
  console.log("cargaAsistencia")
   switch (new Date().getDay()) {
       case 1:
           const luneshorarios = await pool.query('SELECT idHorarios, alumnoId, materiaId FROM  horarios ,inscripciones WHERE materiaId = materiasID AND lunes = Lunes ');
           let luneslength = luneshorarios.length;
           x = 0  
           do{
               
               const nuevaInscripcion = {
                   alumnoId: luneshorarios[x].alumnoId,
                   horaId: luneshorarios[x].idHorarios,
                   materiaId: luneshorarios[x].materiasID,
                   presente:  "No",
                   dictado: "Si"
               }
           
               await pool.query('INSERT INTO asistencias set ?' , [nuevaInscripcion]);
           
               x = x + 1
           }while (x < luneslength)      

       break;
       
       case 2:
           const marteshorarios = await pool.query('SELECT idHorarios, alumnoId, materiaId FROM  horarios ,inscripciones WHERE materiaId = materiasID AND martes = Martes ');
           let marteslength = marteshorarios.length;
           x = 0  
           do{
               
               const nuevaInscripcion = {
                   alumnoId: marteshorarios[x].alumnoId,
                   horaId: marteshorarios[x].idHorarios,
                   materiaId: marteshorarios[x].materiasID,
                   presente:  "No",
                   dictado: "Si"
               }
           
               await pool.query('INSERT INTO asistencias set ?' , [nuevaInscripcion]);
           
               x = x + 1
           }while (x < marteslength)      

       break;

       case 3:
           const miercoleshorarios = await pool.query('SELECT idHorarios, alumnoId, materiaId FROM  horarios ,inscripciones WHERE materiaId = materiasID AND miercoles = Miercoles ');
           let miercoleslength = miercoleshorarios.length;
           x = 0  
           do{
               
               const nuevaInscripcion = {
                   alumnoId: miercoleshorarios[x].alumnoId,
                   horaId: miercoleshorarios[x].idHorarios,
                   materiaId: miercoleshorarios[x].materiasID,
                   presente:  "No",
                   dictado: "Si"
               }
           
               await pool.query('INSERT INTO asistencias set ?' , [nuevaInscripcion]);
           
               x = x + 1
           }while (x < miercoleslength)      

       break;
   
       case 4:
           const jueveshorarios = await pool.query('SELECT idHorarios, alumnoId, materiaId FROM  horarios ,inscripciones WHERE materiaId = materiasID AND jueves = Jueves ');
           let jueveslength = jueveshorarios.length;
           x = 0  
           do{
               
               const nuevaInscripcion = {
                   alumnoId: jueveshorarios[x].alumnoId,
                   horaId: jueveshorarios[x].idHorarios,
                   materiaId: jueveshorarios[x].materiasID,
                   presente:  "No",
                   dictado: "Si"
               }
           
               await pool.query('INSERT INTO asistencias set ?' , [nuevaInscripcion]);
           
               x = x + 1
           }while (x < jueveslength)      

       break;

       case 5:
           const vierneshorarios = await pool.query('SELECT idHorarios, alumnoId, materiaId FROM  horarios ,inscripciones WHERE materiaId = materiasID AND viernes = Viernes ');
           let vierneslength = vierneshorarios.length;
           x = 0  
           do{
               
               const nuevaInscripcion = {
                   alumnoId: vierneshorarios[x].alumnoId,
                   horaId: vierneshorarios[x].idHorarios,
                   materiaId: vierneshorarios[x].materiasID,
                   presente:  "No",
                   dictado: "Si"
               }
           
               await pool.query('INSERT INTO asistencias set ?' , [nuevaInscripcion]);
           
               x = x + 1
           }while (x < vierneslength)      

       break;
               
       default:  
           console.log("SABADO");
           console.log(contadorDias());
       
           
}

}

function  preguntaTiempo(){
  const horaActual = new Date();
  var horaProgramada = new Date();
  horaProgramada.setHours(00);
  horaProgramada.setMinutes(00);
  horaProgramada.setSeconds(00);
  const x = horaProgramada.getTime() - horaActual.getTime();
      if (x == 0){
          clearTimeout(asistenciaCargada)
          clearInterval(intervaloTiempo)
          setTimeout( cargaAsistencias , contadorDias());

          setInterval(preguntaTiempo, 1000)
         
      }

} 
var intervaloTiempo = setInterval(preguntaTiempo, 1000);

asistenciaCargada =setTimeout( cargaAsistencias , contadorDias());


async function asistencia(req,res){
    var ahora = moment();
    ahora.format('HH:mm');
    const {id} = req.params;
    const horarios = await pool.query('SELECT DISTINCT alumnoId, idHorarios FROM inscripciones, horarios WHERE alumnoId = ? AND idHorarios = ?', [req.user.idAlum, id])
    const [horaZ] = horarios;
    const nuevaInscripcion = {
        hora: ahora.format("HH:mm:ss"),
        presente:  "Si"
    }

    const  des  =  new Date();
    
    const dias = await pool.query  ('SELECT DISTINCT lunes,martes,miercoles,jueves,viernes FROM horarios WHERE idHorarios = ? ' , [id])
    const [diaZ] = dias;
    let dia;
    
switch (new Date().getDay()) {
  case 1:
    dia = "Lunes";

    var hor =  await pool.query('SELECT DISTINCT horaInicioLunes, horaFinLunes FROM inscripciones, horarios WHERE alumnoId = ? AND idHorarios = ?', [req.user.idAlum, id] )
    var [horZ] = hor
    var  arr = horZ.horaInicioLunes.split(":")
    var base = moment(des.setHours(arr[0], arr[1], arr[2]))
    var mas30 = moment(des.setHours(arr[0], arr[1], arr[2]));
    mas30.add(30, 'm')

   
    if( dia == diaZ.lunes){
        console.log(ahora);
        console.log(base);
        console.log(mas30);
        if ( ahora > base && ahora < mas30){
            
            const condi = await pool.query ('SELECT DISTINCT IF(alumnoId= ? AND horaId = ? AND horaId = idHorarios AND presente = "Si" AND fecha = ? , "YES", "NO") AS condi FROM asistencias, horarios ORDER BY condi DESC LIMIT 1 ', [horaZ.alumnoId, horaZ.idHorarios, ahora.format("YYYY-MM-DD")])
            const [con] =  condi

            console.log(condi);
            console.log(con);
            if(con.condi == "YES"){
                res.redirect('/asistencia');    
            }  
            else {
                    await pool.query('UPDATE asistencias set ? WHERE alumnoId=? AND horaId=? AND fecha=? ' , [nuevaInscripcion,horaZ.alumnoId, horaZ.idHorarios, ahora.format("YYYY-MM-DD")]);
                    res.redirect('/asistencia');
                 }
    }
    else  {
        res.redirect('/asistencia');
    }

        }
        else  {
            res.redirect('/asistencia');
        }
    break;
  case 2:
     dia = "Martes";
    
     var hor =  await pool.query('SELECT DISTINCT horaInicioMartes, horaFinMartes FROM inscripciones, horarios WHERE alumnoId = ? AND idHorarios = ?', [req.user.idAlum, id] )
     console.log(hor)
     var [horZ] = hor;
     console.log(horZ)
     var  arr = horZ.horaInicioMartes.split(":");
     var base = moment(des.setHours(arr[0], arr[1], arr[2]));
     var mas30 = moment(des.setHours(arr[0], arr[1], arr[2]));
     mas30.add(30, 'm')


    if( dia == diaZ.martes){
        if ( ahora > base && ahora < mas30){

            const condi = await pool.query ('SELECT DISTINCT IF(alumnoId = ? AND horaId = ? AND horaId = idHorarios AND presente = "Si" AND fecha = ? , "YES", "NO") AS condi FROM asistencias, horarios ORDER BY condi DESC LIMIT 1 ', [horaZ.alumnoId, horaZ.idHorarios, ahora.format("YYYY-MM-DD")])
            const [con] =  condi;
            console.log(condi)
            if(con.condi == "YES"){
                res.redirect('/asistencia');    
            }else{
          
            await pool.query('UPDATE asistencias set ? WHERE alumnoId=? AND horaId=? AND fecha=? ' , [nuevaInscripcion,horaZ.alumnoId, horaZ.idHorarios, ahora.format("YYYY-MM-DD")]);
            res.redirect('/asistencia');
            }
    }
    else  {
        res.redirect('/asistencia');
    }
    
    }
    else  {
        res.redirect('/asistencia');
    }
    break;
  case 3:
    dia = "Miercoles";

    var hor =  await pool.query('SELECT DISTINCT horaInicioMiercoles, horaFinMiercoles FROM inscripciones, horarios WHERE alumnoId = ? AND idHorarios = ?', [req.user.idAlum, id] )
    var [horZ] = hor
    var  arr = horZ.horaInicioMiercoles.split(":")
    var base = moment(des.setHours(arr[0], arr[1], arr[2]))
    var mas30 = moment(des.setHours(arr[0], arr[1], arr[2]));
    mas30.add(30, 'm')

    if( dia == diaZ.miercoles){
        if ( ahora > base && ahora < mas30){

            const condi = await pool.query ('SELECT DISTINCT IF(alumnoId = ? AND horaId = ? AND horaId = idHorarios AND presente = "Si" AND fecha = ? , "YES", "NO") AS condi FROM asistencias, horarios ORDER BY condi DESC LIMIT 1 ', [horaZ.alumnoId, horaZ.idHorarios, ahora.format("YYYY-MM-DD")])
            const [con] =  condi
            if(con.condi == "YES"){
                res.redirect('/asistencia');    
            }else{
          
            await pool.query('UPDATE asistencias set ? WHERE alumnoId=? AND horaId=? AND fecha=? ' , [nuevaInscripcion,horaZ.alumnoId, horaZ.idHorarios, ahora.format("YYYY-MM-DD")]);
            res.redirect('/asistencia');
            }
    }
    else  {
        res.redirect('/asistencia');
    }
    }
    else  {
        res.redirect('/asistencia');
    }
    break;
  case 4:
    dia = "Jueves";
    
    var hor =  await pool.query('SELECT DISTINCT horaInicioJueves, horaFinJueves FROM inscripciones, horarios WHERE alumnoId = ? AND idHorarios = ?', [req.user.idAlum, id] )
    var [horZ] = hor
    var  arr = horZ.horaInicioJueves.split(":")
    var base = moment(des.setHours(arr[0], arr[1], arr[2]))
    var mas30 = moment(des.setHours(arr[0], arr[1], arr[2]));
    mas30.add(30, 'm')


    if( dia == diaZ.jueves){
        console.log(ahora);
        console.log(base);
        console.log(mas30);
        if ( ahora > base && ahora < mas30){

        const condi = await pool.query ('SELECT DISTINCT IF(alumnoId = ? AND horaId = ? AND horaId = idHorarios AND presente = "Si" AND fecha = ? , "YES", "NO") AS condi FROM asistencias, horarios ORDER BY condi DESC LIMIT 1 ', [horaZ.alumnoId, horaZ.idHorarios, ahora.format("YYYY-MM-DD")])
        const [con] =  condi
        if(con.condi == "YES"){
            res.redirect('/asistencia');    
        }else{
      
        await pool.query('UPDATE asistencias set ? WHERE alumnoId=? AND horaId=? AND fecha=? ' , [nuevaInscripcion,horaZ.alumnoId, horaZ.idHorarios, ahora.format("YYYY-MM-DD")]);
        res.redirect('/asistencia');
        }
    }
    else  {
        res.redirect('/asistencia');
    }
    }
    else  {
        res.redirect('/asistencia');
    }
    break;
  case 5:
    dia = "Viernes";

    var hor =  await pool.query('SELECT DISTINCT horaInicioViernes, horaFinViernes FROM inscripciones, horarios WHERE alumnoId = ? AND idHorarios = ?', [req.user.idAlum, id] )
    var [horZ] = hor
    var  arr = horZ.horaInicioViernes.split(":")
    var base = moment(des.setHours(arr[0], arr[1], arr[2]))
    var mas30 = moment(des.setHours(arr[0], arr[1], arr[2]));
    mas30.add(30, 'm')


    if( dia == diaZ.viernes){
        if ( ahora > base && ahora < mas30){

            const condi = await pool.query ('SELECT DISTINCT IF(alumnoId = ? AND horaId = ? AND horaId = idHorarios AND presente = "Si" AND fecha = ? , "YES", "NO") AS condi FROM asistencias, horarios ORDER BY condi DESC LIMIT 1 ', [horaZ.alumnoId, horaZ.idHorarios, ahora.format("YYYY-MM-DD")])
            const [con] =  condi
            if(con.condi == "YES"){
                res.redirect('/asistencia');    
            }else{
          
            await pool.query('UPDATE asistencias set ? WHERE alumnoId=? AND horaId=? AND fecha=? ' , [nuevaInscripcion,horaZ.alumnoId, horaZ.idHorarios, ahora.format("YYYY-MM-DD")]);
            res.redirect('/asistencia');
            }
    }
    else  {
        res.redirect('/asistencia');
    }
    }
    else  {
        res.redirect('/asistencia');
    }
    break;
  default:  
    res.redirect('/asistencia');
}
}



  module.exports = {
    index: index,
    asistencia:asistencia,

  }