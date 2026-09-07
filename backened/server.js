require("dotenv").config();

const express =
    require("express");

const cors =
    require("cors");

const connectDB =
    require("./src/db/db");

const authRoutes =
    require("./src/routes/auth.routes");
const otpRoutes = require("./src/routes/otpRoutes")
const chatRoutes = require("./src/routes/chat.routes")
const opdTokenRoutes = require("./src/routes/OPD.token.routes")
const app =
    express();

app.use((req, res, next) => {
    express.json({
        strict: false,
        limit: "10mb",
        verify: (req, res, buf) => {
            try {
                JSON.parse(buf.toString());
            } catch (err) {
                req.invalidJson = true;
            }
        }
    })(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: "Invalid JSON payload."
            });
        }

        if (req.invalidJson && req.body !== undefined && req.headers["content-type"]?.includes("application/json")) {
            return res.status(400).json({
                success: false,
                message: "Invalid JSON payload."
            });
        }

        next();
    });
});

// Database Connection
connectDB();

const allowedOrigins = (
    process.env.CLIENT_URL ||
    "http://localhost:5173,http://localhost:3000"
)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

// Middleware
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error("CORS origin not allowed"));
        },
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
        optionsSuccessStatus: 204
    })
);

// Test API
app.get(
    "/",
    (req, res) => {
        res.json({
            success: true,
            message:
                "PulsePlus Backend Running"
        });
    }
);

// Auth API
app.use(
    "/api/auth",
    authRoutes
);
const testRoutes = require("./src/routes/testRoute");

app.use("/api/test", testRoutes);

app.use(
    "/api/tokens",
    opdTokenRoutes
);

// OTP API
app.use(
    '/api/otp',
    otpRoutes
);
app.use(
    "/api/chatbot",
    chatRoutes
);

// 404
app.use(
    (req, res) => {
        res.status(404).json({
            success: false,
            message:
                "Route not found"
        });
    }
);

app.use((err, req, res, next) => {
    if (err?.type === "entity.parse.failed") {
        return res.status(400).json({
            success: false,
            message: "Invalid JSON payload."
        });
    }

    console.error("SERVER_ERROR:", err);

    return res.status(500).json({
        success: false,
        message: "Server error"
    });
});

const PORT =
    process.env.PORT ||
    5000;

app.listen(
    PORT,
    () => {
        console.log(
            `Server running at http://localhost:${PORT}`
        );
    }
);
