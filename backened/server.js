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

const app =
    express();

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

app.use(
    express.json()
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

// OTP API
app.use(
    '/api/otp',
    otpRoutes
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
