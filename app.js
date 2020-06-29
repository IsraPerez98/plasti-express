require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');

const autenticacion = require('./routes/registro_login');
const api_get = require('./routes/api_get');
const api_delete = require('./routes/api_delete');
const ingresarNuevos = require('./routes/ingresar_nuevos');
const transacciones = require('./routes/transacciones');
//var usersRouter = require('./routes/users');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/get/', api_get);
app.use('/api/delete', api_delete);
app.use('/api/transaccion/', transacciones);
app.use('/api/nuevo/', ingresarNuevos);
app.use('/autenticacion/', autenticacion);
//app.use('/users', usersRouter);

module.exports = app;
