const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const db = require("../base_datos/base_datos.js"); // este archivo tiene el modelo del usuario como se almacena el la DB
const passport = require("../autenticacion/passport.js"); // este archivo tiene la config de como se procesa el login del usuario y como se busca en la DB y se compara las constraseñas
const autenticarToken = require('../autenticacion/authToken.js'); // este archivo tiene una funcion para comprobar que el token que entrega un usuario es valido

const router = express.Router();

router.post("/token", function (req, res) { // genera un token de acceso nuevo para el usuario
    const tokenRefresco = req.body.token; // el usuario entrega el token de refresco
    if (tokenRefresco == null) return res.sendStatus(401);
    const query = db.RefreshTokenJWT.find({ token: tokenRefresco }); // llamamos a la base mongoDB para ver si el token de refresco es valido
    query.exec(function (err, docs) {
        if (err) return res.sendStatus(500); // si el sv no conecta tiramos err 500
        if (docs.length == 0) return res.sendStatus(403); // si no se encuentra ningun token igual en la db, es invalido
        
        jwt.verify(tokenRefresco, process.env.REFRESCO_TOKEN_SECRETO, function ( // comprobamos que el token es valido, con el token del archivo .env
            err,
            usuario
        ) {
            // generamos un nuevo token de acceso
            if (err) return res.sendStatus(403);
            const tokenAcceso = generarTokenAcceso({ nombre: usuario.nombre });
            res.json({ tokenAcceso: tokenAcceso }); // se lo enviamos al usuario
        });
    });
});

router.delete("/logout", function (req, res) { 
    // al momento de hacer logout se invalida el token de refresco
    db.RefreshTokenJWT.deleteOne({ token: req.body.token }, function (err) { // borramos el token de la base de datos
        if (err) return res.sendStatus(500); // implementar algo mejor para estos errores
        res.sendStatus(204);
    });
});

router.post("/login", function (req, res, next) { // el usuario intenta logearse con su usuario y contraseña
    passport.authenticate("local", function (err, usuario, info) { // pasamos la info a passport (ver archivo autenticacion/passport.js)
    
        //console.log("return passport:", err, usuario, info);
        if (err) {
            return res.status(500).send({ errors: err });
        }

        if (!usuario) { // si passport no devuelve un usuario
            return res
                .status(400)
                .send({ errors: "Usuario no valido", info: {message: info} });
        }

        req.logIn(usuario, function (err) {
            if (err) {
                return res.status(500).send({ errors: err });
            }
            // aqui tenemos toda la info del usuario basado en base_datos.Usuario en usuario
            //console.log("info usuario", usuario);

            const datos_usuarios_jwt = { // los datos del usuario que iran en los tokens
                nombre: usuario.nombre,
                usuario: usuario.usuario,
            };

            //generamos los tokens para darselos al usuario
            const tokenAcceso = generarTokenAcceso(datos_usuarios_jwt);
            const tokenRefresco = jwt.sign(
                datos_usuarios_jwt,
                process.env.REFRESCO_TOKEN_SECRETO
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
});


router.post("/registrar", autenticarToken, function (req, res, next) {
    //funcion para crear un nuevo usuario, se requiere que un usuario anterior registre a otro
    //para crear el usuario inicial, cambiar a MODO_INSEGURO=true en archivo .env
    //ver archivo (autenticacion/authToken.js)

    const nuevoUsuario = new db.Usuario({ // creamos el nuevo usuario en mongoose
        usuario: req.body.usuario,
        nombre: req.body.nombre,
        password: req.body.password,
    });
    //por seguridad la contraseña no se guarda como texto simple, se aplica criptografia
    //ponemos el hash a la clave antes de guardarla en la DB
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(nuevoUsuario.password, salt, (err, hash) => {
            if (err) throw err;
            nuevoUsuario.password = hash; // seteamos el hash a la contraseña guardada
            nuevoUsuario
                .save()
                .then((usuario) => {
                    return res.status(200).send("Usuario Creado"); //OK
                })
                .catch((err) => {
                    return res.status(500).send(err);
                });
        });
    });
});

function generarTokenAcceso(usuario) {  // funcion que genera nuevo token de acceso dado los datos de un usuario
    return jwt.sign(usuario, process.env.ACCESO_TOKEN_SECRETO, {
        expiresIn: "15m", // expira en 15 minutos
    });
}



module.exports = router;
