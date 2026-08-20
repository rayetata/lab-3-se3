-- ============================================================
-- DDL: CREATE TABLES & CONSTRAINTS
-- ============================================================

CREATE TABLE customer (
    customer_id VARCHAR(10),
    customer_name VARCHAR(50) NOT NULL,
    city VARCHAR(30),
    membership_level VARCHAR(20),
    PRIMARY KEY (customer_id)
);

CREATE TABLE orders (
    order_id VARCHAR(10),
    customer_id VARCHAR(10),
    order_date DATE,
    shipping_city VARCHAR(30),
    PRIMARY KEY (order_id),
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);

CREATE TABLE product (
    product_id VARCHAR(10),
    product_name VARCHAR(100) NOT NULL,
    category VARCHAR(30),
    unit_price NUMERIC(8,2),
    PRIMARY KEY (product_id)
);

CREATE TABLE order_item (
    order_id VARCHAR(10),
    product_id VARCHAR(10),
    quantity NUMERIC(4,0),
    discount NUMERIC(4,2),
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);

CREATE TABLE vendor (
    vendor_id VARCHAR(10),
    vendor_name VARCHAR(50) NOT NULL,
    city VARCHAR(30),
    PRIMARY KEY (vendor_id)
);

CREATE TABLE supplies (
    vendor_id VARCHAR(10),
    product_id VARCHAR(10),
    stock_quantity NUMERIC(6,0),
    PRIMARY KEY (vendor_id, product_id),
    FOREIGN KEY (vendor_id) REFERENCES vendor(vendor_id),
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);

-- ============================================================
-- DML: INSERT SAMPLE DATA
-- ============================================================

-- Populate Customer
INSERT INTO customer (customer_id, customer_name, city, membership_level) VALUES
('C101', 'Alice Johnson', 'Seattle', 'Gold'),
('C102', 'Bob Smith', 'San Francisco', 'Silver'),
('C103', 'Charlie Davis', 'Chicago', 'Bronze'),
('C104', 'Diana Prince', 'Seattle', 'Gold'),
('C105', 'Evan Wright', 'New York', 'Bronze');

-- Populate Orders
INSERT INTO orders (order_id, customer_id, order_date, shipping_city) VALUES
('O500', 'C101', '2026-03-01', 'Seattle'),
('O501', 'C102', '2026-03-02', 'San Francisco'),
('O502', 'C101', '2026-03-05', 'Seattle'),
('O503', 'C103', '2026-03-07', 'Chicago'),
('O504', 'C104', '2026-03-10', 'San Francisco');

-- Populate Product
INSERT INTO product (product_id, product_name, category, unit_price) VALUES
('P001', 'SuperWidget', 'Electronics', 599.99),
('P002', 'UltraBook Pro', 'Electronics', 1200.00),
('P003', 'Database Concepts', 'Books', 75.50),
('P004', 'Ergonomic Desk Chair', 'Furniture', 250.00),
('P005', 'Wireless Headphones', 'Electronics', 150.00);

-- Populate Order_Item
INSERT INTO order_item (order_id, product_id, quantity, discount) VALUES
('O500', 'P001', 1, 0.05),
('O500', 'P003', 2, 0.00),
('O501', 'P002', 1, 0.10),
('O502', 'P004', 1, 0.00),
('O503', 'P003', 1, 0.00),
('O504', 'P001', 2, 0.15),
('O504', 'P005', 1, 0.00);

-- Populate Vendor
INSERT INTO vendor (vendor_id, vendor_name, city) VALUES
('V101', 'TechCorp', 'Seattle'),
('V102', 'GlobalSupply', 'San Francisco'),
('V103', 'BookCentral', 'Chicago'),
('V104', 'OfficeDepot Direct', 'New York');

-- Populate Supplies
INSERT INTO supplies (vendor_id, product_id, stock_quantity) VALUES
('V101', 'P001', 500),
('V101', 'P002', 150),
('V101', 'P005', 300),
('V102', 'P001', 200),
('V102', 'P004', 80),
('V103', 'P003', 1200),
('V104', 'P004', 150);
