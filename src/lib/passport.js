const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('./helpers');

passport.use('local.auth', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, email, password, done) => {

    let Profesor = await pool.query('SELECT * FROM profesores WHERE email = ?', [email]);
    let Coordinador = await pool.query('SELECT * FROM coordinadores WHERE email = ?', [email]);
    let Alumno = await pool.query('SELECT * FROM alumnos WHERE email = ?', [email]);

    if(Coordinador.length > 0){
      const rows = await pool.query('SELECT * FROM coordinadores WHERE email = ?', [email]);
      if (rows.length > 0) {
        const user = rows[0];
       
        const validPassword = await helpers.matchPassword(password, user.password)
        console.log(user.rol);
        console.log(validPassword)
        if (validPassword) {

          done(null, user);
        } else {
          done(null, false, {error:'Error password Incorrecto'});
        }
      } else {
        return done(null, false, {error: 'Error: usuario no existe'});
      }

    }else if(Profesor.length > 0){
      const rows = await pool.query('SELECT * FROM profesores WHERE email = ?', [email]);
      if (rows.length > 0) {
        const user = rows[0];
       
        const validPassword = await helpers.matchPassword(password, user.password)
        console.log(user.nombre);
        console.log(validPassword)
        if (validPassword) {

          done(null,user);
        } else {
          done(null, false, {error:'Error password Incorrecto'});
        }
      } else {
        return done(null, false, {error: 'Error: usuario no existe'});
      }
    }else if(Alumno.length > 0){
      const rows = await pool.query('SELECT * FROM alumnos WHERE email = ?', [email]);

      if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password)
        console.log(validPassword)
        if (validPassword) {
          done(null, user);
        } else {
          done(null, false, {error:'Error password Incorrecto'});
        }
      } else {
        return done(null, false, {error: 'Error: usuario no existe'});
      }

    }

  }));

//tener encuenta para hacer todo  usar para alumnos
passport.use('local.registrate', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const { nombre } = req.body;
    const { apellido } = req.body;
    const { rol } = req.body;
    console.log(rol);
    if (rol == "alumno"){
    const newUser = {
        nombre,
        apellido,
        email,
        password,
        rol

    };
    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO alumnos SET ?', [newUser]);
    newUser.idAlum = result.insertId;
    return  done(null, newUser);
} else if ( rol == "profesor"){

    const newUser = {
        nombre,
        apellido,
        email,
        password,
        rol

    };
    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO profesores SET ?', [newUser]);
    newUser.idProfe = result.insertId;
    return  done(null, newUser);
} else {
    const newUser = {
        nombre,
        apellido,
        email,
        password,
        rol

    };
    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO coordinadores SET ?', [newUser]);
    newUser.idCoor = result.insertId;
    return  done(null);
}    
}));



passport.serializeUser((user, done) =>{
    
  done(null, {
      id: user.idAlum,
      rol: user.rol,
      email: user.email
  });
});

passport.serializeUser((user, done) =>{
  done(null, {
     id: user.idProfe,
      rol: user.rol,
      email: user.email
  });
});

passport.serializeUser((user, done) =>{
  done(null, {
      id: user.idCoor,
       rol: user.rol,
       email: user.email
   });
});

passport.deserializeUser(async (user, done) =>{
   
  const rows = await pool.query('SELECT * FROM alumnos where email = ?' , [user.email]);
  done(null, rows[0]);
});

passport.deserializeUser(async (user, done) =>{
  
  const rows = await pool.query('SELECT * FROM profesores where email = ?' , [user.email]);
  done(null, rows[0]);
});

passport.deserializeUser(async (user, done) =>{
  
  const rows = await pool.query('SELECT * FROM coordinadores where email = ?' , [user.email]);
  done(null, rows[0]);
});


//profesor registro sin logaut
passport.use('local.registrateProfe', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done)=>{
  const {nombre,apellido, rol} =req.body;//tocar

  const newUser ={
    nombre,
    apellido,
    email,
    password,
    rol
  }
    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO profesores SET ?', [newUser]); //INSERT INTO profesores SET
    newUser.idProfe = result.insertId;
    return done(null);
     
}));
