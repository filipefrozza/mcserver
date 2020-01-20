// var pagseguro = require('pagseguro');
var os = require("os");
var hostname = os.hostname();

// var getPagseguro = function(){
//     var conta = {
//         email : 'filipefrozza.fm@gmail.com',
//         token: 'BBF4FED3ED314578B5C31F72B816E33C'
//     }

//     if(hostname != 'localhost'){
//         conta.mode = 'sandbox';
//     }

//     var pag = new pagseguro(conta);

//     //Configurando a moeda e a referência do pedido
//     pag.currency('BRL');

//     //Configuranto URLs de retorno e de notificação (Opcional)
//     //ver https://pagseguro.uol.com.br/v2/guia-de-integracao/finalizacao-do-pagamento.html#v2-item-redirecionando-o-comprador-para-uma-url-dinamica
//     // pag.setRedirectURL("http://35.236.73.207/");
//     pag.setNotificationURL("http://35.236.73.207/api/v1/pagseguro/notificacao");

//     return pag;
// }


module.exports = {
    jwtSecret: 'mc-server',
    db: 'mongodb://localhost/mcserver',
    hostname: hostname
};