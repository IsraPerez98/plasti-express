const express = require('express');
//const base = require('./base_datos.js');
const router = express.Router();

const jwt = require('jsonwebtoken');
        
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



function autenticarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); // sin token, no autorizado

    jwt.verify(token, process.env.ACCESO_TOKEN_SECRETO, function(err, usuario) {
        if (err) {
            console.log(err);
            return res.sendStatus(403) // sin permisos, no autorizado
        }
        req.usuario = usuario;
        next();
    })
}


module.exports = router;
