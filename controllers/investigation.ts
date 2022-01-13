import { Request, Response } from "express";
import path from "path";
import fs from "fs";
const pool = require("../mysql/database");
export const postInvestigation = async (req: Request, res: Response) => {
  let {
    id_investigador,
    url_archivo,
    titulo,
    descripcion,
    fecha_inicio,
    id_asesor,
  } = req.body;

  // console.log("documento:", req.body.document);
  // console.log(req.file?.mimetype);
  // console.log(req.file?.originalname);
  // console.log(req.file?.filename);

  try {
    if (!req.file) {
      return res.status(400).json({
        msg: "Solo se aceptan archivos pdf",
      });
    }

    const investigation = await pool.query(
      `SELECT * from investigacion where id_investigacion=${id_investigador}`
    );
    if (investigation.length > 0) {
      let directory = path.join(__dirname, "../documents/" + req.body.document);
      fs.unlinkSync(directory);
      return res.status(400).json({
        msg: "Ya cuenta con una investigacion",
      });
    }
    url_archivo = req.body.document;
    console.log("url_archivo:", url_archivo);

    url_archivo = url_archivo.substring(0, url_archivo.length - 4);
    console.log(url_archivo);
    await fs.readFileSync(
      path.join(__dirname, "../documents/" + req.file?.filename)
    );
    // console.log(__dirname, "../documents/" + req.file?.filename);

    const newInvestigation = {
      id_investigador,
      url_archivo,
      titulo,
      descripcion,
      fecha_inicio,
    };
    const investigacion = await pool.query("INSERT INTO investigacion set ?", [
      newInvestigation,
    ]);

    const newDetalleInvestigation = {
      id_investigacion: investigacion.insertId,
      id_asesor,
      estado: "Por revisar",
      comentario:"",
      avance: "0",
    };
    const detalleInvestigation = await pool.query(
      "INSERT INTO detalle_investigacion set ?",
      [newDetalleInvestigation]
    );

    res.json({ investigacion, detalleInvestigation });
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Error al crear investigacion" });
  }
};
export const putArchivo = async (req: Request, res: Response) => {
  try {
    const { id_investigacion } = req.params;

    // console.log("id_investigacion:", req);
    if (!req.file) {
      return res.status(400).json({
        msg: "Solo se aceptan archivos pdf",
      });
    }
    let url_archivo = req.body.document;

    url_archivo = url_archivo.substring(0, url_archivo.length - 4);
    const investigation = await pool.query(
      `SELECT * FROM investigacion WHERE id_investigacion = ${id_investigacion}`
    );
    if (investigation.length > 0) {
      await pool.query(
        `UPDATE investigacion SET url_archivo = '${url_archivo}' 
          WHERE id_investigacion = ${id_investigacion}`
      );
      return res.json({ msg: "archivo actualizado", investigation });
    } else {
      let directory = path.join(__dirname, "../documents/" + req.body.document);
      fs.unlinkSync(directory);
      return res.status(404).json({ msg: "investigacion no encontrada" });
    }
  } catch (e) {
    console.log(e);
    let directory = path.join(__dirname, "../documents/" + req.body.document);
    fs.unlinkSync(directory);
    res.status(500).json({ msg: "Error al guardar el archivo" });
  }
};

export const putArchivo64 = async (req: Request, res: Response) => {
  const { documents,id_investigacion } = req.body;
  //console.log("documents:", documents);
  try {
    const investigation = await pool.query(
      `select * from investigacion where id_investigacion=${id_investigacion}`
    );
    if (investigation.length > 0) {
      const tituloInvestigacion = investigation[0].titulo;
      if (
        investigation[0].url_archivo !== "" &&
        investigation[0].url_archivo !== null &&
        investigation[0].url_archivo !== undefined
      ) {
        if (
          fs.existsSync(
            path.join(
              __dirname,
              "../documents/" + investigation[0].url_archivo + ".pdf"
            )
          )
        ) {
          //  console.log("si se encuentra un archivo", investigation[0].url_archivo);
          let directory = path.join(
            __dirname,
            "../documents/" + investigation[0].url_archivo + ".pdf"
          );

          fs.unlinkSync(directory);
        }
      }
      /* let encodedPdf = base64.base64Encode(
        __dirname + "/1636481213106-document-prueba.pdf"
      );
*/
      let extension =
        Date.now() + "-document-" + `${tituloInvestigacion}archivo`;
      let directory = path.join(__dirname, `../documents/${extension}`);

      fs.writeFile(
        `${directory}.pdf`,
        documents,
        { encoding: "base64" },
        function (err) {
          if (err) {
            console.log(err);
            return res.status(500).json({ msg: "Error al guardar el archivo" });
          }
        }
      );
      console.log("archivo guardado");
      await pool.query(`UPDATE investigacion SET url_archivo = '${extension}' 
      WHERE id_investigacion = ${id_investigacion}`);

      await pool.query(`UPDATE detalle_investigacion 
      SET estado = 'por revisar' WHERE id_investigacion = ${id_investigacion}`);

      return res.json({ msg: "archivo actualizado" });
    }
    return res.json({ msg: "no se pudo actualizar" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Error al guardar el archivo" });
  }
};
export const getInvestigations = async (req: Request, res: Response) => {
  const { id_investigador, id_asesor, id_admin } = req.query;
  //console.log(req.body);
  try {
    if (id_investigador) {
      const investigacion = await pool.query(
        `select inv.id_investigacion,inv.url_archivo,inv.titulo,inv.descripcion,inv.fecha_inicio,dtinv.estado,dtinv.avance,ase.id_asesor as 'id_rol',
        per.nombre,per.apellido,per.foto, per.correo, per.telefono from investigacion inv 
        inner join detalle_investigacion as dtinv on 
            inv.id_investigacion=dtinv.id_investigacion
            inner join asesor as ase on dtinv.id_asesor= ase.id_asesor
            inner join persona as per on ase.id_persona=per.id_persona
             where id_investigador = ${id_investigador} `
      );
      return res.json({ investigacion });
    }
    if (id_asesor) {
      const investigacion = await pool.query(
        `select  inv.id_investigacion,inv.url_archivo,inv.titulo,inv.descripcion,inv.fecha_inicio,dtinv.estado,dtinv.avance,itg.id_investigador  as 'id_rol',
        per.nombre,per.apellido,per.foto, per.correo, per.telefono from investigacion inv 
        inner join detalle_investigacion as dtinv on 
            inv.id_investigacion = dtinv.id_investigacion
            inner join investigador as itg on itg.id_investigador=  inv.id_investigador
            inner join persona as per on itg.id_persona=per.id_persona
            where id_asesor = ${id_asesor}`
      );
      return res.json({ investigacion });
    }
    if (id_admin) {
      const investigacion = await pool.query(
        `SELECT INV.id_investigacion,INV.url_archivo, INV.titulo, DI.estado, DI.avance, CONCAT(P1.nombre," ",P1.apellido) as nombres_investigador,  CONCAT(P2.nombre," ",P2.apellido) as nombres_asesor
        FROM investigacion INV 
            INNER JOIN investigador I 
              ON I.id_investigador = INV.id_investigador
              INNER JOIN persona P1 
                ON P1.id_persona = I.id_persona
            INNER JOIN detalle_investigacion DI 
                ON DI.id_investigacion = INV.id_investigacion 
              INNER JOIN asesor A 
                ON A.id_asesor = DI.id_asesor
               INNER JOIN persona P2 
                ON P2.id_persona = A.id_persona`
      );
      return res.json({ investigacion });
    }
    res.status(400).json({ msg: "se requiere datos" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Error " });
  }
};

export const putInvestigations = async (req: Request, res: Response) => {
  let { id_investigacion, url_archivo, titulo, descripcion } = req.body;
  try {
    if (id_investigacion) {
      console.log("id_investigacion", id_investigacion);
      const investigation = await pool.query(
        `SELECT * FROM   investigacion where id_investigacion=${id_investigacion}  `
      );
      if (investigation.length > 0) {
        if (req.file) {
          let directory = path.join(
            __dirname,
            "../documents/" + investigation[0].url_archivo + ".pdf"
          );
          console.log("url_archivo:", url_archivo);
          fs.unlinkSync(directory);
          url_archivo = req.body.document;

          url_archivo = url_archivo.substring(0, url_archivo.length - 4);
        } else {
          url_archivo = investigation[0].url_archivo;
        }

        const investigacion = await pool.query(
          `UPDATE investigacion SET url_archivo = '${url_archivo}', titulo = '${titulo}', descripcion = '${descripcion}' WHERE id_investigacion = ${id_investigacion}`
        );

        return res.json({ investigacion });
      }
    }
    res.status(400).json({ msg: "se requiere datos" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Error " });
  }
};

export const getDetalleHistorial=async(req:Request,res:Response)=>{
console.log(req.params);
const {id_investigacion}=req.params;
console.log("id_investigacion",id_investigacion);
try{
  const detalleHistorial=await pool.query(
    `SELECT * FROM historial WHERE id_investigacion=${id_investigacion}`
  );

  return res.json({detalleHistorial});
} catch(e){
  res.status(500).json({ msg: "Error " });
}
}

export const putDetalleInvestigacion = async (req: Request, res: Response) => {
  let { id_investigacion, estado, avance,comentario } = req.body;
  // console.log("id_investigacion", id_investigacion);
  try {
    if (avance > 100) {
      return res
        .status(400)
        .json({ msg: "el avance no puede ser mayor a 100" });
    }
    if (id_investigacion && estado && avance) {
      //console.log("id_detalle_investigacion", id_investigacion);

      const detalleInvestigation = await pool.query(
        `SELECT * FROM   detalle_investigacion where id_investigacion=${id_investigacion}  `
      );

      if (detalleInvestigation.length > 0) {
        const investigacion = await pool.query(
          `UPDATE detalle_investigacion SET estado = '${estado}', avance = '${avance}', comentario = '${comentario}'  WHERE id_investigacion = ${id_investigacion}`
        ); 

        return res.json({
          msg: "detalles de investigación actualizado",
          investigacion,
        });
      }
    }
    res.status(400).json({ msg: "se requiere datos" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Error " });
  }
};
