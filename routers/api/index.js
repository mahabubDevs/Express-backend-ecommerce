const express = require("express");
const routes = express.Router();
const auth = require("./auth");

routes.use("/user", auth);



module.exports = routes;