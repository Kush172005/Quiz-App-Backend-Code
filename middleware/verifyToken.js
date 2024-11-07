const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(400).json({ message: "Token does not exists" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
        if (err) {
            return res.status(400).json({ message: "Invalid Token" });
        }
        console.log(decode);
        req.id = decode.id;
        next();
    });
};

module.exports = { verifyToken };
