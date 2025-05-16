-- backend/db/migrations/002_sample_products.sql
BEGIN TRANSACTION;

-- Productos iniciales
INSERT IGNORE INTO products 
(codigo, nombre, categoria, precio_compra, precio_venta, stock, stock_minimo, proveedor, volumen, image) VALUES
('P001', 'Galletas Marías', 'Galletas', 5.00, 8.00, 100, 20, 'Bimbo', '150 GR', 'https://via.placeholder.com/150'),
('P002', 'Refresco Coca-Cola', 'Bebidas', 8.00, 12.00, 50, 10, 'Coca-Cola', '355 ML', 'https://via.placeholder.com/150'),
('P003', 'Agua Bonafont', 'Bebidas', 4.00, 7.00, 150, 30, 'Bonafont', '600 ML', 'https://via.placeholder.com/150'),
('P004', 'Pasta Dental Colgate', 'Higiene', 20.00, 35.00, 60, 10, 'Colgate', '100 ML', 'https://via.placeholder.com/150'),
('P005', 'Cereal Zucaritas', 'Cereales', 30.00, 50.00, 40, 5, 'Kelloggs', '500 GR', 'https://via.placeholder.com/150');

-- Usuarios iniciales para pruebas
INSERT IGNORE INTO users 
(username, password, role) VALUES
('admin', 'admin123', 'Administrador'),
('vendedor1', 'vendedor123', 'Vendedor'),
('vendedor2', 'vendedor456', 'Vendedor');

-- Ventas iniciales para pruebas
INSERT IGNORE INTO sales 
(cliente, total, efectivo_recibido, cambio) VALUES
('Juan Pérez', 80.00, 100.00, 20.00),
('María López', 150.00, 200.00, 50.00),
('Carlos Gómez', 200.00, 300.00, 100.00);

-- Items de ventas para pruebas
INSERT IGNORE INTO sale_items 
(sale_id, product_id, quantity, precio_venta, subtotal) VALUES
(1, 1, 5, 8.00, 40.00),
(1, 2, 2, 12.00, 24.00),
(2, 3, 10, 7.00, 70.00),
(2, 4, 2, 35.00, 70.00),
(3, 5, 4, 50.00, 200.00);

COMMIT;
