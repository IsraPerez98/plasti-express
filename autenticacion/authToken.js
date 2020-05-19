const jwt = require("jsonwebtoken");


function autenticarToken(req, res, next) { // comprobar si un token enviado por el usuario es valido

    if(process.env.MODO_INSEGURO === "true") return next(); // modo inseguro se acepta todo

    const authHeader = req.headers["authorization"]; // buscamos el token en el header
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) return res.sendStatus(401); // sin token, no autorizado

    jwt.verify(token, process.env.ACCESO_TOKEN_SECRETO, function ( // comparamos con el token en .env
        err,
        usuario
    ) {
        if (err) {
            console.log(err);
            return res.sendStatus(403); // sin permisos, no autorizado
        }
        req.usuario = usuario;
        next();
    });
}

module.exports = autenticarToken;