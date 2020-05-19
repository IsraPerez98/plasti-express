const mongoose = require('mongoose');

//datos de esto se escriben en el archivo .env, ver documentacion dotenv'
//var mongoDB = `mongodb://${process.env.MONGODB_USUARIO}:${process.env.MONGODB_CONTRASENA}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PUERTO}/${process.env.MONGODB_DATABASE}`;
// no vamos a considerar usuario y contraseña todavia
const mongoDB = `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PUERTO}/${process.env.MONGODB_DATABASE}`;
console.log(mongoDB);
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

//Get the default connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


//MODELOS


//modelo de los tokens de refresco
const refreshTokensJWTSchema = new mongoose.Schema( {
    token: String
}); // los tokens de refresco de JWT (ver autenticacion.js)

const RefreshTokenJWT = mongoose.model('RefreshTokenJWT', refreshTokensJWTSchema);


//modelo de los usuarios
const usuarioSchema = new mongoose.Schema( {
    nombre: { //el nombre formal del usuario
        type: String 
    },
    usuario: { // el nombre que se usa pal login
        type: String, 
        unique: true,
        required: true
    },
    password: { // la clave
        type: String,
        required: true
    },
    fecha_creacion: { // fecha en la que se creo el usuario
        type: Date, 
        default: Date.now
    }
     
}, { strict: false } ); // strict false para meter login externo despues

const Usuario = mongoose.model("Usuario", usuarioSchema);

//TODO: ingresar modelo de la base de datos del negocio

module.exports = {RefreshTokenJWT, Usuario};