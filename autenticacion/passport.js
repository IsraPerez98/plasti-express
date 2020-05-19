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
    new LocalStrategy( { // indicamos que vamos a almacenar los datos de forma local
        //para el login necesitamos el usuario y contraseña
        usernameField: "usuario",
        passwordField: "password"
    }, 
    (nombre_usuario, password, done) => {
        //console.log("info usuario entrante: ", nombre_usuario, " ", password);
        //encontrar usuario en la db
        db.Usuario.findOne({ usuario: nombre_usuario })
        .then(usuario => {
            
            if(!usuario) { // si no se encuentra el usuario
                return done(null, false, "Usuario no existente" );
            } else { // encontramos un usuario con el mismo nombre
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