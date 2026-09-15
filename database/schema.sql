-- ==========================
-- CREAR BASE DE DATOS
-- ==========================

CREATE DATABASE IF NOT EXISTS authdb;

USE authdb;

-- ==========================
-- TABLA ROLES
-- ==========================

CREATE TABLE roles (

    id INT AUTO_INCREMENT PRIMARY KEY,

    nombre VARCHAR(50)
    NOT NULL UNIQUE

);

-- ==========================
-- TABLA USUARIOS
-- ==========================

CREATE TABLE usuarios (

    id INT AUTO_INCREMENT PRIMARY KEY,

    username VARCHAR(50)
    NOT NULL UNIQUE,

    password_hash VARCHAR(255)
    NOT NULL,

    rol_id INT NOT NULL,

    intentos_fallidos INT DEFAULT 0,

    bloqueado_hasta DATETIME NULL,

    FOREIGN KEY (rol_id)
    REFERENCES roles(id)

);

-- ==========================
-- ROLES INICIALES
-- ==========================

INSERT INTO roles (nombre)
VALUES

('Administrador'),

('Usuario');