const bcrypt = require('bcryptjs');
const db = require('../base_datos/base_datos.js');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((usuario,done) =>{ // retorna un id, dado un usuario
    done(null, usuario.id);
})

passport.deserializeUser((id,done) =>{ // retorna un usuario dado un id
    db.Usuario.findById(id, (err,usuario) => { // buscamos en la base de datos el id
        done(err, usuario);
    })
})

passport.use( 
    new LocalStrategy( {
        usernameField: "usuario",
        passwordField: "password"
    }, 
    (nombre_usuario, password, done) => {
        //encontrar usuario en la db
        console.log("info usuario entrante: ", nombre_usuario, " ", password);
        db.Usuario.findOne({ usuario: nombre_usuario })
        .then(usuario => {
            
            if(!usuario) { // si no existe el usuario
                return done(null, false, "Usuario no existente" )
            } else { // retornamos un usuario ya creado
                // buscamos que los hash de las contraseñas sean iguales
                bcrypt.compare(password, usuario.password, (err, son_iguales) => {
                    if (err) throw err;

                    if (son_iguales) {
                        return done(null, usuario);
                    } else {
                        return done(null, false, "Clave invalida" );
                    }
                });
            }
        })
        .catch( err => {
            return done(err, false, { message: err } );
        });
    })
);

module.exports = passport;