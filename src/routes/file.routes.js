const { Router } = require("express");

const { createGenericUpload } = require("../controllers/file");

const authentication = require("../middlewares/authentication");

const { uploadImage } = require("../../multer.config");

const routes = Router();

routes.post(
  "/upload",
  authentication,
  uploadImage.single("image"),
  createGenericUpload
);

module.exports = routes;
