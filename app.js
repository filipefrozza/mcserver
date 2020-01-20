//dependencias gerais
global.config = require('./config/config');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var passport = require('passport');
var shortId = require('shortid');
var path = require('path');
var favicon = require('serve-favicon');
global.logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var restful = require('node-restful');
var methodOverride = require('method-override');
var cors = require('cors');
global.nodemailer = require('nodemailer');
global.appRoot = require('app-root-path');
global.pagarmeAPI = require('pagarme');

//rotas
var index = require('./routes/index');
var usuario = require('./routes/usuario');

//sockets
var soUsuario = require('./sockets/usuario');

//inicialização do express
app.use(passport.initialize());
var passportMiddleware = require('./middleware/passport');
passport.use(passportMiddleware);
app.use(cookieParser());
app.use(express.static(__dirname));

//mongoose
mongoose.Promise = global.Promise;
mongoose.connect(config.db)
  .then(() =>  console.log('connection successful'))
  .catch((err) => console.error(err));

app.use(logger('dev'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json({type:'application/vnd.api+json'}));
app.use(methodOverride());
app.use(cookieParser());

app.use(cors());
app.use('/', index);
app.use('/api/v1/usuario', usuario);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.json(err.message);
});

//parte do socket
io.on('connection', (socket) => {
    console.log("conectado");
    socket.on('teste', (pack) => {
       console.log(pack);
    });

    soUsuario(socket);
    console.log(socket._events);
});

http.listen(process.env.PORT || 3001, () => {
    console.log('escutando a porta ' + (process.env.PORT||3001));
});
console.log('Server rodando');