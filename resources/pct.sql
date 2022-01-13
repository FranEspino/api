DROP DATABASE IFEXIST pct;
CREATE DATABASE pct;
USE pct;
CREATE TABLE persona(
    id_persona INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(60) NOT NULL ,
    apellido VARCHAR(60) NOT NULL,
    dni CHAR(9) NOT NULL UNIQUE,
    telefono CHAR(9) NOT NULL,
    direccion VARCHAR(45),
    correo VARCHAR(45),
    foto VARCHAR(200)
);

CREATE TABLE investigador(
	id_investigador INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_persona INTEGER NOT NULL,
    carrera VARCHAR(60) NOT NULL,
    facultad VARCHAR(60) NOT NULL,
    CONSTRAINT fk_investigador_persona FOREIGN KEY(id_persona) REFERENCES persona(id_persona)
);

CREATE TABLE asesor(
	id_asesor INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_persona INTEGER NOT NULL,
    profesion VARCHAR(60) ,
    CONSTRAINT fk_asesor_persona FOREIGN KEY(id_persona) REFERENCES persona(id_persona)
);


CREATE TABLE investigacion(
  id_investigacion INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT, 
  id_investigador INTEGER NOT NULL,
  url_archivo VARCHAR(100),
  titulo VARCHAR(60) NOT NULL,
  descripcion VARCHAR(250) NOT NULL,
  fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_investigacion_investigador FOREIGN KEY(id_investigador) REFERENCES investigador(id_investigador)
);

CREATE TABLE comentario(
	id_comentario INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT, 
    id_investigacion INTEGER NOT NULL,
    id_persona INTEGER NOT NULL,
    comentario VARCHAR(250),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comentario_investigacion FOREIGN KEY(id_investigacion) REFERENCES investigacion(id_investigacion),
    CONSTRAINT fk_comentario_persona FOREIGN KEY(id_persona) REFERENCES persona(id_persona)
);

CREATE TABLE cita (
    id_cita  INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_investigacion INTEGER NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    descripcion VARCHAR(200) NOT NULL,
    fecha VARCHAR(100) NOT NULL,
    hora VARCHAR(100) NOT NULL,
    link VARCHAR(150) NOT NULL,
    CONSTRAINT fk_cita_investigacion FOREIGN KEY(id_investigacion) REFERENCES investigacion(id_investigacion)
);

CREATE TABLE detalle_investigacion(
    id_asesor INTEGER NOT NULL,
    id_investigacion INTEGER NOT NULL,
    estado VARCHAR(45),
    comentario TEXT,
    avance INT,
    CONSTRAINT fk_detalle_asesor FOREIGN KEY(id_asesor) REFERENCES asesor(id_asesor),
    CONSTRAINT fk_detalle_investigacion FOREIGN KEY(id_investigacion) REFERENCES investigacion(id_investigacion)
);



CREATE TABLE tipo_cuenta(
    id_tipocuenta INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT, 
    nombre VARCHAR(65) NOT NULL
);

CREATE TABLE usuario(
    id_cuenta  INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT, 
    id_persona INTEGER NOT NULL,
    id_tipocuenta INTEGER NOT NULL, 
    dni VARCHAR(60) NOT NULL,
    clave VARCHAR(60) NOT NULL,
    CONSTRAINT fk_usuario_tipo FOREIGN KEY(id_tipocuenta) REFERENCES tipo_cuenta(id_tipocuenta),
    CONSTRAINT fk_usuario_persona FOREIGN KEY(id_persona) REFERENCES persona(id_persona)
);


CREATE TABLE historial(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    id_investigacion INTEGER NOT NULL,
    comentario TEXT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,   
    avance INT,
    CONSTRAINT fk_historial_investigacion FOREIGN KEY(id_investigacion) REFERENCES investigacion(id_investigacion)
);

INSERT INTO tipo_cuenta VALUES(2000,'asesor');
INSERT INTO tipo_cuenta VALUES(3000,'investigador');

delimiter $
CREATE TRIGGER AGREGAR_AVANCE_AU
AFTER UPDATE ON detalle_investigacion
FOR EACH ROW 
BEGIN
INSERT INTO historial values(null,new.id_investigacion,new.comentario,now(),new.avance);
END;
$





