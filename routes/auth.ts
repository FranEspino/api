import { Router } from "express";
import { check } from "express-validator";
import { validateFields } from "../middlewares/validate-fields";
import { login } from "../controllers/login";

const router = Router();
router.post(
  "/",
  [
    check("dni", "el dni es obligatorio").not().isEmpty().isLength({ min: 8 }),
    check("clave", "la clave es obligatorio").not().isEmpty(),
    validateFields,
  ],
  login
);

export default router;
