const express = require("express");
const cors = require("cors");
const { prismaClient, connectDB } = require("./config/database");
const dotenv = require("dotenv");
const VoterService = require("./services/voter");
const AuthService = require("./services/auth");
const Validator = require("./utils/validators");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.post("/signup", async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const validation = Validator.inputValidation({ email, password });
        if (!validation.isInputValid) {
            return res.status(400).json({ message: `${validation.msg}` });
        }

        const userExists = await VoterService.getVoterByEmail(email);
        console.log(userExists);
        if (userExists) {
            return res.status(400).json({
                message:
                    "Email already exists, try signing up with some other email",
            });
        }

        const voterService = new VoterService({ name, email, password });
        await voterService.createVoter();
        return res
            .status(200)
            .json({ message: "Account created Successfully!" });
    } catch (error) {
        console.error("Error signing up:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const validation = Validator.inputValidation({ email, password });
        if (!validation.isInputValid) {
            return res.status(400).json({ message: `${validation.msg}` });
        }

        const voter = await VoterService.getVoterByEmail(email);
        if (!voter) {
            return res
                .status(401)
                .json({ message: "email not found, try signing-up first" });
        }

        const passwordCheck = await AuthService.authenticateByPassword(
            voter.id,
            password
        );

        if (!passwordCheck.isPasswordValid) {
            return res.status(401).json({ message: "Password is incorrect" });
        }

        const accessToken = await AuthService.createToken(voter);

        return res
            .status(200)
            .json({ message: "Login successful", accessToken, user: voter });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Failed to login" });
    }
});

app.post("/createQuiz", async (req, res) => {
    const { title, questions, userId } = req.body;

    if (!title || !questions || !userId) {
        return res
            .status(400)
            .json({ error: "Quiz title, questions, and userId are required" });
    }

    try {
        const newQuiz = await prismaClient.quiz.create({
            data: {
                title,
                userId,
                questions: {
                    create: questions.map((question) => ({
                        question: question.question,
                        options: question.options,
                        correctAnswers: question.ans,
                        explanation: question.explanation,
                    })),
                },
            },
        });

        res.status(201).json({
            message: "Quiz created successfully",
            quiz: newQuiz,
        });
    } catch (error) {
        console.error("Error during quiz creation:", error);
        res.status(500).json({ error: "Failed to create quiz" });
    }
});

app.delete("/deleteQuiz/:id", async (req, res) => {
    const quizId = req.params.id;

    try {
        await prismaClient.quiz.delete({
            where: { id: parseInt(quizId) },
        });

        res.status(200).json({ message: "Quiz deleted successfully" });
    } catch (error) {
        console.error("Error during quiz deletion:", error);
        res.status(500).json({ error: "Failed to delete quiz" });
    }
});

app.listen(4000, () => {
    console.log("Server running on http://localhost:4000");
});
