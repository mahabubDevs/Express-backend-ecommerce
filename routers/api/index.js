const express = require("express");
const routes = express.Router();
const authRoutes = require("./authRoutes");

routes.use("/user", authRoutes);



module.exports = routes;