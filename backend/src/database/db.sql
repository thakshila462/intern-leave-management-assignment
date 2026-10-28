CREATE DATABASE intern_leave_db;
DROP DATABASE intern_leave_db;

USE intern_leave_db;

CREATE TABLE employees (
                           id INT AUTO_INCREMENT PRIMARY KEY,
                           name VARCHAR(100) NOT NULL,
                           email VARCHAR(150) NOT NULL UNIQUE,
                           password VARCHAR(255) NOT NULL,
                           department VARCHAR(100) NOT NULL,
                           role ENUM('ADMIN', 'EMPLOYEE') NOT NULL DEFAULT 'EMPLOYEE',
                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

TABLE employees;

CREATE TABLE leave_requests (
                                id INT AUTO_INCREMENT PRIMARY KEY,
                                employee_id INT NOT NULL,
                                leave_type ENUM('ANNUAL', 'CASUAL', 'MEDICAL') NOT NULL,
                                start_date DATE NOT NULL,
                                end_date DATE NOT NULL,
                                reason TEXT NOT NULL,
                                status ENUM('PENDING', 'APPROVED', 'REJECTED')
                                    NOT NULL DEFAULT 'PENDING',
                                rejection_reason TEXT NULL,
                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                                    ON UPDATE CURRENT_TIMESTAMP,

                                CONSTRAINT fk_leave_employee
                                    FOREIGN KEY (employee_id)
                                        REFERENCES employees(id)
                                        ON DELETE RESTRICT,

                                CONSTRAINT chk_leave_dates
                                    CHECK (end_date >= start_date)
);

TABLE leave_requests;

UPDATE employees
SET role = 'ADMIN'
WHERE email = 'navindu@gmail.com';