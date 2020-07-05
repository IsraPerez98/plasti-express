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

//modelo de la base de datos del negocio

//material ahora se incluye directo dentro del producto
/*
const materialSchema = new mongoose.Schema( { 
    nombre: String,
});
*/

//unidad de medida ahora se incluye directo dentro del producto
/*
const unidadMedidaSchema = new mongoose.Schema( {
    nombre: String,
} );
*/

const productoSchema = new mongoose.Schema({
    nombre: String,
    material: String,
    precio_venta: Number,
    contenido: String,
    unidad_medida: String,
    cantidad: Number,
});

const clienteSchema = new mongoose.Schema({
    rut: {
        type: String,
        required: false,
        //unique: true, // da problemas con mongodb, revisar si es unico de forma manual al ingresar un nuevo cliente
    },
    nombre: String,
    telefono: String,
    email: String,
    direccion: String,
    local: String,
});

const proveedorSchema = new mongoose.Schema({
    rut: {
        type: String,
        required: false,
        //unique: true, // da problemas con mongodb, revisar si es unico de forma manual al ingresar un nuevo proveedor
    },
    nombre: String,
    telefono: String,
    email: String,
    direccion: String,
    pagina_web: String,
});

const compraSchema = new mongoose.Schema({
    proveedor: proveedorSchema,
    fecha: Date,
});

const registroCompraSchema = new mongoose.Schema({
    compra: compraSchema,
    info: [{
        producto: productoSchema,
        cantidad: Number,
        precio: Number,
    }],
});

const vendeSchema = new mongoose.Schema({
    cliente: clienteSchema,
    fecha: Date,
});

const registroVendeSchema = new mongoose.Schema({
    
    vende: vendeSchema,
    info: [{
        producto: productoSchema,
        cantidad: Number,
        precio: Number,
    }],
});





//const Material = mongoose.model("Material", materialSchema);

//const UnidadMedida = mongoose.model("Unidad de Medida", unidadMedidaSchema);

const Producto = mongoose.model("Producto", productoSchema);

const RegistroCompra = mongoose.model("Registro Compra", registroCompraSchema);

const Vende = mongoose.model("Vende", vendeSchema);

const RegistroVende = mongoose.model("Registro Vende", registroVendeSchema);

const Compra = mongoose.model("Compra", compraSchema);

const Cliente = mongoose.model("Cliente", clienteSchema);

const Proveedor = mongoose.model("Proveedor", proveedorSchema);

module.exports = {
    Producto,
    RegistroCompra,
    Vende,
    RegistroVende,
    Compra,
    Cliente,
    Proveedor,
};