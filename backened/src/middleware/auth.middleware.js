const jwt = require("jsonwebtoken");

const normalizeToken = (value) => {
    if (typeof value !== "string") return "";
    const trimmed = value.trim();
    if (!trimmed || ["undefined", "null"].includes(trimmed.toLowerCase())) return "";
    return trimmed.replace(/^Bearer\s+/i, "");
};

const isJwtLike = (value) => /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(value || "");

const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization || "";
        const alternateToken = req.headers["x-auth-token"] || req.headers["x-access-token"] || req.headers["x-jwt-token"];
        const bodyToken = req.body?.token;
        const queryToken = req.query?.token;

        let token = normalizeToken(authHeader);

        if (!token && typeof alternateToken === "string") {
            token = normalizeToken(alternateToken);
        }

        if (!token && typeof bodyToken === "string") {
            token = normalizeToken(bodyToken);
        }

        if (!token && typeof queryToken === "string") {
            token = normalizeToken(queryToken);
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication token is required"
            });
        }

        if (!isJwtLike(token)) {
            return res.status(401).json({
                success: false,
                message: "Invalid session. Please login again."
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            id: decoded.id || decoded._id,
            _id: decoded.id || decoded._id,
            role: decoded.role || "patient"
        };

        return next();

    } catch (error) {
        console.error("JWT AUTH ERROR:", error.message);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token expired. Please login again."
            });
        }

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
            error: error.message
        });
    }
};

module.exports = {
    verifyToken
};