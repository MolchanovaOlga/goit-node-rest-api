import path from "node:path";

import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("tmp/avatar"));
  },
  filename: function (req, file, cb) {
    console.log(file);
    // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname);
  },
});

export default multer({ storage });
