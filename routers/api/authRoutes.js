const express = require("express");
const { createUser, loginUser } = require("../../controllers/userController");

const routes = express.Router();
routes.post("/register", createUser);
routes.post("/login", loginUser);



module.exports = routes;