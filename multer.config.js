const multer = require('multer');
const { generateUuid } = require('./src/helpers/handleUuid');

const maxSizeInBytes = 5 * 1024 * 1024;

const uploadImage = multer({
  storage: multer.diskStorage({
    destination: "uploads/",
    filename(req, file, callback) {
      const filename = `${generateUuid()}-${file.originalname}`;

      return callback(null, filename);
    },
  }),
  limits: {
    fileSize: maxSizeInBytes
  },
  fileFilter: (req, file, callback) => {
    const allowedMimes = [
      "image/jpeg",
      "image/pjpeg",
      "image/png",
      "image/gif"
    ];

    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      req.fileValidationError = "Invalid file type. Only .jpeg, .pjpeg, .png and .gif format allowed.";

      callback(null, false);
    }
  }
});

module.exports = {
  uploadImage
}