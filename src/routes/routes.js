const { Router } = require("express");
const { login } = require("../controllers/login");
const authentication = require("../middlewares/authentication");

const routes = Router();

routes.post("/login", login);

routes.get("/posts");
routes.post("/posts", authentication);
routes.put("/posts", authentication);
routes.delete("/posts", authentication);

module.exports = routes;
