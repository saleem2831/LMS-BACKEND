
import multer from "multer";
import multerS3 from "multer-s3";
import s3 from "../config/s3.js";
import { ENV } from "../config/env.js";


const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: ENV.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,

    key: function (req, file, cb) {
      const fileName = Date.now() + "-" + file.originalname;
      cb(null, fileName);
    }
    
  })
});

export default upload;