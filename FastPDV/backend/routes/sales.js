// backend/routes/sales.js
const express = require('express');
const router = express.Router();
const Sales = require('../models/Sales');

// Crear una nueva venta
router.post('/', async (req, res) => {
    try {
        const { saleData, items } = req.body;
        const newSale = await Sales.create(saleData, items);
        res.status(201).json(newSale);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Obtener todas las ventas
router.get('/', async (req, res) => {
    try {
        const sales = await Sales.getAll();
        res.json(sales);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener una venta por ID
router.get('/:id', async (req, res) => {
    try {
        const sale = await Sales.getById(req.params.id);
        if (!sale) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }
        res.json(sale);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener ventas por rango de fechas
router.get('/date-range', async (req, res) => {
    try {
        const { start, end } = req.query;
        const sales = await Sales.getByDateRange(start, end);
        res.json(sales);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
