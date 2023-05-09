const pool = require('../database');

  function createMateria(req, res) {
    req.getConnection((err, conn) => {
      conn.query('SELECT * FROM profesores', (err, profesores) => {
        if(err) {
          res.json(err);
        }
        res.render('crear/createMateria',{profesores});
      });
    });
    }
  function storeMateria(req, res) {
    const {nombreMateria,Año,tipo_fecha,fecha_inicio,fecha_fin} = req.body;
    const data = {nombreMateria,Año};
    const fecha = {tipo_fecha,fecha_inicio,fecha_fin};
    req.getConnection((err, conn) => {
      conn.query('INSERT INTO materias SET ?', [data], (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }
        const materiaId = result.insertId; // obtiene el idMateria recién insertado
        const dataFecha = { ...fecha, materiaId }; // añade el idMateria a la información de la fecha
        conn.query('INSERT INTO fechas SET ?', [dataFecha], (err, rows) => {
          if (err) {
            return res.status(500).send(err);
          }
          res.redirect('/createMateria');
        });
      });
    });
  }


  function edit(req, res) {

    req.getConnection((err, conn) => {
      conn.query('SELECT * FROM profesores ', (err, profesores) => {
        conn.query('SELECT * FROM materias ', (err, materias) => {
        if(err) {
          res.json(err);
        }
        console.log(profesores,materias)
        res.render('crear/asignarP', { profesores, materias });
      });
    });
  });
  }

  function update(req, res) {
    const data = req.body;
    console.log(data.profeCargo)
    console.log(data.idMateria)
    req.getConnection((err, conn) => {
      conn.query('UPDATE materias SET profeCargo = ? WHERE materias.idMateria = ?', [data.profeCargo,data.idMateria], (err, rows) => {
        res.redirect('/asignarProfesor');
      });
    });
  }

  async function total(req, res) {
    const todos = await pool.query('SELECT COUNT(presente) AS todos FROM asistencias ');
    const presentes = await pool.query ('SELECT COUNT(presente) AS presentes FROM asistencias WHERE presente = "Si"; ') 
    const noDictado = await pool.query ('SELECT COUNT(presente) AS presentes FROM asistencias WHERE presente = "No hubo dictado"; ') 
    const [todos1] =  todos;
    const [presentes1] =  presentes;
    const [noDictado1] =  noDictado;
    var porcentaje = Math.trunc(((presentes1.presentes ) * 100) / (todos1.todos - noDictado1.presentes));
    res.render('materias/totales', {porcentaje});
  }

  module.exports = {
    createMateria: createMateria,
    storeMateria: storeMateria,
    edit: edit,
    update: update,
    total:total,
  }