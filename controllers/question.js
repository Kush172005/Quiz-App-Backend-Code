const { prismaClient } = require("../config/database");

const create = async (req, res) => {
    try {
        const { title, options, correctAnswer, explanation, quizId } = req.body;

        if (!title || !options || !correctAnswer || !explanation || !quizId) {
            return res.status(400).json({ message: "All Fields are required" });
        }

        await prismaClient.question.create({
            data: {
                title,
                options,
                correctAnswer,
                explanation,
                quizId: Number(quizId),
            },
        });

        return res
            .status(200)
            .json({ message: "Question Created Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            description,
            options,
            correctAnswer,
            explanation,
            quizId,
        } = req.body;

        if (!title || !options || !correctAnswer || !explanation || !quizId) {
            return res.status(400).json({ message: "All fields are required" });
        }

        await prismaClient.question.update({
            where: { id: parseInt(id) },
            data: {
                title,
                description,
                options,
                correctAnswer,
                explanation,
                quizId,
            },
        });

        return res
            .status(200)
            .json({ message: "Question updated successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const remove = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Question ID is required" });
        }

        const d = await prismaClient.question.delete({
            where: { id: parseInt(id) },
        });

        return res
            .status(200)
            .json({ message: "Question deleted successfully", d });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const getAll = async (req, res) => {
    try {
        const { quizId } = req.params;

        console.log("quizId:", quizId); // Log quizId to check its value

        if (!quizId || isNaN(quizId)) {
            return res.status(400).json({ message: "Invalid quizId" });
        }

        const questions = await prismaClient.question.findMany({
            where: { quizId: parseInt(quizId) },
        });

        return res.status(200).json({ questions });
    } catch (error) {
        console.error("Error fetching questions:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { create, update, remove, getAll };
