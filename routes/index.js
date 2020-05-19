const express = require('express');
const router = express.Router();

const autenticarToken = require('../autenticacion/authToken.js');
        
const info_prueba = [
    {
        usuario: "USUARIO_PRUEBA",
        pruducto: "plastico1",
        cantidad: 300,
    },
    {
        usuario: "USUARIO_PRUEBA2",
        producto: "plastico2",
        cantidad: 200,
    }
];

router.get('/prueba/', autenticarToken , function(req, res, next) {
    //console.log(base);
    return res.json(info_prueba.filter(producto => producto.usuario == req.usuario.nombre));
    //return res.json(info_prueba);
    //return res.send('Received a GET HTTP method');
});


module.exports = router;
