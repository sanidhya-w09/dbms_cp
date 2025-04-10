const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration without database name
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Sanidhya@98',
  multipleStatements: true
};

// SQL script to create the entire database schema
const sqlScript = `
-- Drop existing schema if it exists and create a new one
DROP SCHEMA IF EXISTS drugdatabase;
CREATE SCHEMA drugdatabase;

-- Use the schema
USE drugdatabase;

-- Create customer table (updated pass field for bcrypt)
CREATE TABLE customer (
  uid varchar(15) NOT NULL,
  pass varchar(60) DEFAULT NULL,
  fname varchar(15) DEFAULT NULL,
  lname varchar(15) DEFAULT NULL,
  email varchar(30) DEFAULT NULL,
  address varchar(128) DEFAULT NULL,
  phno bigint DEFAULT NULL,
  PRIMARY KEY (uid)
);

-- Create seller table (updated pass field for bcrypt)
CREATE TABLE seller (
  sid varchar(15) NOT NULL,
  sname varchar(20) DEFAULT NULL,
  pass varchar(60) DEFAULT NULL,
  address varchar(128) DEFAULT NULL,
  phno bigint DEFAULT NULL,
  PRIMARY KEY (sid)
);

-- Create product table
CREATE TABLE product (
  pid varchar(15) NOT NULL,
  pname varchar(20) DEFAULT NULL,
  manufacturer varchar(20) DEFAULT NULL,
  mfg date DEFAULT NULL,
  exp date DEFAULT NULL,
  price int DEFAULT NULL,
  PRIMARY KEY (pid),
  UNIQUE KEY pname (pname)
);

-- Create inventory table
CREATE TABLE inventory (
  pid varchar(15) NOT NULL,
  pname varchar(20) DEFAULT NULL,
  quantity int unsigned DEFAULT NULL,
  sid varchar(15) NOT NULL,
  PRIMARY KEY (pid,sid),
  CONSTRAINT fk01 FOREIGN KEY (pid) REFERENCES product (pid) ON DELETE CASCADE,
  CONSTRAINT fk02 FOREIGN KEY (pname) REFERENCES product (pname) ON DELETE CASCADE,
  CONSTRAINT fk03 FOREIGN KEY (sid) REFERENCES seller (sid) ON DELETE CASCADE
);

-- Create orders table
CREATE TABLE orders (
  oid int NOT NULL AUTO_INCREMENT,
  pid varchar(15) DEFAULT NULL,
  sid varchar(15) DEFAULT NULL,
  uid varchar(15) DEFAULT NULL,
  timestamp datetime DEFAULT CURRENT_TIMESTAMP,
  quantity int unsigned DEFAULT NULL,
  PRIMARY KEY (oid),
  CONSTRAINT fk04 FOREIGN KEY (pid) REFERENCES product (pid) ON DELETE CASCADE,
  CONSTRAINT fk05 FOREIGN KEY (sid) REFERENCES seller (sid) ON DELETE CASCADE,
  CONSTRAINT fk06 FOREIGN KEY (uid) REFERENCES customer (uid) ON DELETE CASCADE
);

-- Set auto increment for orders
ALTER TABLE orders AUTO_INCREMENT=1000;

-- Stored procedure to get seller orders (removed DELIMITER statements)
CREATE PROCEDURE getsellerorders(IN seller_id VARCHAR(15))
BEGIN
    SELECT o.*, p.pname, p.price, p.manufacturer, c.fname, c.lname
    FROM orders o
    JOIN product p ON o.pid = p.pid
    JOIN customer c ON o.uid = c.uid
    WHERE o.sid = seller_id
    ORDER BY o.timestamp DESC;
END;

-- Stored procedure to get customer orders (removed DELIMITER statements)
CREATE PROCEDURE getorders(IN customer_id VARCHAR(15))
BEGIN
    SELECT o.*, p.pname, p.price, p.manufacturer, s.sname
    FROM orders o
    JOIN product p ON o.pid = p.pid
    JOIN seller s ON o.sid = s.sid
    WHERE o.uid = customer_id
    ORDER BY o.timestamp DESC;
END;

-- Sample data for testing (optional)
INSERT INTO seller (sid, sname, pass, address, phno) VALUES ('seller1', 'MedStore', '$2b$10$NJj0Aw8NrW.buNj0eSyBZO1ixL1FdkSfurpSGQYWaQ6oRF6CKcOeK', '123 Main St', 1234567890);
INSERT INTO product (pid, pname, manufacturer, mfg, exp, price) VALUES ('P001', 'Aspirin', 'Bayer', '2025-01-01', '2027-01-01', 5);
INSERT INTO inventory (pid, pname, quantity, sid) VALUES ('P001', 'Aspirin', 100, 'seller1');
`;

async function setupDatabase() {
  let connection;
  try {
    // Connect to MySQL (without specifying a database)
    console.log('Connecting to MySQL server...');
    connection = await mysql.createConnection(dbConfig);
    
    // Execute SQL script
    console.log('Creating and setting up the database...');
    await connection.query(sqlScript);
    
    console.log('Database setup completed successfully! You can now run the application using: npm start');
  } catch (error) {
    console.error('Error setting up database:', error.message);
    
    if (error.message.includes('Access denied')) {
      console.log('\nHINT: Make sure your MySQL credentials in .env file are correct.');
      console.log('If your MySQL has no password, use DB_PASS= (empty value)');
      console.log('If MySQL requires a password, update DB_PASS with your actual password\n');
    }
  } finally {
    if (connection) {
      console.log('Closing database connection');
      await connection.end();
    }
  }
}

// Run the setup
setupDatabase();