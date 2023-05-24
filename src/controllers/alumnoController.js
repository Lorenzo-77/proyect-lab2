////// ITEMS //////🦖🦖🦖

function index(req, res) {
    req.getConnection((err, conn) => {
      req.getConnection((err, conn) => {
        conn.query(`SELECT DISTINCT
        materias.idMateria,
        materias.nombreMateria,
        horariosdetalles.dia,
        horariosdetalles.hora_inicio,
        horariosdetalles.hora_fin,
        profesores.nombre,
        profesores.apellido,
        horarios.idhorarios,
        alumnos.id
      FROM
        horarios
        JOIN materias ON materias.idMateria = horarios.materiasID
        JOIN horariosdetalles ON horariosdetalles.idHorario = horarios.idhorarios
        JOIN profesores ON profesores.id = materias.profeCargo
        JOIN alumnos ON alumnos.id = ?
      WHERE
        NOT EXISTS (
          SELECT *
          FROM inscripciones
          WHERE inscripciones.idAlumno = alumnos.id
            AND inscripciones.materiaId = horarios.idhorarios
            AND inscripciones.valAlumno = 'Valido'
        )  `, [req.user.id], (err, horario) => {

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
          res.render('materias/verMaterias', { materiasArr });
        });
      });
    });
}

  function inscribir(req, res) {
    const {id} = req.params;
    console.log(id);
    req.getConnection((err, conn) => {
      conn.query('SELECT * FROM item WHERE id = ? ', [id], (err, item) => {
        conn.query('SELECT * FROM lista WHERE idUser = ?',[req.user.id], (err, lista) => {
        if(err) {
          res.json(err);
        }
        res.render('tasks/edit-add', { item, lista });
      });
    });
  });
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
  

  module.exports = {
    index: index,
    inscribir: inscribir,
    store: store,

  }