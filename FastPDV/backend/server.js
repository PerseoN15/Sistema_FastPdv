// backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');

const productRoutes = require('./routes/products');
const salesRoutes = require('./routes/sales');

const app = express();

// Middleware para CORS y JSON
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/api/products', productRoutes);
app.use('/api/sales', salesRoutes);

// Ruta de prueba para verificar que el servidor esté activo
app.get('/', (req, res) => {
    res.send(' Servidor FASTPDV corriendo correctamente');
});

// Manejo de rutas no encontradas
app.use((req, res, next) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        path: req.originalUrl,
        method: req.method
    });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
    console.error('Error en el servidor:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar el servidor
app.listen(config.server.port, () => {
    console.log(` Servidor corriendo en http://localhost:${config.server.port}`);
});
