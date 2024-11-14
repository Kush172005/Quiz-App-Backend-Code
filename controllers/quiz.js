const { prismaClient } = require("../config/database");
const { User } = require("../services/user");

const create = async (req, res) => {
    try {
        const {
            title,
            description = "placeholder",
            accessType = "public",
            accessTo = [],
        } = req.body;
        const userId = req.id;

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        if (!["private", "public", "restricted"].includes(accessType)) {
            return res.status(400).json({ message: "Invalid access type" });
        }

        if (accessType === "restricted" && accessTo.length === 0) {
            return res.status(400).json({
                message:
                    "Access to users (emails) is required for restricted quizzes",
            });
        }

        const users = await User.getUserFromEmail(accessTo);

        const userIds = users.map((user) => {
            return user.id;
        });

        const quiz = await prismaClient.quiz.create({
            data: {
                title,
                description,
                accessType,
                accessTo: userIds,
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
        console.log(
            { accessType: "public" },

            // for the Restricted quizzes where the user has access
            { accessType: "restricted", accessTo: { has: userId } },

            // for the quizzes created by the user
            { userId: userId }
        );

        const quizzes = await prismaClient.quiz.findMany()

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
