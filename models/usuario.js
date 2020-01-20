var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
  
var UsuarioSchema = new mongoose.Schema({
    login: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    senha: {
        type: String,
        required: true
    },
    cpf: {
        type: String,
        required: true,
        unique: true
    },
    nome: {
        type: String,
        required: true,
        trim: true
    },
    apelido: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true,
    },
    sexo: {
        type: String
    },
    nascimento: {
        type: Date,
        required: true
    },
    telefone: {
        type: String
    },
    cep: {
        type: String
    },
    pais: {
        type: String,
        required: true,
        default: 'Brasil'
    },
    estado: {
        type: String,
        required: true,
        default: 'RS'
    },
    cidade: {
        type: String
    },
    rua: {
        type: String
    },
    bairro: {
        type: String
    },
    numero: {
        type: String
    },
    complemento: {
        type: String
    },
    foto: {
        type: String
    },
    descricao: {
        type: String
    },
    admin: {
        type: Boolean,
        required: true,
        default: false
    },
    bloqueado: {
        type: Boolean,
        required: true,
        default: true
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    activeToken: String
});
 
UsuarioSchema.pre('save',  function(next) {
    var usuario = this;
 
     if (!usuario.isModified('senha')) return next();
 
     bcrypt.genSalt(10, function(err, salt) {
         if (err) return next(err);
 
         bcrypt.hash(usuario.senha, salt, function(err, hash) {
             if (err) return next(err);
 
             usuario.senha = hash;
             next();    
         });
     });
});
 
UsuarioSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.senha, (err, isMatch) => {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};
 
module.exports = mongoose.model('Usuario', UsuarioSchema);