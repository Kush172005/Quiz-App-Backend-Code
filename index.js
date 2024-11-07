const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/database");
const dotenv = require("dotenv");

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

app.listen(4000, () => {
    console.log("Server running on http://localhost:4000");
});
