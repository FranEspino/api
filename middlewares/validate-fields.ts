import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
export const validateFields = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    //para eliminar archivos creados por error
    if (req.body.document) {
      let directory = path.join(__dirname, "../documents/" + req.body.document);
      fs.unlinkSync(directory);
    }

    if (req.body.avatar != "undefined" && req.body.document) {
      let directory = path.join(
        __dirname,
        "../public/images/" + req.body.avatar
      );
      fs.unlinkSync(directory);
    }
    /////////////////////////
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
