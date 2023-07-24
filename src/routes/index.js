const { Router } = require("express");
require("express-async-errors");
const { globalErrorHandler } = require("../controllers/error");

const routes = Router();

const allRoutes = require("./routes");
const fileRoutes = require("./file.routes");

routes.get("/", (_, response) =>
  response.status(200).json({ message: "hi 😎" })
);

routes.use(allRoutes);
routes.use(fileRoutes);

routes.use(globalErrorHandler);

module.exports = routes;
