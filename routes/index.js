var express         = require('express'),
    routes          = express.Router();

routes.get('/', (req, res) => {
    return res.status(200).json({
        'Título': 'MC Server'
    });
});

module.exports = routes;