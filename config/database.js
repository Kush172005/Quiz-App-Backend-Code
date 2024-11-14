const { PrismaClient } = require("@prisma/client");

const prismaClient = new PrismaClient();

async function connectDB() {
    try {
        const res = await prismaClient.$connect();
        console.log("Database connected successfully.", res);
    } catch (error) {
        console.error("Failed to connect to the database:", error);
    }
}

module.exports = { prismaClient, connectDB };
