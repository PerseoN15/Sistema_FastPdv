// backend/models/Sales.js
const db = require('../db/database');

class Sales {
    // Crear una nueva venta con items
    static async create(saleData, items) {
        let connection;
        try {
            connection = await db.getConnection();
            await connection.beginTransaction();

            // Insertar la venta principal
            const [saleResult] = await connection.execute(
                `INSERT INTO sales (cliente, total, efectivo_recibido, cambio) 
                VALUES (?, ?, ?, ?)`,
                [saleData.cliente || null, saleData.total, saleData.efectivo_recibido || null, saleData.cambio || null]
            );

            const saleId = saleResult.insertId;

            // Insertar los items de la venta y actualizar stock
            for (const item of items) {
                await connection.execute(
                    `INSERT INTO sale_items (sale_id, product_id, quantity, precio_venta, subtotal) 
                    VALUES (?, ?, ?, ?, ?)`,
                    [saleId, item.product_id, item.quantity, item.precio_venta, item.subtotal]
                );

                // Actualizar stock del producto
                await connection.execute(
                    `UPDATE products SET stock = stock - ? WHERE id = ?`,
                    [item.quantity, item.product_id]
                );
            }

            await connection.commit();

            return {
                id: saleId,
                ...saleData,
                items,
                fecha: new Date().toISOString()
            };
        } catch (error) {
            if (connection) await connection.rollback();
            console.error("Error al crear la venta:", error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    // Obtener todas las ventas
    static async getAll() {
        try {
            const sales = await db.query('SELECT * FROM sales ORDER BY fecha DESC');
            return sales;
        } catch (error) {
            console.error("Error al obtener ventas:", error);
            throw error;
        }
    }

    // Obtener venta por ID con sus items
    static async getById(id) {
        try {
            const [sale] = await db.query('SELECT * FROM sales WHERE id = ?', [id]);
            if (sale.length === 0) return null;

            const [items] = await db.query(
                `SELECT si.*, p.nombre as producto_nombre, p.codigo as producto_codigo 
                FROM sale_items si
                JOIN products p ON si.product_id = p.id
                WHERE si.sale_id = ?`,
                [id]
            );

            return {
                ...sale[0],
                items
            };
        } catch (error) {
            console.error(`Error al obtener la venta con ID ${id}:`, error);
            throw error;
        }
    }

    // Obtener ventas por rango de fechas
    static async getByDateRange(start, end) {
        try {
            const sales = await db.query(
                `SELECT s.*, SUM(si.subtotal) as total_venta
                FROM sales s
                JOIN sale_items si ON s.id = si.sale_id
                WHERE DATE(s.fecha) BETWEEN ? AND ?
                GROUP BY s.id
                ORDER BY s.fecha DESC`,
                [start, end]
            );

            return sales;
        } catch (error) {
            console.error(`Error al obtener ventas entre ${start} y ${end}:`, error);
            throw error;
        }
    }
}

module.exports = Sales;
