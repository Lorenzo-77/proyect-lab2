const express = require('express');
const { engine } = require('express-handlebars');
const myconnection = require('express-myconnection');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const session = require('express-session');
const passport = require('passport');
const morgan = require('morgan');
const MySQLStore = require('express-mysql-session')(session);

const loginRoutes = require('./routes/login');
const coordinadorRoutes = require('./routes/coordinador');//
const routerAlumno = require('./routes/alumnos');
const routerProfe = require('./routes/profesor');
const routerAsistencia = require('./routes/asistencia');
const { database } = require('./keys');

require('./lib/passport');

var Handlebars = require("handlebars");
var MomentHandler = require("handlebars.moment");

MomentHandler.registerHelpers(Handlebars);

const app = express();
app.set('port', 8000);// 
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

app.set('views', __dirname + '/views');
app.engine('.hbs', engine({
  extname: '.hbs',
  helpers: require('./lib/handlebars')
}));
app.set('view engine', 'hbs');

app.use(myconnection(mysql, {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'to-do' //to-do
}, 'single'));

app.use(session({
  secret: 'secret',
	resave: false,
	saveUninitialized: false,
  store: new MySQLStore(database)
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next)=>{
	app.locals.user = req.user;
	next();
});

app.listen(app.get('port'), () => {
  console.log('Listening on port ', app.get('port'));
});



app.use('/', loginRoutes);
app.use('/', coordinadorRoutes);
app.use('/', routerAlumno);
app.use('/', routerProfe);
app.use('/', routerAsistencia);

app.use(express.static(path.join(__dirname, 'public')));
