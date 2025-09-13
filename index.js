const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/database");
const dotenv = require("dotenv");
const cron = require("node-cron");

const { authRoutes } = require("./routes/auth");
const { questionRoutes } = require("./routes/questions");
const { quizRoutes } = require("./routes/quiz");
const { verifyToken } = require("./middleware/verifyToken");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/question", verifyToken, questionRoutes);
app.use("/api/quiz", verifyToken, quizRoutes);

app.get("/ping", (req, res) => {
    res.status(200).send("Server is alive 🚀");
});

app.listen(4000, () => {
    console.log("Server running on http://localhost:4000");
});

cron.schedule("*/10 * * * *", async () => {
    try {
        const url = "https://quiz-app-backend-code.onrender.com";

        const res = await fetch(url);
        console.log("Ping status:", res);
    } catch (err) {
        console.error("Error during keep-alive ping:", err.message);
    }
});
