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
    const {nombreMateria} = req.body;
    const data = {nombreMateria};

    req.getConnection((err, conn) => {
      conn.query('INSERT INTO materias SET ?', [data], (err, rows) => {

        res.redirect('/profile'); 
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
        res.redirect('/profile');
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