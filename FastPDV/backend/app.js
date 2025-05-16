// backend/app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const db = require('./db/database');

// Importación de rutas
const productRoutes = require('./routes/products');

const app = express();

// Configuración de Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? 'https://tudominio.com' : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Configuración para Producción
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
    });
}

// Rutas de la API
app.use('/api/products', productRoutes);

// Rutas de Sistema
app.get('/api/health', async (req, res) => {
    try {
        // Verificación de la base de datos MySQL
        await db.query('SELECT 1');
        
        res.json({
            status: 'OK',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            database: 'connected',
            environment: process.env.NODE_ENV || 'development'
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'ERROR',
            error: 'Health check failed',
            details: error.message 
        });
    }
});

app.get('/', (req, res) => res.redirect('/api/health'));

// Manejo de Errores
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Ruta no encontrada',
        path: req.path,
        method: req.method
    });
});

app.use((err, req, res, next) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] Error:`, err.message);
    console.error(err.stack);

    const response = {
        error: 'Error interno del servidor',
        timestamp,
        path: req.path
    };

    if (process.env.NODE_ENV === 'development') {
        response.message = err.message;
        response.stack = err.stack.split('\n');
    }

    res.status(err.status || 500).json(response);
});

// Inicialización del Servidor
async function startServer() {
    const PORT = process.env.PORT || 5000;
    
    try {
        const server = app.listen(PORT, () => {
            console.log(`\n🚀 Servidor FASTPDV corriendo en http://localhost:${PORT}`);
            console.log('📌 Endpoints disponibles:');
            console.log(`- GET    http://localhost:${PORT}/api/health`);
            console.log(`- GET    http://localhost:${PORT}/api/products`);
            console.log(`- POST   http://localhost:${PORT}/api/products`);
            console.log(`\n🔧 Modo: ${process.env.NODE_ENV || 'development'}`);
        });

        // Manejo de cierre limpio
        const shutdown = (signal) => async () => {
            console.log(`\n🛑 Recibida señal ${signal}...`);
            server.close(async () => {
                console.log('🟢 Servidor cerrado correctamente');
                await db.close();
                process.exit(0);
            });

            setTimeout(() => {
                console.error('🔴 Tiempo de espera agotado. Cerrando forzadamente...');
                process.exit(1);
            }, 5000);
        };

        process.on('SIGTERM', shutdown('SIGTERM'));
        process.on('SIGINT', shutdown('SIGINT'));
        
    } catch (error) {
        console.error('🔴 Error crítico durante el inicio:', error.message);
        process.exit(1);
    }
}

// Iniciar la aplicación
startServer();