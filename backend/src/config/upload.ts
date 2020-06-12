import multer from "multer";
import * as path from "path";

const storage = multer.diskStorage({
  destination: path.resolve(__dirname, "..", "..", "tmp", "uploads"),
  filename: function (req, file, cb) {
    const fileData = file.originalname.split(".");
    const filename =
      fileData[0] + "-" + Date.now() + path.extname(file.originalname);
    cb(null, filename);
  },
});

export default storage;
