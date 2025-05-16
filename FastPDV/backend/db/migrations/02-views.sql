-- backend/db/migrations/02-views.sql

-- Ventas totales del día
CREATE OR REPLACE VIEW total_vendido_dia AS
SELECT DATE(fecha) as dia, SUM(total) as total_dinero, COUNT(id) as total_ventas
FROM sales
WHERE DATE(fecha) = CURRENT_DATE
GROUP BY DATE(fecha);

-- Ventas totales de la semana (últimos 7 días)
CREATE OR REPLACE VIEW total_vendido_semana AS
SELECT WEEK(fecha) as semana, SUM(total) as total_dinero, COUNT(id) as total_ventas
FROM sales
WHERE fecha >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
GROUP BY WEEK(fecha);

-- Ventas totales del mes (últimos 30 días)
CREATE OR REPLACE VIEW total_vendido_mes AS
SELECT MONTH(fecha) as mes, SUM(total) as total_dinero, COUNT(id) as total_ventas
FROM sales
WHERE fecha >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY MONTH(fecha);

-- Productos más vendidos del día
CREATE OR REPLACE VIEW productos_mas_vendidos_dia AS
SELECT p.id, p.nombre, p.codigo, SUM(si.quantity) as total_vendido
FROM sale_items si
JOIN products p ON si.product_id = p.id
WHERE DATE(si.created_at) = CURRENT_DATE
GROUP BY p.id, p.nombre, p.codigo
ORDER BY total_vendido DESC;

-- Productos más vendidos de la semana
CREATE OR REPLACE VIEW productos_mas_vendidos_semana AS
SELECT p.id, p.nombre, p.codigo, SUM(si.quantity) as total_vendido
FROM sale_items si
JOIN products p ON si.product_id = p.id
WHERE si.created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
GROUP BY p.id, p.nombre, p.codigo
ORDER BY total_vendido DESC;

-- Productos más vendidos del mes
CREATE OR REPLACE VIEW productos_mas_vendidos_mes AS
SELECT p.id, p.nombre, p.codigo, SUM(si.quantity) as total_vendido
FROM sale_items si
JOIN products p ON si.product_id = p.id
WHERE si.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY p.id, p.nombre, p.codigo
ORDER BY total_vendido DESC;
