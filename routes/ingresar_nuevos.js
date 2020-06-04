//Este archivo es para ingresar nuevos datos a la base de datos mediante la api

const express = require('express');
const router = express.Router();

const autenticarToken = require('../autenticacion/authToken.js');
const db = require('../base_datos/base_datos');

router.post('/material/', autenticarToken , function(req, res, next) {
    // nuevo material ingresado
    const nombre = req.body.nombre; // el nombre del material que ingresa el usuario
    if (nombre == null) return res.status(400).send("Falta el nombre del material");
    const material_nuevo = new db.Material({ nombre: nombre }); // se crea el nuevo objeto
    material_nuevo.save(function (err) { // se guarda en la db
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        return res.sendStatus(200); //ok
    });
});

router.post('/unidadmedida/', autenticarToken , function(req, res, next) {
    // nueva unidad de medida
    const nombre = req.body.nombre; // el nombre de la unidad de medida
    if (nombre == null) return res.status(400).send("Falta el nombre de la unidad de medida");
    const medida_nueva = new db.UnidadMedida({ nombre: nombre }); // se crea el nuevo objeto
    medida_nueva.save(function (err) { // se guarda en la db
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        return res.sendStatus(200); //ok
    });
});

router.post('/producto/', autenticarToken , function(req, res, next) {
    // nuevo producto
    const nombre = req.body.nombre; // el nombre del producto
    const material = req.body.material;
    const precio_venta = req.body.precio;
    const contenido = req.body.contenido;
    const unidad_medida = req.body.unidad_medida;

    if (nombre == null) return res.status(400).send("Falta el nombre del producto");
    if (material == null) return res.status(400).send("Falta el material");
    if (precio_venta == null) return res.status(400).send("Falta el precio de venta");
    if (unidad_medida == null) return res.status(400).send("Falta la unidad de medida");

    // el precio debe ser un numero
    if(isNaN(precio_venta)) return res.status(400).send("El precio debe ser un numero");

    //buscamos que el material exista en la db
    db.Material.findOne({nombre: material}, function(err, obj_mat) {
        if(err) {
            console.log(err);
            return res.status(500).send(err);
        }
        if(obj_mat == null) res.status(400).send("Material", material, " no existe en la base de datos");

        //buscamos que la unidad de medida exista en la db
        db.UnidadMedida.findOne({nombre: unidad_medida}, function(err2, obj_medida) {
            if(err2) {
                console.log(err2);
                return res.status(500).send(err2);
            }
            if(obj_medida == null) res.status(400).send("Unidad de medida ", unidad_medida, " no existe en la base de datos");

            // creamos el nuevo producto
            const producto_nuevo = new db.Producto({
                nombre: nombre,
                material: obj_mat,
                precio_venta: precio_venta,
                contenido: contenido,
                unidad_medida: obj_medida,
            });

            producto_nuevo.save( function(err3) { //guardado
                if(err3) {
                    console.log(err3);
                    return res.status(500).send(err3);
                }
                return res.sendStatus(200); // OK
            } );
        })
    });

});

router.post('/cliente/', autenticarToken , function(req, res, next) {
    // nuevo cliente
    const rut = req.body.rut; // el rut del cliente
    const nombre = req.body.nombre;
    const telefono = req.body.telefono;
    const email = req.body.email;
    const direccion = req.body.direccion;

    if (rut == null) return res.status(400).send("Falta el rut del cliente");

    const cliente_nuevo = new db.Cliente({ // se crea el nuevo objeto
        rut: rut,
        nombre: nombre,
        telefono: telefono,
        email: email,
        direccion: direccion,
    }); 
    cliente_nuevo.save(function (err) { // se guarda en la db
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        return res.sendStatus(200); //ok
    });
});

router.post('/proveedor/', autenticarToken , function(req, res, next) {
    // nuevo proveedor
    const rut = req.body.rut;
    const nombre = req.body.nombre;
    const telefono = req.body.telefono;
    const email = req.body.email;
    const direccion = req.body.direccion;

    if (rut == null) return res.status(400).send("Falta el rut del proveedor");

    const proveedor_nuevo = new db.Proveedor({ // se crea el nuevo objeto
        rut: rut,
        nombre: nombre,
        telefono: telefono,
        email: email,
        direccion: direccion,
    }); 
    proveedor_nuevo.save(function (err) { // se guarda en la db
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        return res.sendStatus(200); //ok
    });
});

// TODO: deberiamos hacer estos tambien?
//router.post('/registrocompra/', autenticarToken , function(req, res, next) {});
//router.post('/registrovende/', autenticarToken , function(req, res, next) {});

//router.post('/compra/', autenticarToken , function(req, res, next) {});
//router.post('/vende/', autenticarToken , function(req, res, next) {});

module.exports = router;