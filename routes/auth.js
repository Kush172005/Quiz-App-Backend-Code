const express = require("express");
const { signup, login, getUser, getUserById } = require("../controllers/auth");
const { verifyToken } = require("../middleware/verifyToken");

const authRoutes = express.Router();

authRoutes.post("/login", login);
authRoutes.post("/signup", signup);
authRoutes.get("/getUser", verifyToken, getUser);

module.exports = { authRoutes };
