import { Request, Response } from "express";
import path from "path";
import fs from "fs";
export const getDocuments = async (req: Request, res: Response) => {
  try {
    //console.log(req.params.data);
    let url = path.join(__dirname, "../documents/" + req.params.data + ".pdf");
    //  console.log(url);
    await fs.access(url, fs.constants.F_OK, (err) => {
      console.log(`${url} ${err ? "is not writable" : "is writable"}`);
    });

    await fs.readFile(url, function (err, data) {
      if (err) {
        return res.status(500).json({ msg: "Error al leer el archivo" });
        //   console.log(err);
      }
      //    console.log(data);
      res.writeHead(200, { "Content-Type": "application/pdf" });
      res.write(data);
      return res.end();
    });
    // console.log(investigation);
  } catch (e) {
    return res.status(500).json({ msg: "Error al obtener investigaciones" });
  }
};

export const getImage = async (req: Request, res: Response) => {
  try {
    let url = path.join(__dirname, "../image/" + req.params.data + ".jpg");
    console.log(url);
    fs.access(url, fs.constants.F_OK, (err) => {
      console.log(`${url} ${err ? "is not writable" : "is writable"}`);
    });

    await fs.readFile(url, function (err, data) {
      if (err) {
        res.status(500).json({ msg: "Error al leer el archivo" });
        //   console.log(err);
      }
      //    console.log(data);
      res.writeHead(200, { "Content-Type": "image/jpeg" });
      res.write(data);
      return res.end();
    });
    // console.log(investigation);
  } catch (e) {
    res.status(500).json({ msg: "Error al obtener investigaciones" });
  }
};
