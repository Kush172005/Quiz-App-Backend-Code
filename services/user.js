const { prismaClient } = require("../config/database");

class User {
    static async getUserFromEmail(emails) {
        if (!Array.isArray(emails) || emails.length === 0) {
            return [];
        }

        const users = await prismaClient.user.findMany({
            where: {
                email: {
                    in: emails,
                },
            },
        });

        return users;
    }
}

module.exports = { User };
