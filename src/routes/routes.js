const { Router } = require("express");
const { login } = require("../controllers/login");
const {
  createPost,
  deletePost,
  getPosts,
  updatePost,
  getPost,
} = require("../controllers/posts");
const authentication = require("../middlewares/authentication");

const routes = Router();

routes.post("/login", login);

routes.get("/posts", getPosts);
routes.get("/posts/:id", getPost);
routes.post("/posts", authentication, createPost);
routes.put("/posts/:id", authentication, updatePost);
routes.delete("/posts/:id", authentication, deletePost);

module.exports = routes;
