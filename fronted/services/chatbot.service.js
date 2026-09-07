import api from "./api";

export const askChatbot = async (message, image = null) => {
    console.log("🔥 CHATBOT SERVICE STARTED");
    console.log("📨 MESSAGE:", message);

    try {
        const response = await api.post("/chatbot/chat", {
            message: String(message || "").trim(),
            image: image || null,
        });

        console.log("✅ BACKEND RESPONSE:", response.data);

        const reply =
            response.data?.reply ||
            response.data?.data?.reply ||
            response.data?.message ||
            "No reply received from backend.";

        return reply;
    } catch (error) {
        console.error("❌ CHATBOT API FAILED");
        console.error("STATUS:", error.response?.status);
        console.error("DATA:", error.response?.data);
        console.error("FULL ERROR:", error);

        const backendMessage =
            error.response?.data?.message ||
            "Chatbot service is unavailable right now.";

        throw new Error(backendMessage);
    }
};