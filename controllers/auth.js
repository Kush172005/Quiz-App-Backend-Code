const bcrypt = require("bcryptjs");
const { prismaClient } = require("../config/database");
const Validator = require("../utils/validators");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        const validation = Validator.inputValidation({ email, password });
        if (!validation.isInputValid) {
            return res.status(400).json({ message: `${validation.msg}` });
        }

        const userExists = await prismaClient.user.findUnique({
            where: { email },
        });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = bcrypt.hashSync(password.toString(), 4);
        const user = await prismaClient.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return res
            .status(200)
            .json({ message: "User created successfully", user });
    } catch (error) {
        console.error("Error signing up:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const validation = Validator.inputValidation({ email, password });
        if (!validation.isInputValid) {
            return res.status(400).json({ message: validation.msg });
        }

        const user = await prismaClient.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const payload = { id: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET);

        return res
            .status(200)
            .json({ message: "Login successful", token, user });
    } catch (error) {
        console.error("Error logging in:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getUser = async (req, res) => {
    try {
        const userId = req.id;
        const user = await prismaClient.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Error logging in:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { signup, login, getUser };
