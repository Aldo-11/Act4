const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  descripcion: { type: String },
  cantidad: { type: Number, required: true }
});

module.exports = mongoose.model('Product', productSchema);
