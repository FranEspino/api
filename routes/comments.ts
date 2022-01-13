import { Router } from "express";
import { check } from "express-validator";
import { validPerson, existsInvestigation } from "../helpers/db-validators";
import { validateFields } from "../middlewares/validate-fields";
import { postComments, getComments } from "../controllers/comments";
const router = Router();

router.get(
  "/",
  [check("id_investigacion").custom(existsInvestigation), validateFields],
  getComments
);
router.post(
  "/",
  [
    check("id_investigacion").custom(existsInvestigation),
    check("id_persona").custom(validPerson),
    check("comentario").not().isEmpty(),
    validateFields,
  ],
  postComments
);

export default router;
