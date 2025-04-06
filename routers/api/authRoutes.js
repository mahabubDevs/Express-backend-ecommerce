const express = require("express");

const {
    createUser,
    loginUser,
    adminLogin,
    handleRefreshToken,
    logout,
    updateUser,
} = require("../../controllers/userController");

const { authMiddleware, isAdmin } = require("../../middlewares/authMiddleware");

const routes = express.Router();

routes.post("/register", createUser);
routes.post("/login", loginUser);
routes.post("/admin-login", adminLogin);



routes.get("/refresh", handleRefreshToken);
routes.get("/logout", logout)

routes.put("/update-user/:id", authMiddleware, updateUser);




module.exports = routes;