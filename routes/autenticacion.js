const express = require('express');
const db = require('./base_datos.js');
const router = express.Router();

const jwt = require('jsonwebtoken');


router.post('/token', function(req, res) {
    const tokenRefresco = req.body.token;
    if (tokenRefresco == null) return res.sendStatus(401);
    //if (!tokensRefresco.includes(tokenRefresco)) return res.sendStatus(403);
    const query = db.RefreshTokenJWT.find({ token: tokenRefresco })// llamamos a la base mongoDB para ver si el token de refresco es valido
    query.exec( function(err, docs) {  
        if(err) return res.sendStatus(500); // si el sv no conecta tiramos err 500
        if(docs.length == 0) return res.sendStatus(403); // si no se encuentra ningun token igual en la db, es invalido
        jwt.verify(tokenRefresco, process.env.REFRESCO_TOKEN_SECRETO, function(err, usuario) { // generamos un nuevo token de acceso
            if (err) return res.sendStatus(403);
            const tokenAcceso = generarTokenAcceso( {nombre: usuario.nombre} );
            res.json({ tokenAcceso: tokenAcceso });
        })
    })
})

router.delete("/logout", function(req, res) {
    
    db.RefreshTokenJWT.deleteOne({token: req.body.token}, function(err){ // borramos el token de la base de datos

            if(err) return res.sendStatus(500); // implementar algo mejor para estos errores
            res.sendStatus(204);
    }); 
})

router.post('/login', function(req, res, next) {
    const nombre_usuario = req.body.usuario;
    const usuario = {nombre: nombre_usuario};

    const tokenAcceso = generarTokenAcceso(usuario);
    const tokenRefresco = jwt.sign(usuario, process.env.REFRESCO_TOKEN_SECRETO);

    //guardamos el tokenRefresco en la db
    let tokenRefrescodb = new db.RefreshTokenJWT({token: tokenRefresco});
    tokenRefrescodb.save(function(err) {
        if(err) res.sendStatus(500); // implementar algo mas seguro si es que no se guarda bien
        res.json({ tokenAcceso: tokenAcceso, tokenRefresco: tokenRefresco});
    })
})

function generarTokenAcceso(usuario) {
    return  jwt.sign(usuario, process.env.ACCESO_TOKEN_SECRETO, {expiresIn: "15m"} );
}


module.exports = router;
