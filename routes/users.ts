import { Router } from "express";
import { check } from "express-validator";
import {
  getUsers,
  postUser,
  getInvestigators,
  getAdvisors,
  getAdmin,
  putPerson,
  putPassword
} from "../controllers/users";
import uploadImage from "../middlewares/file-image-multer";
import { existsPerson, existsRole } from "../helpers/db-validators";
import { validateFields } from "../middlewares/validate-fields";

const router = Router();

router.get("/", getUsers);
router.get("/investigadores", getInvestigators);
router.get("/asesores", getAdvisors);
router.get("/admin", getAdmin);
router.put("/configuracion/seguridad",putPassword)
//router.get("/:id");/*
router.post(
  "/",
  uploadImage,
  [
    check("tipo_cuenta").custom(existsRole),
    check("nombre", "se requiere un nombre").not().isEmpty(),
    check("apellido", "se requiere un apellido").not().isEmpty(),
    check("dni", "se requiere un dni").isLength({ min: 8 }),
    check("dni").custom(existsPerson),
    check("telefono", "se requiere numero de telefono").isLength({ min: 9 }),
    check("correo", "se requiere un email").isEmail(),
    check("clave", "se requiere una contraseña").isLength({ min: 6 }),
    validateFields,
  ],
  postUser
);
router.put("/",putPerson);
/*router.delete("/");
*/
export default router;
