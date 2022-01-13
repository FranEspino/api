import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
const pool = require("../mysql/database");

export const login = async (req: Request, res: Response) => {
  const { dni, clave } = req.body;
  try {
    if (!dni || !clave) {
      return res.status(409).json({ msg: "faltan datos" });
    }

    const usuario = await pool.query(`SELECT *FROM usuario where dni=${dni}`);
    //console.log(usuario);
    const validPassword = bcryptjs.compareSync(clave, usuario[0].clave);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Usuario /password no son correctos - password",
      });
    }

    const { id_persona } = usuario[0];
    const persona = await pool.query(
      `SELECT *FROM persona where id_persona="${id_persona}"`
    );

    const rol = await pool.query(
      `SELECT * from investigador where id_persona=${persona[0].id_persona}`
    );
    if (rol.length > 0) {
      return res.json({
        persona,
        rol: {
          tipo: "investigador",
          id_rol: rol[0].id_investigador,
 
        },
      });
    } else {
      const rol = await pool.query(
        `SELECT * from asesor  where id_persona=${persona[0].id_persona}`
      );
      if (rol.length > 0) {
        return res.json({
          persona,
          rol: {
            tipo: "asesor",
            id_rol: rol[0].id_asesor
          },
        });
      }
    }
    res.json({
      persona,
      rol: {
        tipo: "administrador",
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "No se pudo autentificar" });
  }
};
