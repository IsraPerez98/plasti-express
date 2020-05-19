const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const db = require("../base_datos/base_datos.js");
const passport = require("../autenticacion/passport.js");
const autenticarToken = require('../autenticacion/authToken.js');

const router = express.Router();

router.post("/token", function (req, res) {
    const tokenRefresco = req.body.token;
    if (tokenRefresco == null) return res.sendStatus(401);
    //if (!tokensRefresco.includes(tokenRefresco)) return res.sendStatus(403);
    const query = db.RefreshTokenJWT.find({ token: tokenRefresco }); // llamamos a la base mongoDB para ver si el token de refresco es valido
    query.exec(function (err, docs) {
        if (err) return res.sendStatus(500); // si el sv no conecta tiramos err 500
        if (docs.length == 0) return res.sendStatus(403); // si no se encuentra ningun token igual en la db, es invalido
        jwt.verify(tokenRefresco, process.env.REFRESCO_TOKEN_SECRETO, function (
            err,
            usuario
        ) {
            // generamos un nuevo token de acceso
            if (err) return res.sendStatus(403);
            const tokenAcceso = generarTokenAcceso({ nombre: usuario.nombre });
            res.json({ tokenAcceso: tokenAcceso });
        });
    });
});

router.delete("/logout", function (req, res) {
    db.RefreshTokenJWT.deleteOne({ token: req.body.token }, function (err) {
        // borramos el token de la base de datos

        if (err) return res.sendStatus(500); // implementar algo mejor para estos errores
        res.sendStatus(204);
    });
});

router.post("/login", function (req, res, next) {
    passport.authenticate("local", function (err, usuario, info) {
        // llamamos a passport para ver si los datos q ingresa el usuario son validos
        console.log("return passport:", err, usuario, info);
        if (err) {
            return res.status(500).send({ errors: err });
        }

        if (!usuario) {
            return res
                .status(400)
                .send({ errors: "Usuario no valido", info: info });
        }

        req.logIn(usuario, function (err) {
            if (err) {
                return res.status(500).send({ errors: err });
            }
            // aqui tenemos toda la info del usuario basado en base_datos.Usuario en usuario
            console.log("info usuario", usuario);

            const datos_usuarios_jwt = {
                nombre: usuario.nombre,
                usuario: usuario.usuario,
            };

            //generamos los tokens para darselos al usuario
            const tokenAcceso = generarTokenAcceso(datos_usuarios_jwt);
            const tokenRefresco = jwt.sign(
                datos_usuarios_jwt,
                process.env.REFRESCO_TOKEN_SECRETO
            );
            console.log(
                "login: ",
                datos_usuarios_jwt,
                "token acceso: ",
                tokenAcceso,
                " token refresco: ",
                tokenRefresco
            );

            //guardamos el token de refreso en monogodb
            let tokenRefrescodb = new db.RefreshTokenJWT({
                token: tokenRefresco,
            });
            tokenRefrescodb.save(function (err) {
                if (err) {
                    res.tatus(500).send({ errors: err });
                } // implementar algo mas seguro si es que no se guarda bien

                //si todo sale bien, mandamos respuesta al usuario con sus tokens
                return res.json({
                    tokenAcceso: tokenAcceso,
                    tokenRefresco: tokenRefresco,
                });
            });
        });
    })(req, res, next);

    /*
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
    */
});

//router.post("/registrar", function (req, res, next) { // reemplazar para crear usuario sin problemas
router.post("/registrar", autenticarToken, function (req, res, next) {

    const nuevoUsuario = new db.Usuario({
        usuario: req.body.usuario,
        nombre: req.body.nombre,
        password: req.body.password,
    });
    //ponemos el hash a la clave antes de guardarla en la DB, por seguridad
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(nuevoUsuario.password, salt, (err, hash) => {
            if (err) throw err;
            nuevoUsuario.password = hash; // seteamos el hash a la contraseña guardada
            nuevoUsuario
                .save()
                .then((usuario) => {
                    return res.status(200); //OK
                    //return done(null, usuario); // retornamos el nuevo usuario creado
                })
                .catch((err) => {
                    return res.status(500).send(err);
                    //return done(null, false, { message: err });
                });
        });
    });
});

function generarTokenAcceso(usuario) {
    return jwt.sign(usuario, process.env.ACCESO_TOKEN_SECRETO, {
        expiresIn: "15m",
    });
}



module.exports = router;
