import { Request, response, Response } from "express";
const pool = require("../mysql/database");

//	id_cita	id_investigacion	titulo	descripcion	fecha	hora	link

export const postCites = async (req: Request, res: Response) => {
  const { id_investigacion, titulo, descripcion, fecha, hora, link } = req.body;
  try {
    if (id_investigacion && titulo && descripcion && fecha && hora && link) {
      const investigacion = await pool.query(
        `SELECT * from investigacion where id_investigacion=${id_investigacion}`
      );
      if (investigacion.length > 0) {
        let newCite = {
          id_investigacion,
          titulo,
          descripcion,
          fecha,
          hora,
          link,
        };
        const cite = await pool.query("INSERT INTO cita set ?", [newCite]);
        res.json({ msg: "Cita guardada", cite });
      } else {
        res.status(401).json({ msg: "Investigacion no existe" });
      }
    } else {
      res.status(401).json({ msg: "Faltan datos" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Error al guardar cita" });
  }
};

export const getCites = async (req: Request, res: Response) => {
  const { id_investigacion } = req.query;
  try {
    if (id_investigacion) {
      const cites = await pool.query(
        `SELECT * from cita where id_investigacion=${id_investigacion}`
      );
      if (cites.length > 0) {
        res.json({ cites });
      } else {
        res.status(401).json({ msg: "No hay citas" });
      }
    } else {
      res.status(401).json({ msg: "Faltan datos" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Error al consultar citas" });
  }
};

export const putCites = async (req: Request, res: Response) => {
  const { id_cita, id_investigacion, titulo, descripcion, fecha, hora, link } =
    req.body;

  try {
    if (
      id_cita &&
      id_investigacion &&
      titulo &&
      descripcion &&
      fecha &&
      hora &&
      link
    ) {
      const cite = await pool.query(
        `SELECT * from cita where id_cita=${id_cita}`
      );

      if (cite.length > 0) {
        const cite = await pool.query(`
          UPDATE cita  set   id_investigacion=${id_investigacion},
                titulo='${titulo}',
                descripcion='${descripcion}',
                fecha='${fecha}',
                hora='${hora}',
                link='${link}'
                WHERE id_cita =${id_cita}`);

        //   console.log(req.body, "cita", cite);
        res.json({ msg: "Cita actualizada", cite });
      } else {
        res.status(401).json({ msg: "Cita no existe" });
      }
    } else {
      res.status(401).json({ msg: "Faltan datos" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al actualizar cita" });
  }
};
