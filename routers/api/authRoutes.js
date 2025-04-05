const express = require("express");
const { createUser, loginUser, cookies } = require("../../controllers/userController");

const routes = express.Router();
routes.post("/register", createUser);
routes.post("/login", loginUser);

routes.get('/check-cookie', cookies );




module.exports = routes;