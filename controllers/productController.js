// controllers/productController.js

const Product = require('../models/Product');

// Crear un nuevo producto
const createProduct = async (req, res) => {
    try {
      const { nombre, precio, descripcion, cantidad } = req.body;
      const newProduct = new Product({ nombre, precio, descripcion, cantidad });
      await newProduct.save();
      res.status(201).json(newProduct);
    } catch (error) {
      console.error('Error al crear el producto:', error);
      res.status(500).json({ error: 'Error al crear el producto' });
    }
  };
  
// Obtener todos los productos
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};

// Actualizar un producto por ID
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, precio, descripcion, cantidad } = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { nombre, precio, descripcion, cantidad },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
};

// Eliminar un producto por ID
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
};