import { Router } from "express";
import { check } from "express-validator";
import { existsInvestigation, existsAsesor } from "../helpers/db-validators";
import { validateFields } from "../middlewares/validate-fields";
import { postCites, getCites, putCites } from "../controllers/cites";

const router = Router();

router.post("/", postCites);
router.get("/", getCites);
router.put(
  "/",
  [check("id_investigacion").custom(existsInvestigation), validateFields],
  putCites
);
//router.delete("/");
export default router;
