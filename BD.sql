CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    correo_electronico VARCHAR(50) NOT NULL,
    contrasena text  not null,
    fecha_cracion TIMESTAMP  NOT NULL,
    fecha_actualizacion TIMESTAMP,
    id_tipo_usuario  INTEGER NOT NULL
);

CREATE TABLE tipo_usuario(
    id_tipo_usuario SERIAL PRIMARY KEY,
    tipo_usuario VARCHAR(20) NOT NULL
)

/*
TABLA DE PRODUCTOS
*/

CREATE TABLE producto(
    id_producto SERIAL PRIMARY KEY,  
    cupo VARCHAR(20) not null,   
    tasa NUMERIC(4,2) ,
    id_tipo_producto int not null,
    id_franquicia int not null
);

--INSERT DE PRODUCTO

CREATE TABLE tipo_producto(
    id_tipo_producto SERIAL PRIMARY KEY,
    tipo_producto VARCHAR(50) NOT NULL
);

CREATE TABLE franquicia(
    id_franquicia SERIAL PRIMARY KEY,
    franquicia VARCHAR(50) NOT NULL
);


/*TABLA DE VENTAS*/
CREATE TABLE venta(
     id_venta SERIAL PRIMARY KEY,
     fecha_venta TIMESTAMP  NOT NULL,
     id_usuario INT NOT NULL,
     id_producto INT NOT NULL,
     id_actualizacion_venta int
);

CREATE TABLE actualizacion_venta(
    id_actualizacion_venta SERIAL PRIMARY KEY,
     fecha_actalizada TIMESTAMP,
     id_venta INTEGER  NOT NULL,
     id_usuario INT NOT NULL
);
 
--ALTER DE USUARIO
ALTER TABLE usuario ADD CONSTRAINT fk_usuarios FOREIGN KEY (id_tipo_usuario) REFERENCES tipo_usuario(id_tipo_usuario);

--ALTER DE PRODUCTO
ALTER TABLE producto ADD CONSTRAINT fk_tipo_producto FOREIGN KEY (id_tipo_producto) REFERENCES tipo_producto(id_tipo_producto);

ALTER TABLE producto ADD CONSTRAINT fk_franquicia FOREIGN KEY (id_franquicia) REFERENCES franquicia(id_franquicia);

--ALTER DE VENTA
ALTER TABLE venta ADD CONSTRAINT fk_venta_usuarios FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario);
ALTER TABLE venta ADD CONSTRAINT fk_venta_producto FOREIGN KEY (id_producto) REFERENCES producto(id_producto);
ALTER TABLE venta ADD CONSTRAINT fk_venta_actualizacion_ventas FOREIGN KEY (id_actualizacion_venta) REFERENCES actualizacion_venta(id_actualizacion_venta);

--ALTER DE ACTUALIZACION VENTA

ALTER TABLE actualizacion_venta ADD CONSTRAINT fk_venta_actualizacion_ventas_usuarios FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario);
ALTER TABLE actualizacion_venta ADD CONSTRAINT fk_venta_producto FOREIGN KEY (id_venta) REFERENCES venta(id_venta);



---LA CONTRASEÑA ES 123
INSERT INTO usuario (nombre,correo_electronico,contrasena,fecha_cracion,fecha_actualizacion,id_tipo_usuario) VALUES
('Laura Lopez','Laura@email.com','$2b$04$p5xo0Cbdc0C.V6nk3vZN6OFiEN5ZACQgcSsmDvWXO5QGn1ohJ2Agm','2025-03-30 22:22:00',null,1);

---LA CONTRASEÑA ES 123
INSERT INTO usuario (nombre,correo_electronico,contrasena,fecha_cracion,fecha_actualizacion,id_tipo_usuario) VALUES
('Martin Lopez','Martin@email.com','$2b$04$p5xo0Cbdc0C.V6nk3vZN6OFiEN5ZACQgcSsmDvWXO5QGn1ohJ2Agm','2025-03-30 22:22:00',null,1);

---LA CONTRASEÑA ES 123
INSERT INTO usuario (nombre,correo_electronico,contrasena,fecha_cracion,fecha_actualizacion,id_tipo_usuario) VALUES
('Sofia','Sofia@email.com','$2b$04$p5xo0Cbdc0C.V6nk3vZN6OFiEN5ZACQgcSsmDvWXO5QGn1ohJ2Agm','2025-03-30 22:22:00',null,2);

---LA CONTRASEÑA ES 123
INSERT INTO usuario (nombre,correo_electronico,contrasena,fecha_cracion,fecha_actualizacion,id_tipo_usuario) VALUES
('Mateo Mesa','Mateo@email.com','$2b$04$p5xo0Cbdc0C.V6nk3vZN6OFiEN5ZACQgcSsmDvWXO5QGn1ohJ2Agm','2025-03-30 22:22:00',null,2);


/*INSERT DE TIPO USUARIO*/
INSERT INTO tipo_usuario (id_tipo_usuario,tipo_usuario) VALUES (1,'Administrador');--1
INSERT INTO tipo_usuario (id_tipo_usuario,tipo_usuario) VALUES (2,'Asesor');--2




--INSERT DE PRODUCTOS NO asociados a una venta
INSERT INTO producto (cupo,tasa,id_tipo_producto,id_franquicia) VALUES ('1.000.000',12.89,1,1);--1
INSERT INTO producto (cupo,tasa,id_tipo_producto,id_franquicia) VALUES ('2.000.000',12.89,2,2);--2
INSERT INTO producto (cupo,tasa,id_tipo_producto,id_franquicia) VALUES ('3.000.000',12.89,3,3);--3


--INSERT DE TIPO PRODUCTO

INSERT INTO tipo_producto (id_tipo_producto,tipo_producto) VALUES (1,'Credito de Consumo');--1
INSERT INTO tipo_producto (id_tipo_producto,tipo_producto) VALUES (2,'Libranza Libre Inversión');--2
INSERT INTO tipo_producto (id_tipo_producto,tipo_producto) VALUES (3,'Tarjeta de Credito');--3

--INSERT DE FRANQUICIA
INSERT INTO franquicia (id_franquicia,franquicia) VALUES (1,'AMEX');--1
INSERT INTO franquicia (id_franquicia,franquicia) VALUES (2,'VISA');--2
INSERT INTO franquicia (id_franquicia,franquicia) VALUES (3,'MASTERCARD');--3



--INSERT DE VENTAS SIN ID DE LA ACTUALIZACION DE LA VENTA
INSERT INTO venta (fecha_venta,id_usuario,id_producto) VALUES ('2025-03-29 10:49:00',1,3);
INSERT INTO venta (fecha_venta,id_usuario,id_producto) VALUES ('2025-03-29 10:49:00',2,2);
INSERT INTO venta (fecha_venta,id_usuario,id_producto) VALUES ('2025-03-29 10:49:00',3,1);
INSERT INTO venta (fecha_venta,id_usuario,id_producto) VALUES ('2025-03-29 10:49:00',1,1);
INSERT INTO venta (fecha_venta,id_usuario,id_producto) VALUES ('2025-03-29 10:49:00',2,2);
INSERT INTO venta (fecha_venta,id_usuario,id_producto) VALUES ('2025-03-29 10:49:00',3,3);



--PROCEDIMIENTO ALMACENADO PARA INSERTAR LA VENTA
CREATE OR REPLACE FUNCTION insertar_venta(
    p_cupo VARCHAR(20),
    p_tasa NUMERIC(4,2),
    p_id_tipo_producto INT,
    p_id_franquicia INT,
    p_fecha_venta TIMESTAMP,
    p_id_usuario INT
) RETURNS VOID AS $$
DECLARE
    v_id_producto INT;
    v_id_venta INT;
BEGIN
    -- Insertar producto
    INSERT INTO producto (cupo, tasa, id_tipo_producto, id_franquicia)
    VALUES (p_cupo, p_tasa, p_id_tipo_producto, p_id_franquicia)
    RETURNING id_producto INTO v_id_producto;

    -- Insertar venta (sin id_actualizacion_venta)
    INSERT INTO venta (fecha_venta, id_usuario, id_producto)
    VALUES (p_fecha_venta, p_id_usuario, v_id_producto)
    RETURNING id_venta INTO v_id_venta;

END;
$$ LANGUAGE plpgsql;

--EJEMPLO DE EJECUCION DE LA QUERY
SELECT insertar_venta('1.000.000', 12.89, 1, 2, '2025-03-30 14:30:00', 1);
SELECT insertar_venta('2.000.000', 12.89, 1, 2, '2025-03-30 14:30:00', 2);
SELECT insertar_venta('3.000.000', 12.89, 1, 2, '2025-03-30 14:30:00', 3);


--PROCEDIMIENTO ALMACENADO DE ACTUALIZAR VENTA

CREATE OR REPLACE FUNCTION actualizar_venta(
    p_id_venta INT,
    p_cupo VARCHAR(20),
    p_tasa NUMERIC(4,2),
    p_id_tipo_producto INT,
    p_id_franquicia INT,
    p_fecha_venta TIMESTAMP,
    p_id_usuario_venta INT,
    p_id_usuario_actualizacion INT,
    p_fecha_actualizacion TIMESTAMP
) RETURNS VOID AS $$
DECLARE
    v_id_producto INT;
    v_id_actualizacion INT;
BEGIN
    -- Obtener el id_producto relacionado con la venta
    SELECT id_producto INTO v_id_producto FROM venta WHERE id_venta = p_id_venta;

    -- Actualizar la tabla producto
    UPDATE producto
    SET cupo = p_cupo,
        tasa = p_tasa,
        id_tipo_producto = p_id_tipo_producto,
        id_franquicia = p_id_franquicia
    WHERE id_producto = v_id_producto;

    -- Actualizar la tabla venta
    UPDATE venta
    SET fecha_venta = p_fecha_venta,
        id_usuario = p_id_usuario_venta
    WHERE id_venta = p_id_venta;

    -- Insertar en la tabla actualizacion_ventas y obtener su ID
    INSERT INTO actualizacion_venta (fecha_actalizada, id_venta, id_usuario)
    VALUES (p_fecha_actualizacion, p_id_venta, p_id_usuario_actualizacion)
    RETURNING id_actualizacion_venta INTO v_id_actualizacion;

    -- Actualizar la tabla venta con el nuevo ID de actualización
    UPDATE venta
    SET id_actualizacion_venta = v_id_actualizacion
    WHERE id_venta = p_id_venta;
END;
$$ LANGUAGE plpgsql;


--EJEMPLO DE LA EJECUCION DE LA QUERY


SELECT actualizar_venta(
    1,            -- p_id_venta -> ID de la venta a actualizar
    '3.000.000',  -- p_cupo -> Nuevo cupo del producto (VARCHAR)
    3.5,          -- p_tasa -> Nueva tasa del producto (NUMERIC)
    2,            -- p_id_tipo_producto -> Nuevo ID del tipo de producto (INT)
    1,            -- p_id_franquicia -> Nuevo ID de la franquicia (INT)
    '2025-03-29 12:00:00', -- p_fecha_venta -> Nueva fecha de la venta (TIMESTAMP)
    1,            -- p_id_usuario_venta -> ID del usuario que hizo la venta (INT)
    2,           -- p_id_usuario_actualizacion -> ID del usuario que actualiza la venta (INT)
    '2025-03-29 12:30:00'  -- p_fecha_actualizacion -> Fecha y hora de la actualización (TIMESTAMP)
);


