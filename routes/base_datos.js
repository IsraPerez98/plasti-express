//Import the mongoose module
const mongoose = require('mongoose');

//Set up default mongoose connection

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


const refreshTokensJWTSchema = new mongoose.Schema( {
    token: String
}); // los tokens de refresco de JWT (ver autenticacion.js)

const RefreshTokenJWT = mongoose.model('RefreshTokenJWT', refreshTokensJWTSchema);

module.exports = {RefreshTokenJWT};
