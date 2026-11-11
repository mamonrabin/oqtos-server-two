
import multer from "multer";
import AppError from "../helpers/AppError.js";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new AppError(400, "Only image files are allowed"));
    }

    cb(null, true);
  },
});

export default upload;
