// backend/routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Products');

// Obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const products = await Product.getAll();
        res.json(products);
    } catch (err) {
        console.error("❌ Error al obtener productos:", err);
        res.status(500).json({ error: "Error al obtener productos" });
    }
});

module.exports = router;
// Obtener un producto por ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.getById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Crear un nuevo producto
router.post('/', async (req, res) => {
    try {
        const productId = await Product.create(req.body);
        const newProduct = await Product.getById(productId);
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Actualizar un producto
router.put('/:id', async (req, res) => {
    try {
        await Product.update(req.params.id, req.body);
        const updatedProduct = await Product.getById(req.params.id);
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Eliminar un producto
router.delete('/:id', async (req, res) => {
    try {
        await Product.delete(req.params.id);
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Buscar productos por nombre, código o categoría
router.get('/search/:term', async (req, res) => {
    try {
        const products = await Product.search(req.params.term);
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Productos con bajo stock
router.get('/inventory/low-stock', async (req, res) => {
    try {
        const products = await Product.getLowStock();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Actualizar stock de un producto
router.put('/:id/update-stock', async (req, res) => {
    try {
        const { quantity } = req.body;
        const productId = req.params.id;

        if (typeof quantity !== 'number' || quantity <= 0) {
            return res.status(400).json({ error: 'Cantidad inválida' });
        }

        // Actualizar el stock
        await Product.updateStock(productId, quantity);
        const updatedProduct = await Product.getById(productId);
        res.json(updatedProduct);
    } catch (err) {
        console.error("❌ Error al actualizar stock:", err);
        res.status(500).json({ error: "Error al actualizar stock" });
    }
});


module.exports = router;
