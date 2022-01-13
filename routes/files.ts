import { Router } from "express";
import { getDocuments, getImage } from "../controllers/files";

const router = Router();

router.get("/documents/:data", getDocuments);
router.get("/image/:data", getImage);

export default router;
