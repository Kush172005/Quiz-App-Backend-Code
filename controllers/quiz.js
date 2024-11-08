const { prismaClient } = require("../config/database");

const create = async (req, res) => {
    try {
        const { title, description = "placeholder" } = req.body;
        const userId = req.id;
        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        const quiz = await prismaClient.quiz.create({
            data: {
                title,
                description,
                userId,
            },
        });

        return res
            .status(200)
            .json({ message: "Quiz Created Successfully", quiz });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        const userId = req.id;

        if (!title || !id) {
            return res.status(400).json({
                message: "Both Title and id is required to update the quiz",
            });
        }

        const updatedQuiz = await prismaClient.quiz.update({
            where: { id: parseInt(id) },
            data: {
                title,
                description,
                userId,
            },
        });

        return res
            .status(200)
            .json({ message: "Quiz Updated Successfully", updatedQuiz });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const remove = async (req, res) => {
    try {
        const { id } = req.body;
        await prismaClient.quiz.delete({
            where: { id: parseInt(id) },
        });

        return res.status(200).json({ message: "Quiz Deleted Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const getAll = async (req, res) => {
    try {
        const userId = req.id;

        const quizzes = await prismaClient.quiz.findMany({
            where: { userId },
        });

        return res.status(200).json({ quizzes });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.id;

        const quiz = await prismaClient.quiz.findFirst({
            where: { id: parseInt(id), userId: userId },
        });

        if (!quiz) {
            return res
                .status(403)
                .json({ message: "Quiz not found or unauthorized access" });
        }

        return res.status(200).json({ quiz });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { create, update, remove, getAll, getById };
