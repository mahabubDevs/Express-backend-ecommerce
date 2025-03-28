const express = require("express");
const routes = express.Router();
const apiRoutes = require("./api");


const api = process.env.BASE_URL;
routes.use(api,apiRoutes);


routes.use(api, (req, res) => res.json("No Api Found On This Route"));




module.exports = routes;

