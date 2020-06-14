// este archivo maneja las transacciones, compras, ventas, etc
const express = require('express');
const router = express.Router();

const autenticarToken = require('../autenticacion/authToken.js');
const db = require('../base_datos/base_datos');

router.post('/compra/', autenticarToken , function(req, res, next) {
    // nueva compra hecha
    const proveedor = req.body.proveedor; // objectID del proveedor
    const producto = req.body.producto;  // objectID del producto
    const cantidad = req.body.cantidad;
    const precio = req.body.precio;

    if(proveedor === null || proveedor === "") return res.status(400).send("Falta el objectID del proveedor");
    if(producto === null || producto === "") return res.status(400).send("Falta el objectID del producto");
    if(cantidad === null || cantidad === "") return res.send(400).send("Falta la cantidad de la compra");
    if(precio === null || precio === "") return res.send(400).send("Falta el precio de la compra");

    if(isNaN(cantidad)) return res.status(400).send("La cantidad debe ser un numero");
    if(isNaN(precio)) return res.status(400).send("El precio de la compra debe ser un numero");

    //creamos la instancia de "Compra" y "Registro Compra"

    //obtenemos el proveedor
    db.Proveedor.findById(proveedor, function (err, proveedor_obj) { // buscamos el proveedor por id
        if(err) {
            console.log(err);
            return res.status(500).send(err);
        };
        if(proveedor_obj === null) return res.status(400).send(`Proveedor ${proveedor} no existe en la base de datos`);

        //obtenemos el producto
        db.Producto.findById(producto, function(err, producto_obj) {
            if(err){
                console.log(err);
                return res.status(500).send(err);
            };
            if(producto_obj === null) return res.status(400).send(`Producto ${producto} no existe en la base de datos`);

            //creamos el obj Compra
            const compra_nueva = new db.Compra({
                proveedor: proveedor_obj,
                fecha: Date.now(), // fecha actual
            });

            //guardamos la compra en la db
            compra_nueva.save(function (err) {
                if(err) {
                    console.log(err);
                    return res.status(500).send(err);
                }

                //generamos el nuevo registro de compra
                const registro_compra_nuevo = new db.RegistroCompra({
                    compra: compra_nueva,
                    producto: producto_obj,
                    cantidad: cantidad,
                    precio: precio,
                });

                //guardamos el registro en la db
                registro_compra_nuevo.save(function(err){
                    if(err) {
                        console.log(err);
                        return res.status(500).send(err);
                    }

                    return res.sendStatus(200); //OK
                });

            });
        });

    });

});


router.post('/venta/', autenticarToken , function(req, res, next) {
    // nueva venta hecha
    const cliente = req.body.cliente; // objectID del cliente
    const producto = req.body.producto;  // objectID del producto
    const cantidad = req.body.cantidad;
    const precio = req.body.precio;

    if(cliente === null || cliente === "") return res.status(400).send("Falta el objectID del cliente");
    if(producto === null || producto === "") return res.status(400).send("Falta el objectID del producto");
    if(cantidad === null || cantidad === "") return res.send(400).send("Falta la cantidad de la venta");
    if(precio === null || precio === "") return res.send(400).send("Falta el precio de la venta");

    if(isNaN(cantidad)) return res.status(400).send("La cantidad debe ser un numero");
    if(isNaN(precio)) return res.status(400).send("El precio de la venta debe ser un numero");

    //creamos la instancia de "Vende" y "Registro Vende"

    //obtenemos el cliente
    db.Cliente.findById(cliente, function (err, cliente_obj) { // buscamos el cliente por id
        if(err) {
            console.log(err);
            return res.status(500).send(err);
        };
        if(cliente_obj === null) return res.status(400).send(`Cliente ${cliente} no existe en la base de datos`);

        //obtenemos el producto
        db.Producto.findById(producto, function(err, producto_obj) {
            if(err){
                console.log(err);
                return res.status(500).send(err);
            };
            if(producto_obj === null) return res.status(400).send(`Producto ${producto} no existe en la base de datos`);

            //creamos el obj Vende
            const vende_nuevo = new db.Vende({
                cliente: cliente_obj,
                fecha: Date.now(), // fecha actual
            });

            //guardamos la venta en la db
            vende_nuevo.save(function (err) {
                if(err) {
                    console.log(err);
                    return res.status(500).send(err);
                }

                //generamos el nuevo registro de vende
                const registro_vende_nuevo = new db.RegistroVende({
                    vende: vende_nuevo,
                    producto: producto_obj,
                    cantidad: cantidad,
                    precio: precio,
                });

                //guardamos el registro en la db
                registro_vende_nuevo.save(function(err){
                    if(err) {
                        console.log(err);
                        return res.status(500).send(err);
                    }

                    return res.sendStatus(200); //OK
                });

            });
        });

    });

});


module.exports = router;
