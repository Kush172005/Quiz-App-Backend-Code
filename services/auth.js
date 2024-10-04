const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { prismaClient } = require("../config/database");

class AuthService {
    static async createToken(userData) {
        let payload = { id: userData.id };
        let accesses = [];
        const voter = await prismaClient.voter.findUnique({
            where: { id: userData.id },
        });
        if (voter) {
            accesses = [...accesses, voter];
        }

        return jwt.sign(payload, process.env.JWT_SECRET, {
            algorithm: "HS256",
        });
    }

    static async authenticateByPassword(id, passwordInput) {
        const voter = await prismaClient.voter.findUnique({ where: { id } });
        const isPasswordValid = bcrypt.compareSync(
            passwordInput,
            voter.password
        );
        return { isPasswordValid };
    }
}

module.exports = AuthService;
