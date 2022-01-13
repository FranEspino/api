import { Request, Response } from "express";
import bcrypt, { compareSync } from "bcryptjs";
const pool = require("../mysql/database");
import path from "path";
import fs from "fs";
export const getUsers = async (req: Request, res: Response) => {
  try {
    const investigators = await pool.query(`select *
          from investigador as inv inner join persona as  pers
         on inv.id_persona=pers.id_persona;
         `);

    const advisors = await pool.query(`select * from asesor inner join persona 
    on asesor.id_persona=persona.id_persona;
    `);

    const admin = await pool.query(` select * from usuario  as us
    inner join tipo_cuenta  as tc
    on us.id_tipocuenta = tc.id_tipocuenta
    inner join persona as p
    on us.id_persona = p.id_persona where tc.nombre= "ADMIN";`);

    res.json({
      investigadores: investigators,
      asesores: advisors,
      administradores: admin,
    });
  } catch (e) {
    res.status(500).json({
      msg: "error en la peticion",
    });
  }
};

export const postUser = async (req: Request, res: Response) => {
  let {
    nombre,
    apellido,
    dni,
    telefono,
    direccion,
    correo,
    foto,
    clave,
    tipo_cuenta,
    profesion,
    carrera,
    facultad,
  } = req.body;

  try {
    foto =
      req.body.avatar == "undefined" || req.body.avatar == "null"
        ? ""
        : req.body.avatar;
    // cifrado de contraseña
    const salt = bcrypt.genSaltSync(10);
    // console.log(salt);
    const hash = bcrypt.hashSync(clave, salt);
    const newUser = {
      nombre,
      apellido,
      dni,
      telefono,
      direccion,
      correo,
      foto,
    };

    if (tipo_cuenta.toUpperCase() === "ASESOR") {
      if (!profesion) {
        if (req.body.avatar) {
          let directory = path.join(
            __dirname,
            "../public/images/" + req.body.avatar
          );
          fs.unlinkSync(directory);
        }
        return res.status(409).json({ msg: "profesión no especificada" });
      }
      const dataUser = await pool.query("INSERT INTO persona set ?", [newUser]);
      const tipoCuentaAsesor = await pool.query(
        `select * from tipo_cuenta where nombre="ASESOR"`
      );
      console.log(tipoCuentaAsesor);

      // console.log("tipo de cuenta:", tipoCuentaPasajero[0].id_tipo_cuenta);
      // console.log("hash:", hash);

      const newCuentaAsesor = {
        id_persona: dataUser.insertId,
        id_tipocuenta: tipoCuentaAsesor[0].id_tipocuenta,
        dni,
        clave: hash,
      };

      const cuenta = await pool.query("INSERT INTO usuario set?", [
        newCuentaAsesor,
      ]);
      // console.log("Cuenta:", cuenta);
      const newAsesor = {
        id_persona: dataUser.insertId,
        profesion,
      };

      await pool.query("INSERT INTO asesor set ?", [newAsesor]);
      // console.log("Pasajero:", pasajero);

      res.json({ message: "Usuario creado", data: dataUser });
    }

    if (tipo_cuenta.toUpperCase() === "INVESTIGADOR") {
      console.log("llego a investigador");
      console.log("carrera:", carrera, "facultad:", facultad);
      if (!facultad || !carrera) {
        if (req.body.avatar) {
          let directory = path.join(
            __dirname,
            "../public/images/" + req.body.avatar
          );
          fs.unlinkSync(directory);
        }
        return res.status(400).json({
          msg: "se requiere datos del investigador",
        });
      }
      // console.log("llego a chofer", placa, soat, modelo, color);
      const dataUser = await pool.query("INSERT INTO persona set ?", [newUser]);

      const tipoCuentaInvestigador = await pool.query(
        `select * from tipo_cuenta where nombre="INVESTIGADOR"`
      );

      const newCuentaInvestigador = {
        id_persona: dataUser.insertId,
        id_tipocuenta: tipoCuentaInvestigador[0].id_tipocuenta,
        dni,
        clave: hash,
      };

      await pool.query("INSERT INTO usuario set?", [newCuentaInvestigador]);

      // console.log("Cuenta:", cuenta);

      const newInvestigador = {
        id_persona: dataUser.insertId,
        facultad,
        carrera,
      };

      await pool.query("INSERT INTO investigador set ?", [newInvestigador]);
      // console.log("Chofer:", chofer);
      res.json({ message: "Usuario creado", data: dataUser });
    }
    if (tipo_cuenta.toUpperCase() === "ADMIN") {
      const dataUser = await pool.query("INSERT INTO persona set ?", [newUser]);
      const tipoCuentaAdmin = await pool.query(
        `select * from tipo_cuenta where nombre="ADMIN"`
      );
      const newCuentaAdmin = {
        id_persona: dataUser.insertId,
        id_tipocuenta: tipoCuentaAdmin[0].id_tipocuenta,
        dni,
        clave: hash,
      };

      await pool.query("INSERT INTO usuario set?", [newCuentaAdmin]);

      res.json({ message: "Usuario creado", data: dataUser });
    }
  } catch (err) {
    res.status(400).json({
      msg: "problemas en el resgistro de usuario",
    });
    console.log(err);
  }
};
export const getInvestigators = async (req: Request, res: Response) => {
  try {
    const investigators = await pool.query(`select *
          from investigador as inv inner join persona as  pers
         on inv.id_persona=pers.id_persona;
         `);
    //   console.log(investigators);
    res.json({
      rol: "Investigador",
      investigadores: investigators,
    });
  } catch (e) {
    res.status(500).json({
      msg: "error en la peticion",
    });
  }
};
export const getAdvisors = async (req: Request, res: Response) => {
  try {
    const advisors = await pool.query(`select * from asesor inner join persona 
    on asesor.id_persona=persona.id_persona;
    `);

    res.json({
      rol: "Asesor",
      asesores: advisors,
    });
  } catch (e) {
    res.status(500).json({
      msg: "error en la peticion",
    });
  }
};

export const getAdmin = async (req: Request, res: Response) => {
  try {
    const admin = await pool.query(` select * from usuario  as us
    inner join tipo_cuenta  as tc
    on us.id_tipocuenta = tc.id_tipocuenta
    inner join persona as p
    on us.id_persona = p.id_persona where tc.nombre= "ADMIN";`);
    res.json({
      rol: "Administrador",
      administradores: admin,
    });
  } catch (e) {
    res.status(500).json({
      msg: "error en la peticion",
    });
  }
};

export const putPassword = async (req: Request, res: Response) => {
  const { clave, clave_repetida, dni } = req.body;
  try {
    if (!clave && !clave_repetida && !dni) {
      return res.status(400).json({
        msg: "datos incompletos",
      });
    }
    if (clave !== clave_repetida) {
      return res.status(400).json({
        msg: "las claves no coinciden",
      });
    } else {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(clave, salt);
      await pool.query(`update usuario set clave=? where dni=?`, [hash, dni]);
      return res.json({ msg: "contraseña actualizada" });
    }
  } catch (e) {
    res.status(500).json({
      msg: "error en la peticion",
    });
  }
};


export const putPerson = async (req: Request, res: Response) => {
  const { id_persona } = req.body;
  const { nombre, apellido, telefono, correo, direccion } = req.body;

  if (!nombre || !apellido || !telefono || !correo || !direccion) {
    return res.status(400).json({
      msg: "datos incompletos",
    });
  }
  const newPerson = {
    nombre,
    apellido,
    telefono,
    direccion,
    correo,
  };
  try {
    if (id_persona) {
      const person = await pool.query(
        `select * from persona where id_persona=?`,
        [id_persona]
      );
      if (person.length > 0) {
        await pool.query(`update persona set ? where id_persona=?`, [
          newPerson,
          id_persona,
        ]);
        return res.json({ msg: "datos actualizados" });
      } else {
        return res.status(400).json({
          msg: "no existe la persona",
        });
      }
    } else {
      return res.status(400).json({
        msg: "datos incompletos",
      });
    }
  } catch (e) {
    res.status(500).json({
      msg: "error en la peticion",
    });
  }
};
