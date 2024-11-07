const express = require("express");
const { create, update, remove, getAll } = require("../controllers/question");

const questionRoutes = express.Router();

questionRoutes.get("/get/:quizId", getAll);
questionRoutes.put("/update/:id", update);
questionRoutes.delete("/delete/:id", remove);
questionRoutes.post("/create", create);

module.exports = { questionRoutes };
