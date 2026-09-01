USE irctc_db;

CREATE TABLE trains (
    id INT AUTO_INCREMENT PRIMARY KEY,
    train_number VARCHAR(20) NOT NULL UNIQUE,
    train_name VARCHAR(100) NOT NULL,
    source VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    duration VARCHAR(20),
    available_seats INT DEFAULT 0,
    fare DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO trains
(train_number, train_name, source, destination, departure_time, arrival_time, duration, available_seats, fare)
VALUES
('12951', 'Mumbai Rajdhani', 'Delhi', 'Mumbai', '16:55:00', '08:35:00', '15h 40m', 120, 2500.00),

('12952', 'Mumbai Rajdhani', 'Mumbai', 'Delhi', '17:00:00', '08:30:00', '15h 30m', 100, 2500.00),

('12953', 'August Kranti Rajdhani', 'Mumbai', 'Delhi', '17:40:00', '10:55:00', '17h 15m', 80, 2300.00),

('12001', 'Bhopal Shatabdi', 'Delhi', 'Bhopal', '06:00:00', '12:55:00', '6h 55m', 150, 1500.00),

('12901', 'Gujarat Mail', 'Mumbai', 'Ahmedabad', '21:40:00', '05:45:00', '8h 05m', 200, 900.00);


SELECT * FROM trains;
