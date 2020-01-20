var usuario = require('../controller/usuario');

module.exports = (socket) => {
    socket.on('login',(user) => {
        usuario.login({body: JSON.parse(user)},false,(retorno) => {
            console.log('retorno', retorno);
            socket.emit('login_response', retorno);
        });
    });
};