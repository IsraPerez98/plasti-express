//Este archivo es para obtener datos desde la base de datos mediante la api

const express = require('express');
const router = express.Router();

const autenticarToken = require('../autenticacion/authToken.js');
const db = require('../base_datos/base_datos');

const db_usuarios = require('../base_datos/usuarios');

router.get('/productos/', autenticarToken , function(req, res, next) {
    // listar los productos existentes
    db.Producto.find({}, function(err,productos) {
        if(err) {
            console.log(err);
            return res.sendStatus(500).send(err);
        }

        //console.log(productos);
        res.json(productos);

    })
});

router.get('/clientes/', autenticarToken, function(req, res, next) {
    //listar clientes
    db.Cliente.find({}, function(err,clientes) {
        if(err){
            console.log(err);
            res.sendStatus(500).send(err);
        }

        res.json(clientes);
        
    })
});

router.get('/proveedores/', autenticarToken, function(req, res, next) {
    //listar proveedores
    db.Proveedor.find({}, function(err,proveedores) {
        if(err){
            console.log(err);
            return res.sendStatus(500).send(err);
        }

        res.json(proveedores);
        
    })
});


router.get('/usuarios/', autenticarToken, async function(req, res, next) {
    //listar usuarios
    try {
        const usuarios = await db_usuarios.Usuario.find().select('-password'); // sin obtener la password
        return res.json(usuarios);
    } catch(err) {
        console.log(err);
        return res.sendStatus(500).send(err);
    }

});



router.get('/registrosventas/', autenticarToken, async function(req, res, next) {
    try {
        const registrosventas = await db.RegistroVende.find();
        return res.json(registrosventas);
    } catch(err) {
        console.log(err);
        return res.sendStatus(500).send(err);
    }
});

router.get('/registroscompras/', autenticarToken, async function(req, res, next) {
    try {
        const registroscompras = await db.RegistroCompra.find();
        return res.json(registroscompras);
    } catch(err) {
        console.log(err);
        return res.sendStatus(500).send(err);
    }
});



module.exports = router;