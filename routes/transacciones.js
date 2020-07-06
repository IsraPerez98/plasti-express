// este archivo maneja las transacciones, compras, ventas, etc
const express = require('express');
const router = express.Router();

const autenticarToken = require('../autenticacion/authToken.js');
const db = require('../base_datos/base_datos');

router.post('/venta/', autenticarToken, async function(req, res, netx) {
    // nueva venta hecha
    const cliente = req.body.cliente; // objectID del cliente
    const datos_productos = req.body.datos_productos;
    /*
    datos productos es un arreglo con:
    [n].producto
    [n].cantidad
    [n].precio
    */

    if(!(cliente) || cliente === "") return res.status(400).send("Falta el objectID del cliente");
    if(!(datos_productos) || datos_productos.length === 0) return res.status(400).send("Faltan los datos de los productos vendidos");
    
    
    //buscamos el cliente en la DB
    const cliente_obj = await db.Cliente.findById(cliente)
    .exec()
    .catch((err) => {
        console.log(err);
        return res.status(500).send(err);
    });

    if(!(cliente_obj)) return res.status(400).send(`Cliente ${cliente} no existe en la base de datos`);

    //console.log(cliente_obj);

    //creamos el obj Vende
    const vende_nuevo = new db.Vende({
        cliente: cliente_obj,
        fecha: Date.now(), // fecha actual
    });


    //en este arreglo almacenamos los datos a ingresar directamente a la DB con sus respectivos objetos, en ves de strings
    let datos_a_ingresar = {
        vende: vende_nuevo,
        info: [], // a esta variable se le ingresan los valores obtenidos abajo
    };

    //en este arreglo almacenamos todos los productos para actualizar sus cantidades despues de realizar la transaccion
    let productos_obj = [];

    //por cada producto
    for(let i=0;i < datos_productos.length; i++ ) {
        const datos = datos_productos[i];

        const producto = datos.producto;  // objectID del producto
        const cantidad = datos.cantidad;
        const precio = datos.precio;

        //revisamos que los datos ingresados son validos
        if(!(producto) || producto === "") return res.status(400).send("Falta el objectID del producto");
        if(!(cantidad) || cantidad === "") return res.send(400).send("Falta la cantidad de la venta");
        if(!(precio) || precio === "") return res.send(400).send("Falta el precio de la venta");

        if(isNaN(cantidad)) return res.status(400).send("La cantidad debe ser un numero");
        if(isNaN(precio)) return res.status(400).send("El precio de la venta debe ser un numero");

        const producto_obj = await db.Producto.findById(producto)
        .exec()
        .catch((err) => {
            console.log(err);
            return res.status(500).send(err);
        });
        if(producto_obj === null) return res.status(400).send(`Producto ${producto} no existe en la base de datos`);

        // disminuimos la cantidad y lo guardamos en el arreglo para actualizar despues
        producto_obj.cantidad = parseInt(producto_obj.cantidad) - parseInt(cantidad);
        productos_obj.push(producto_obj);

        //en este arreglo almacenamos la info de cada uno
        // producto, cantidad y precio
        let info = {
            producto: producto_obj,
            cantidad: cantidad,
            precio: precio,
        }

        //agregamos info al arreglo datos_a_ingresar.info

        datos_a_ingresar.info.push(info);


    }

    //creamos el nuevo objeto en la db para el registro de la venta
    const registro_vende_nuevo = new db.RegistroVende(datos_a_ingresar);


    //guardamos ambos objetos en la db
    try {
        const save_vende_nuevo = await vende_nuevo.save()
        const save_registro_nuevo = await registro_vende_nuevo.save()

        //actualizamos las cantidades de los productos
        for(const indice in productos_obj) {
            //console.log(productos_obj[indice]);
            await productos_obj[indice].save();
        }

        return res.sendStatus(200); //OK
    } catch(err) {
        if(err) {
            console.log(err);
            return res.status(500).send(err);
        }
    }

});

router.post('/compra/', autenticarToken , async function(req, res, next) {
    // nueva compra hecha
    const proveedor = req.body.proveedor; // objectID del proveedor
    const datos_productos = req.body.datos_productos;
    /*
    datos productos es un arreglo con:
    [n].producto
    [n].cantidad
    [n].precio
    */

    if(!(proveedor) || proveedor === "") return res.status(400).send("Falta el objectID del proveedor");
    if(!(datos_productos) || datos_productos.length === 0) return res.status(400).send("Faltan los datos de los productos comprados");

    //buscamos al proveedor en la db
    const proveedor_obj = await db.Proveedor.findById(proveedor)
    .exec()
    .catch((err) => {
        console.log(err);
        return res.status(500).send(err);
    });

    if(proveedor_obj === null) return res.status(400).send(`Proveedor ${proveedor} no existe en la base de datos`);

    //creamos el obj Compra
    const compra_nueva = new db.Compra({
        proveedor: proveedor_obj,
        fecha: Date.now(), // fecha actual
    });

    //en este arreglo almacenamos los datos a ingresar directamente a la DB con sus respectivos objetos, en ves de strings
    let datos_a_ingresar = {
        compra: compra_nueva,
        info: [], // a esta variable se le ingresan los valores obtenidos abajo
    };

    //en este arreglo almacenamos todos los productos para actualizar sus cantidades despues de realizar la transaccion
    let productos_obj = [];

    //por cada producto
    for(let i=0;i < datos_productos.length; i++ ) {
        const datos = datos_productos[i];

        const producto = datos.producto;  // objectID del producto
        const cantidad = datos.cantidad;
        const precio = datos.precio;

        //revisamos que los datos ingresados son validos
        if(!(producto) || producto === "") return res.status(400).send("Falta el objectID del producto");
        if(!(cantidad) || cantidad === "") return res.send(400).send("Falta la cantidad de la venta");
        if(!(precio) || precio === "") return res.send(400).send("Falta el precio de la venta");

        if(isNaN(cantidad)) return res.status(400).send("La cantidad debe ser un numero");
        if(isNaN(precio)) return res.status(400).send("El precio de la venta debe ser un numero");

        const producto_obj = await db.Producto.findById(producto)
        .exec()
        .catch((err) => {
            console.log(err);
            return res.status(500).send(err);
        });
        if(producto_obj === null) return res.status(400).send(`Producto ${producto} no existe en la base de datos`);

        // aumentamos la cantidad y lo guardamos en el arreglo para actualizar despues
        producto_obj.cantidad = parseInt(producto_obj.cantidad) + parseInt(cantidad);
        productos_obj.push(producto_obj);

        //en este arreglo almacenamos la info de cada uno
        // producto, cantidad y precio
        let info = {
            producto: producto_obj,
            cantidad: cantidad,
            precio: precio,
        }

        //agregamos info al arreglo datos_a_ingresar.info

        datos_a_ingresar.info.push(info);

    }

    //creamos el nuevo objeto en la db para el registro de la compra
    const registro_compra_nuevo = new db.RegistroCompra(datos_a_ingresar);


    //guardamos ambos objetos en la db
    try {
        const save_compra_nuevo = await compra_nueva.save()
        const save_registro_nuevo = await registro_compra_nuevo.save()

        //actualizamos las cantidades de los productos
        for(const indice in productos_obj) {
            //console.log(productos_obj[indice]);
            await productos_obj[indice].save();
        }

        return res.sendStatus(200); //OK
    } catch(err) {
        if(err) {
            console.log(err);
            return res.status(500).send(err);
        }
    }



});


module.exports = router;
