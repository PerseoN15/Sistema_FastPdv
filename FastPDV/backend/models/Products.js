// backend/models/Products.js
const db = require('../db/database');

class Product {
    // Obtener todos los productos
    static async getAll() {
        try {
            const results = await db.query('SELECT id, nombre, precio_venta, stock, image, volumen FROM products');
            // Manejar correctamente precios vacíos o nulos
            return results.map(product => ({
                ...product,
                precio_venta: parseFloat(product.precio_venta) || 0 // Forzar a número o 0
            }));
        } catch (error) {
            console.error('❌ Error al obtener productos:', error);
            throw error;
        }
    }

    // Obtener producto por ID
    static async getById(id) {
        try {
            const results = await db.query('SELECT * FROM products WHERE id = ?', [id]);
            return results.length > 0 ? results[0] : null;
        } catch (error) {
            console.error(`❌ Error al obtener el producto con ID ${id}:`, error);
            throw error;
        }
    }

    // Crear un nuevo producto (versión mejorada con validaciones)
    static async create(productData) {
        try {
            const {
                codigo,
                nombre,
                categoria,
                precio_compra,
                precio_venta,
                stock,
                stock_minimo,
                proveedor,
                volumen,
                image
            } = productData;

            // Validaciones
            if (!codigo || !nombre || !categoria) {
                throw new Error("Los campos 'codigo', 'nombre' y 'categoria' son obligatorios.");
            }

            if (parseFloat(precio_venta) < parseFloat(precio_compra)) {
                throw new Error("El precio de venta no puede ser menor que el precio de compra.");
            }

            const result = await db.execute(
                'INSERT INTO products (codigo, nombre, categoria, precio_compra, precio_venta, stock, stock_minimo, proveedor, volumen, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    codigo.trim(),
                    nombre.trim(),
                    categoria.trim(),
                    parseFloat(precio_compra) || 0,
                    parseFloat(precio_venta) || 0,
                    parseInt(stock) || 0,
                    parseInt(stock_minimo) || 0,
                    proveedor ? proveedor.trim() : 'Sin proveedor',
                    volumen ? volumen.trim() : 'Sin volumen',
                    image ? image.trim() : 'https://via.placeholder.com/150'
                ]
            );
            
            return result.insertId;
        } catch (error) {
            console.error('❌ Error al crear producto:', error);
            throw error;
        }
    }

    // Actualizar un producto
    static async update(id, productData) {
        try {
            const { 
                codigo, 
                nombre, 
                categoria, 
                precio_compra, 
                precio_venta, 
                stock, 
                stock_minimo, 
                proveedor, 
                volumen, 
                image 
            } = productData;

            // Validación de precio
            if (parseFloat(precio_venta) < parseFloat(precio_compra)) {
                throw new Error("El precio de venta no puede ser menor que el precio de compra.");
            }

            await db.execute(
                'UPDATE products SET codigo = ?, nombre = ?, categoria = ?, precio_compra = ?, precio_venta = ?, stock = ?, stock_minimo = ?, proveedor = ?, volumen = ?, image = ? WHERE id = ?',
                [
                    codigo.trim(),
                    nombre.trim(),
                    categoria.trim(),
                    parseFloat(precio_compra) || 0,
                    parseFloat(precio_venta) || 0,
                    parseInt(stock) || 0,
                    parseInt(stock_minimo) || 0,
                    proveedor ? proveedor.trim() : 'Sin proveedor',
                    volumen ? volumen.trim() : 'Sin volumen',
                    image ? image.trim() : 'https://via.placeholder.com/150',
                    id
                ]
            );
        } catch (error) {
            console.error(`❌ Error al actualizar el producto con ID ${id}:`, error);
            throw error;
        }
    }

    // Eliminar un producto
    static async delete(id) {
        try {
            await db.execute('DELETE FROM products WHERE id = ?', [id]);
        } catch (error) {
            console.error(`❌ Error al eliminar el producto con ID ${id}:`, error);
            throw error;
        }
    }

    // Buscar productos por nombre, código o categoría
    static async search(term) {
        try {
            const results = await db.query(
                'SELECT * FROM products WHERE nombre LIKE ? OR codigo LIKE ? OR categoria LIKE ?',
                [`%${term}%`, `%${term}%`, `%${term}%`]
            );
            return results;
        } catch (error) {
            console.error(`❌ Error al buscar productos con el término "${term}":`, error);
            throw error;
        }
    }

    // Obtener productos con stock bajo
    static async getLowStock() {
        try {
            const results = await db.query('SELECT * FROM products WHERE stock <= stock_minimo');
            return results;
        } catch (error) {
            console.error('❌ Error al obtener productos con bajo stock:', error);
            throw error;
        }
    }

    // Actualizar stock del producto (versión mejorada)
    static async updateStock(id, quantitySold) {
        try {
            // Verificar que el producto exista
            const results = await db.query('SELECT stock FROM products WHERE id = ?', [id]);
            if (results.length === 0) {
                console.error(`❌ Producto con ID ${id} no encontrado`);
                throw new Error(`Producto con ID ${id} no encontrado`);
            }

            const currentStock = results[0].stock;
            const newStock = currentStock - quantitySold;

            // Verificar que el stock no sea negativo
            if (newStock < 0) {
                console.error(`❌ Stock insuficiente para el producto con ID ${id}`);
                throw new Error(`Stock insuficiente para el producto con ID ${id}`);
            }

            // Actualizar el stock
            await db.execute('UPDATE products SET stock = ? WHERE id = ?', [newStock, id]);
            console.log(`✅ Stock actualizado correctamente para el producto con ID ${id}: Nuevo stock = ${newStock}`);
            return newStock;
        } catch (error) {
            console.error(`❌ Error al actualizar el stock del producto con ID ${id}:`, error);
            throw error;
        }
    }
}

module.exports = Product;