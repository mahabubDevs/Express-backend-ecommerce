const express = require("express");
const routes = express.Router();

routes.get("/", (req, res) => {
    res.json("Auth Route");
});



module.exports = routes;