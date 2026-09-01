USE irctc_db;
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pnr VARCHAR(10) NOT NULL UNIQUE,
    train_no VARCHAR(20) NOT NULL,
    train_name VARCHAR(100) NOT NULL,
    source VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    journey_date DATE NOT NULL,
    passenger_name VARCHAR(100) NOT NULL,
    passenger_age INT NOT NULL,
    passenger_gender VARCHAR(20) NOT NULL,
    fare DECIMAL(10,2) NOT NULL,
    payment_id VARCHAR(100),
    payment_status VARCHAR(20) DEFAULT 'Paid',
    booking_status VARCHAR(20) DEFAULT 'Confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
SHOW TABLES;

DESCRIBE bookings;

USE irctc_db;

SELECT * 
FROM bookings
ORDER BY id DESC;