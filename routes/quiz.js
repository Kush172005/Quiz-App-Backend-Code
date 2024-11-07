const express = require("express");
const {
    getAll,
    update,
    remove,
    create,
    getById,
} = require("../controllers/quiz");

const quizRoutes = express.Router();

quizRoutes.get("/get", getAll);
quizRoutes.put("/update/:id", update);
quizRoutes.delete("/delete/:id", remove);
quizRoutes.post("/create", create);
quizRoutes.get("/get/:id", getById);

module.exports = { quizRoutes };
