const jwt = require("jsonwebtoken");
function autenticarToken(req, res, next) {

    if(process.env.MODO_INSEGURO === "true") next(); // modo inseguro se acepta todo

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) return res.sendStatus(401); // sin token, no autorizado

    jwt.verify(token, process.env.ACCESO_TOKEN_SECRETO, function (
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