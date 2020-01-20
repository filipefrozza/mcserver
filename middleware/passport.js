var Usuario        = require('../models/usuario');
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt  = require('passport-jwt').ExtractJwt;
 
var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret
}
 
module.exports = new JwtStrategy(opts, function (jwt_payload, done) {
    Usuario.findById(jwt_payload.id, function (err, usuario) {
        if (err) {
            return done(err, false);
        }
        if (usuario) {
            return done(null, usuario);
        } else {
            return done(null, false);
        }
    });
});