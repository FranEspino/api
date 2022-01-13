import { Request, Response } from "express";
const pool = require("../mysql/database");
export const postComments = async (req: Request, res: Response) => {
 // console.log(req);
  const { id_investigacion, id_persona, comentario } = req.body;
  if (!comentario) {
    return res.status(400).json({
      msg: "El comentario es necesario",
    });
  }
  const newComment = {
    id_investigacion,
    id_persona,
    comentario,
    fecha: new Date(),
  };
  try {
    const comment = await pool.query("INSERT INTO comentario SET ?", [
      newComment,
    ]);
    res.json({ msg: "Comentario guardado", comment });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error" });
  }
};

export const getComments = async (req: Request, res: Response) => {
  const { id_investigacion } = req.query;

  if(!id_investigacion){
    return res.status(400).json({ 
      msg: "El id de investigacion es necesario"
    });
  }
  try {
    const comments =
      await pool.query(`SELECT C.id_comentario,C.id_investigacion,C.id_persona,C.comentario, C.fecha, P.nombre, P.apellido,P.dni,P.correo,P.foto  FROM comentario C
      inner JOIN persona P on C.id_persona= P.id_persona
       where C.id_investigacion='${id_investigacion}' order BY(C.fecha) DESC`);
    if (comments.length > 0) {
      return res.json(comments);
    }
    res.json({ msg: "No hay comentarios" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error" });
  }
};
