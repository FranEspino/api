import path from "path";
import multer from "multer";
const diskstorage = multer.diskStorage({
  destination: path.join(__dirname, "../documents"),

  filename: (req, file, cb) => {
    // console.log(file);
    let extension = Date.now() + "-document-" + file.originalname;
    cb(null, extension);
    req.body.document = extension;
  },
});

const fileUpload = multer({
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
  storage: diskstorage,
}).single("documents");

export default fileUpload;
