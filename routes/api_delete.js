//Este archivo es para eliminar datos de la base de datos mediante la api

const express = require('express');
const router = express.Router();

const autenticarToken = require('../autenticacion/authToken.js');
const db = require('../base_datos/base_datos');

router.delete('/cliente/', autenticarToken , async function(req, res, next) {
    const cliente = req.body.cliente; // objectID del cliente

    if(!(cliente)) return res.status(400).send("Falta el objectID del cliente");
    
    try {
        const eliminado = await db.Cliente.remove({ _id: cliente }, { single: true } );

        if(eliminado.deletedCount >= 1) {
            console.log(eliminado);

            return res.sendStatus(200); //OK
        } else {
            return res.status(400).send(`Cliente ${cliente} no existe en la base de datos`);
        }
    } catch(err) {
        console.log(err);
        return res.status(500).send(err);
    }

});

router.delete('/proveedor/', autenticarToken , async function(req, res, next) {
    const proveedor = req.body.proveedor; // objectID del proveedor

    if(!(proveedor)) return res.status(400).send("Falta el objectID del proveedor");
    
    try {
        const eliminado = await db.Proveedor.remove({ _id: proveedor }, { single: true } );

        if(eliminado.deletedCount >= 1) {
            console.log(eliminado);

            return res.sendStatus(200); //OK
        } else {
            return res.status(400).send(`Proveedor ${proveedor} no existe en la base de datos`);
        }
    } catch(err) {
        console.log(err);
        return res.status(500).send(err);
    }

});

router.delete('/producto/', autenticarToken , async function(req, res, next) {
    const producto = req.body.producto; // objectID del producto

    if(!(producto)) return res.status(400).send("Falta el objectID del producto");
    
    try {
        const eliminado = await db.Producto.remove({ _id: producto }, { single: true } );

        if(eliminado.deletedCount >= 1) {
            console.log(eliminado);

            return res.sendStatus(200); //OK
        } else {
            return res.status(400).send(`Producto ${producto} no existe en la base de datos`);
        }
    } catch(err) {
        console.log(err);
        return res.status(500).send(err);
    }

});



module.exports = router;