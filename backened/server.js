require("dotenv").config();

const express =
    require("express");

const cors =
    require("cors");

const connectDB =
    require("./src/db/db");
const fs = require("fs");

const authRoutes =
    require("./src/routes/auth.routes");
const otpRoutes = require("./src/routes/otpRoutes")

const app =
    express();

// Database Connection
connectDB();

const allowedOrigins = (
    process.env.CLIENT_URL ||
    "http://localhost:5173,http://localhost:3000,http://127.0.0.1:3000,http://127.0.0.1:5173"
)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

// Middleware
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin) || origin.startsWith("http://localhost") || origin.startsWith("http://127.0.0.1")) {
                return callback(null, true);
            }
            return callback(null, true);
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
app.use((req, res, next) => {
    console.log("REQUEST:", req.method, req.originalUrl);
    next();
});
const reportRoutes =
    require("./src/routes/reportRoutes");
app.use(
    "/api/reports",
    reportRoutes
);
const path = require("path");




// Test API
app.get(
    "/",
    (req, res) => {
        res.json({
            success: true,
            message:
                "Abhimanyu Backend Running"
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
const opdTokenRoutes = require('./src/routes/opdTokenRoutes')
app.use('/api/opd', opdTokenRoutes)

const doctorRoutes = require("./src/routes/doctor.routes");
app.use("/api/doctors", doctorRoutes);




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
