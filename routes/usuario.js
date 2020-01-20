var express         = require('express'),
    routes          = express.Router();
var usuarioController  = require('../controller/usuario');
var passport     = require('passport');
const path = require("path");
const multer = require("multer");
var requireAdmin = require('../middleware/requireAdmin');

const storage = multer.diskStorage({
   destination: "./public/uploads/",
   filename: function(req, file, cb){
      cb(null,"IMAGE-" + Date.now() + path.extname(file.originalname));
   }
});

const upload = multer({
   storage: storage,
   limits:{fileSize: 1000000},
}).single("myImage");
 
// routes.get('/', (req, res) => {
//     return res.send('[]');
// });

routes.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    if(requireAdmin(req,res)){
        usuarioController.getAll(req,res);
    }
});
 
routes.post('/register', usuarioController.register);

routes.put('/edit', passport.authenticate('jwt', { session: false }), (req, res) => {
    usuarioController.edit(req, res);
});

routes.post('/login', usuarioController.login);
 
routes.get('/check', passport.authenticate('jwt', { session: false }), (req, res) => {
    // return res.json({ msg: `${req.user.usuario} você está logado.` });
    usuario = req.user;
    usuario.senha = undefined;
    usuario.resetPasswordExpires = undefined;
    usuario.resetPasswordToken = undefined;
    return res.json(usuario);
});

routes.post("/upload", (req, res) => {
    upload(req, res, (err) => {
        console.log("Request ---", req.body);
        console.log("Request file ---", req.file);//Here you get file.
        /*Now do where ever you want to do*/
        if(!err)
          return res.sendStatus(200).end();
    });
});

routes.post('/forgot', usuarioController.forgotPassword);

routes.post('/check-token', usuarioController.checkForgotToken);

routes.post('/reset', usuarioController.resetForgotPassword);

routes.put('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    if(requireAdmin(req,res)){
        usuarioController.alterar(req,res);
    }
});

routes.delete('/:id', usuarioController.deletar);
 
module.exports = routes;