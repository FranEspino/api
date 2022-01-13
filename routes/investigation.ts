import { Router } from "express";
import { check } from "express-validator";
import { existsInvestigator, existsAsesor } from "../helpers/db-validators";
import { validateFields } from "../middlewares/validate-fields";

import fileUpload from "../middlewares/file-multer";
import {
  postInvestigation,
  getInvestigations,
  putInvestigations,
  putDetalleInvestigacion,
  putArchivo,
  putArchivo64,
  getDetalleHistorial
} from "../controllers/investigation";

const router = Router();

router.post(
  "/",
  fileUpload,
  [
    check("id_investigador", "El id del investigador es obligatorio").custom(
      existsInvestigator
    ),
    check("titulo", "Se requiere un titulo").not().isEmpty(),
    check("id_asesor", "El id del asesor es obligatorio").custom(existsAsesor),
    validateFields,
  ],
  postInvestigation
);
router.put("/archivo/:id_investigacion", fileUpload,putArchivo);
router.put("/archivo64",putArchivo64);
router.get("/", getInvestigations);

router.put("/", fileUpload, putInvestigations);
router.put("/detalle", putDetalleInvestigacion);
router.get("/detalle/historial/:id_investigacion", getDetalleHistorial);
export default router;
/* 
    url_archivo,
    titulo,
    descripcion,
    fecha_inicio,
  */
