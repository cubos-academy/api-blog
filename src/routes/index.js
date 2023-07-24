const { Router } = require("express");
require("express-async-errors");

const routes = Router();

const allRoutes = require("./routes");
const fileRoutes = require("./file.routes");

routes.get("/", (_, response) =>
  response.status(200).json({ message: "hi 😎" })
);

routes.use(allRoutes);
routes.use(fileRoutes);

module.exports = routes;
