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

const materialSchema = new mongoose.Schema( { 
    nombre: String,
});

const unidadMedidaSchema = new mongoose.Schema( {
    nombre: String,
} );

const productoSchema = new mongoose.Schema({
    nombre: String,
    material: {type: mongoose.Schema.Types.ObjectId, ref: "Material"},
    precio_venta: Number,
    contenido: String,
    unidad_medida: { type: mongoose.Schema.Types.ObjectId, ref: "Unidad de Medida" },
});

const registroCompraSchema = new mongoose.Schema({
    compra: {type: mongoose.Schema.Types.ObjectId, ref: "Compra"},
    producto: {type: mongoose.Schema.Types.ObjectId, ref: "Producto"},
    cantidad: Number,
    precio: Number,
});

const vendeSchema = new mongoose.Schema({
    cliente: {type: mongoose.Schema.Types.ObjectId, ref: "Cliente"},
    fecha: Date,
});

const registroVendeSchema = new mongoose.Schema({
    producto: {type: mongoose.Schema.Types.ObjectId, ref: "Producto"},
    vende: {type: mongoose.Schema.Types.ObjectId, ref: "Vende"},
    cantidad: Number,
});

const compraSchema = new mongoose.Schema({
    proveedor: {type: mongoose.Schema.Types.ObjectId, ref: "Proveedor"},
    fecha: Date,
});

const clienteSchema = new mongoose.Schema({
    rut: {
        type: String,
        required: true,
        unique: true,
    },
    nombre: String,
    telefono: String,
    email: String,
    direccion: String,
});

const proveedorSchema = new mongoose.Schema({
    rut: {
        type: String,
        required: false,
        unique: true,
    },
    nombre: String,
    telefono: String,
    email: String,
    direccion: String,
    pagina_web: String,
});

const Material = mongoose.model("Material", materialSchema);

const UnidadMedida = mongoose.model("Unidad de Medida", unidadMedidaSchema);

const Producto = mongoose.model("Producto", productoSchema);

const RegistroCompra = mongoose.model("Registro Compra", registroCompraSchema);

const Vende = mongoose.model("Vende", vendeSchema);

const RegistroVende = mongoose.model("Registro Vende", registroVendeSchema);

const Compra = mongoose.model("Compra", compraSchema);

const Cliente = mongoose.model("Cliente", clienteSchema);

const Proveedor = mongoose.model("Proveedor", proveedorSchema);

module.exports = {
    Material,
    UnidadMedida,
    Producto,
    RegistroCompra,
    Vende,
    RegistroVende,
    Compra,
    Cliente,
    Proveedor,
};