const express = require('express');
//const base = require('./base_datos.js');
const router = express.Router();

const jwt = require('jsonwebtoken');


let tokensRefresco = []; // cambiar esto a mongoDB

router.post('/token', function(req, res) {
    const tokenRefresco = req.body.token;
    if (tokenRefresco == null) return res.sendStatus(401);
    if (!tokensRefresco.includes(tokenRefresco)) return res.sendStatus(403);
    jwt.verify(tokenRefresco, process.env.REFRESCO_TOKEN_SECRETO, function(err, usuario) {
        if (err) return res.sendStatus(403);
        const tokenAcceso = generarTokenAcceso( {nombre: usuario.nombre} );
        res.json({ tokenAcceso: tokenAcceso });
    })
})

router.delete("/logout", function(req, res) {
    tokensRefresco = tokensRefresco.filter(token => token !== req.body.token); //cambiar a mongoDB
    res.sendStatus(204);
})

router.post('/login', function(req, res, next) {
    const nombre_usuario = req.body.usuario;
    const usuario = {nombre: nombre_usuario};

    const tokenAcceso = generarTokenAcceso(usuario);
    const tokenRefresco = jwt.sign(usuario, process.env.REFRESCO_TOKEN_SECRETO);
    tokensRefresco.push(tokenRefresco); // cambiar a mongoDB
    res.json({ tokenAcceso: tokenAcceso, tokenRefresco: tokenRefresco});
})

function generarTokenAcceso(usuario) {
    return  jwt.sign(usuario, process.env.ACCESO_TOKEN_SECRETO, {expiresIn: "15m"} );
}


module.exports = router;
