const { GoogleGenAI, Behavior } = require("@google/genai");
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


module.exports = ai;