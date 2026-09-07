const mongoose = require("mongoose");
const dns = require("dns");

// Set reliable DNS servers to resolve MongoDB SRV records on Windows
try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
    console.warn("Could not set custom DNS servers:", e.message);
}

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);

        console.log(
            `MongoDB Connected: ${connection.connection.host}`
        );
    } catch (error) {
        console.error(
            "MongoDB Connection Error:",
            error.message
        );
    }
};

module.exports = connectDB;

