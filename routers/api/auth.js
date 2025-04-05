const express = require("express");
const routes = express.Router();
const {loginController, registerController} = require("../../controllers/userController");

routes.get("/login", loginController)
routes.get("/register", registerController)



module.exports = routes;