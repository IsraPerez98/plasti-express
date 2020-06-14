//Este archivo es para obtener datos desde la base de datos mediante la api

const express = require('express');
const router = express.Router();

const autenticarToken = require('../autenticacion/authToken.js');
const db = require('../base_datos/base_datos');

router.get('/productos/', autenticarToken , function(req, res, next) {
    // listar los productos existentes
    db.Producto.find({}, function(err,productos) {
        if(err) {
            console.log(err);
            return res.send(500).send(err);
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
            return res.send(err);
        }

        res.json(clientes);
        
    })
})

router.get('/proveedores/', autenticarToken, function(req, res, next) {
    //listar proveedores
    db.Proveedor.find({}, function(err,proveedores) {
        if(err){
            console.log(err);
            return res.send(err);
        }

        res.json(proveedores);
        
    })
})








module.exports = router;