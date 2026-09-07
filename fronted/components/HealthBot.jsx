import React, { useState, useRef, useEffect } from "react";
import { Language } from "../../backened/types";
import { askChatbot } from "../services/chatbot.service";
import api from '../services/api';
const HealthBot = ({
lang = Language.EN,
isPopup = false,
onClose
}) => {
// =====================================================
// LANGUAGE
// =====================================================

const isHindi = lang === Language.HI;

// =====================================================
// STATES
// =====================================================

const [messages, setMessages] = useState([]);
const [input, setInput] = useState("");
const [loading, setLoading] = useState(false);

// Voice states
const [isListening, setIsListening] = useState(false);
const [isSpeaking, setIsSpeaking] = useState(false);
const [voiceError, setVoiceError] = useState("");

// =====================================================
// REFS
// =====================================================

const recognitionRef = useRef(null);

// Controls whether mic should continue/restart
const shouldRestartRef = useRef(false);

// Current listening state without React delay
const isListeningRef = useRef(false);

// Stores voice transcript
const transcriptRef = useRef("");

// Auto scroll
const scrollRef = useRef(null);

// =====================================================
// INITIAL MESSAGE
// =====================================================

const getInitialMessage = () => {
if (isHindi) {
return `👋 नमस्ते! मैं अभिमन्यु हेल्थ एआई हूं।

मैं सामान्य स्वास्थ्य जानकारी, लक्षणों और स्वस्थ जीवनशैली से जुड़ी जानकारी देने में आपकी सहायता कर सकता हूं।

आप अपनी स्वास्थ्य समस्या बता सकते हैं या 🎙️ माइक्रोफोन से बोल सकते हैं।`;
}

return `👋 Hello! I am Abhimanyu Health AI.


I can help you with general health information, symptoms, wellness, and healthy lifestyle guidance.

You can type your health question or use the 🎙️ microphone.`;
};

// =====================================================
// RESET CHAT WHEN LANGUAGE CHANGES
// =====================================================

useEffect(() => {
setMessages([
{
role: "bot",
text: getInitialMessage(),
},
]);


setInput("");

transcriptRef.current = "";

// Stop AI voice
if (window.speechSynthesis) {
  window.speechSynthesis.cancel();
}

setIsSpeaking(false);


}, [lang]);

// =====================================================
// AUTO SCROLL
// =====================================================

useEffect(() => {
if (scrollRef.current) {
scrollRef.current.scrollTop =
scrollRef.current.scrollHeight;
}
}, [messages, loading]);

// =====================================================
// SPEECH RECOGNITION
// =====================================================

useEffect(() => {
const SpeechRecognition =
window.SpeechRecognition ||
window.webkitSpeechRecognition;


// Browser support check
if (!SpeechRecognition) {
  console.warn(
    "Speech Recognition not supported"
  );

  setVoiceError(
    isHindi
      ? "Voice input supported नहीं है। कृपया Google Chrome का उपयोग करें।"
      : "Voice input is not supported. Please use Google Chrome."
  );

  return;
}

const recognition =
  new SpeechRecognition();

// =================================================
// SETTINGS
// =================================================

recognition.continuous = true;

recognition.interimResults = true;

recognition.maxAlternatives = 1;

recognition.lang =
  isHindi
    ? "hi-IN"
    : "en-IN";

// =================================================
// MIC STARTED
// =================================================

recognition.onstart = () => {
  console.log(
    "🎙️ Microphone started"
  );

  isListeningRef.current = true;

  setIsListening(true);

  setVoiceError("");
};

// =================================================
// VOICE RESULT
// =================================================

recognition.onresult = (event) => {
  let finalTranscript = "";
  let interimTranscript = "";

  for (
    let i = event.resultIndex;
    i < event.results.length;
    i++
  ) {
    const result =
      event.results[i];

    const transcript =
      result[0].transcript;

    if (result.isFinal) {
      finalTranscript +=
        transcript + " ";
    } else {
      interimTranscript +=
        transcript;
    }
  }

  // Save final speech
  if (finalTranscript) {
    transcriptRef.current +=
      finalTranscript;
  }

  // Combine final + interim
  const fullText =
    (
      transcriptRef.current +
      interimTranscript
    ).trim();

  console.log(
    "🎤 Voice detected:",
    fullText
  );

  if (fullText) {
    setInput(fullText);
  }
};

// =================================================
// SPEECH ERROR
// =================================================

recognition.onerror = (event) => {
  console.error(
    "🎤 Speech error:",
    event.error
  );

  // Normal errors - don't show big error
  if (
    event.error === "no-speech"
  ) {
    return;
  }

  if (
    event.error === "aborted"
  ) {
    return;
  }

  // Microphone permission
  if (
    event.error === "not-allowed" ||
    event.error === "service-not-allowed"
  ) {
    shouldRestartRef.current =
      false;

    isListeningRef.current =
      false;

    setIsListening(false);

    setVoiceError(
      isHindi
        ? "Microphone permission Allow करें।"
        : "Please allow microphone permission."
    );

    return;
  }

  // Network issue
  if (
    event.error === "network"
  ) {
    setVoiceError(
      isHindi
        ? "Voice recognition network error."
        : "Voice recognition network error."
    );
  }
};

// =================================================
// SPEECH ENDED
// =================================================

recognition.onend = () => {
  console.log(
    "🎙️ Microphone ended"
  );

  // Restart only when user still wants microphone
  if (
    shouldRestartRef.current &&
    isListeningRef.current
  ) {
    setTimeout(() => {
      try {
        recognition.start();

        console.log(
          "🔄 Microphone restarted"
        );

      } catch (error) {
        console.log(
          "Mic restart ignored"
        );
      }
    }, 500);

  } else {
    setIsListening(false);
  }
};

// Save recognition
recognitionRef.current =
  recognition;

// =================================================
// CLEANUP
// =================================================

return () => {
  shouldRestartRef.current =
    false;

  isListeningRef.current =
    false;

  try {
    recognition.abort();
  } catch (error) {
    console.log(
      "Speech cleanup completed"
    );
  }
};


}, [isHindi]);

// =====================================================
// START / STOP MICROPHONE
// =====================================================

const toggleListening = () => {


// Browser support
if (!recognitionRef.current) {
  setVoiceError(
    isHindi
      ? "Voice recognition उपलब्ध नहीं है। Google Chrome use करें।"
      : "Voice recognition is not available. Please use Google Chrome."
  );

  return;
}

// =================================================
// STOP MIC
// =================================================

if (isListeningRef.current) {

  console.log(
    "🛑 User stopped microphone"
  );

  shouldRestartRef.current =
    false;

  isListeningRef.current =
    false;

  setIsListening(false);

  try {
    recognitionRef.current.stop();
  } catch (error) {
    console.log(
      "Mic stop ignored"
    );
  }

  return;
}

// =================================================
// START MIC
// =================================================

console.log(
  "🎙️ User started microphone"
);

// Stop AI voice before listening
if (window.speechSynthesis) {
  window.speechSynthesis.cancel();
}

setIsSpeaking(false);

setVoiceError("");

// Keep existing typed input
transcriptRef.current =
  input
    ? input.trim() + " "
    : "";

shouldRestartRef.current =
  true;

isListeningRef.current =
  true;

try {

  recognitionRef.current.start();

} catch (error) {

  console.log(
    "Mic start error:",
    error
  );

}


};

// =====================================================
// STOP MICROPHONE
// =====================================================

const stopListening = () => {


shouldRestartRef.current =
  false;

isListeningRef.current =
  false;

setIsListening(false);

try {

  recognitionRef.current?.stop();

} catch (error) {

  console.log(
    "Stop microphone error"
  );

}


};

// =====================================================
// TEXT TO SPEECH
// =====================================================

const speakText = (text) => {


if (!window.speechSynthesis) {

  console.warn(
    "Text to speech not supported"
  );

  return;
}

// Stop previous speech
window.speechSynthesis.cancel();

// Remove markdown and emojis
const cleanText =
  text
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/#/g, "")
    .replace(/`/g, "")
    .replace(/_/g, "")
    .replace(/•/g, "")
    .trim();

if (!cleanText) {
  return;
}

const utterance =
  new SpeechSynthesisUtterance(
    cleanText
  );

utterance.lang =
  isHindi
    ? "hi-IN"
    : "en-IN";

utterance.rate = 0.9;

utterance.pitch = 1;

// Get available voices
const voices =
  window.speechSynthesis.getVoices();

// Select matching voice
const matchingVoice =
  voices.find((voice) => {

    const voiceLanguage =
      voice.lang.toLowerCase();

    if (isHindi) {
      return voiceLanguage.startsWith("hi");
    }

    return voiceLanguage.startsWith("en");
  });

if (matchingVoice) {
  utterance.voice =
    matchingVoice;
}

// Speech started
utterance.onstart = () => {
  setIsSpeaking(true);
};

// Speech ended
utterance.onend = () => {
  setIsSpeaking(false);
};

// Speech error
utterance.onerror = () => {
  setIsSpeaking(false);
};

// Speak
window.speechSynthesis.speak(
  utterance
);


};

// =====================================================
// STOP AI VOICE
// =====================================================

const stopSpeaking = () => {


if (window.speechSynthesis) {

  window.speechSynthesis.cancel();

}

setIsSpeaking(false);


};

// =====================================================
// CHATBOT API
// =====================================================

const handleSend = async (customText) => {
  const userMsg = (customText || input).trim();

  console.log("SEND BUTTON CLICKED");
  console.log("MESSAGE:", userMsg);

  if (!userMsg || loading) return;

  setMessages((prev) => [
    ...prev,
    {
      role: 'user',
      text: userMsg,
    },
  ]);

  setInput('');
  setLoading(true);

  try {
    console.log("CALLING BACKEND...");

    const response = await api.post('/chatbot/chat', {
      message: userMsg,
    });

    console.log("BACKEND RESPONSE:", response.data);

    const reply =
      response.data?.reply ||
      response.data?.message ||
      "No response received.";

    setMessages((prev) => [
      ...prev,
      {
        role: 'bot',
        text: reply,
      },
    ]);

  } catch (error) {

    console.error("CHATBOT ERROR:", error);

    console.error(
      "SERVER ERROR:",
      error.response?.data
    );

    setMessages((prev) => [
      ...prev,
      {
        role: 'bot',
        text:
          error.response?.data?.message ||
          "Backend connection failed.",
      },
    ]);

  } finally {
    setLoading(false);
  }
};

// =====================================================
// QUICK PROMPTS
// =====================================================

const quickPrompts =
isHindi
? [
"🩺 मेरे लक्षण जांचें",
"💊 दवा की जानकारी",
"🥗 स्वस्थ आहार की सलाह",
]
: [
"🩺 Check my symptoms",
"💊 Medicine information",
"🥗 Healthy diet advice",
];

// =====================================================
// ENTER KEY
// =====================================================

const handleKeyDown = (
event
) => {


if (
  event.key === "Enter"
) {

  event.preventDefault();

  handleSend();

}

};

// =====================================================
// UI
// =====================================================

return (


<div
  className={`

    bg-white
    dark:bg-[#1e293b]

    rounded-[2.5rem]

    shadow-2xl

    flex
    flex-col

    overflow-hidden

    border
    border-slate-200
    dark:border-slate-800

    relative

    ${
      isPopup
        ? "h-[550px] w-full sm:w-[380px]"
        : "h-full min-h-[600px] md:h-[750px] w-full"
    }

  `}
>

  {/* ================================================= */}
  {/* HEADER */}
  {/* ================================================= */}

  <div
    className="

      bg-[#1e2a3a]

      dark:bg-slate-950

      p-4

      text-white

      shrink-0

      flex
      items-center
      justify-between

    "
  >

    <div
      className="
        flex
        items-center
        gap-3
      "
    >

      {/* BOT ICON */}

      <div
        className="
          w-11
          h-11

          bg-[#2f80ed]

          rounded-xl

          flex
          items-center
          justify-center

          text-xl

          shadow-lg
        "
      >
        🤖
      </div>

      <div>

        <h3
          className="
            text-base
            font-black
          "
        >

          {
            isHindi
              ? "अभिमन्यु हेल्थ एआई"
              : "Abhimanyu Health AI"
          }

        </h3>

        <p
          className="
            text-[10px]
            font-bold
            text-slate-300
            mt-1
          "
        >

          {
            isListening
              ? "🎙️ Listening..."
              : isSpeaking
                ? "🔊 Speaking..."
                : "🟢 Online"
          }

        </p>

      </div>

    </div>


    <div
      className="
        flex
        items-center
        gap-2
      "
    >

      {/* STOP VOICE */}

      {
        isSpeaking && (

          <button
            type="button"

            onClick={
              stopSpeaking
            }

            className="

              px-3
              py-2

              rounded-xl

              bg-red-500

              hover:bg-red-600

              text-xs
              font-bold

              transition-all

            "

            title="Stop AI voice"
          >
            🔇
          </button>

        )
      }


      {/* CLOSE POPUP */}

      {
        isPopup &&
        onClose && (

          <button
            type="button"

            onClick={
              onClose
            }

            className="

              w-9
              h-9

              rounded-full

              bg-white/10

              hover:bg-white/20

              transition-all

            "
          >
            ✕

          </button>

        )
      }

    </div>

  </div>


  {/* ================================================= */}
  {/* CHAT AREA */}
  {/* ================================================= */}

  <div

    ref={scrollRef}

    className="

      flex-1

      p-4

      overflow-y-auto

      space-y-4

      bg-[#f8fafc]

      dark:bg-slate-900/50

    "

  >

    {
      messages.map(
        (
          message,
          index
        ) => (

          <div

            key={index}

            className={`

              flex

              ${
                message.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }

            `}

          >

            <div

              className={`

                max-w-[85%]

                ${
                  message.role === "user"
                    ? "text-right"
                    : "text-left"
                }

              `}

            >

              {/* MESSAGE */}

              <div

                className={`

                  inline-block

                  p-3.5

                  rounded-[1.25rem]

                  text-sm

                  leading-relaxed

                  whitespace-pre-wrap

                  shadow-sm

                  ${
                    message.role === "user"

                      ? `

                        bg-[#2f80ed]

                        text-white

                      `

                      : `

                        bg-white

                        dark:bg-slate-800

                        text-slate-800

                        dark:text-white

                        border

                        border-slate-100

                        dark:border-slate-700

                      `
                  }

                `}

              >

                {message.text}

              </div>


              {/* LISTEN AI RESPONSE */}

              {
                message.role === "bot" && (

                  <button

                    type="button"

                    onClick={() =>
                      speakText(
                        message.text
                      )
                    }

                    className="

                      block

                      mt-1

                      px-2
                      py-1

                      text-xs

                      font-bold

                      text-[#2f80ed]

                      hover:underline

                    "

                  >

                    🔊 {
                      isHindi
                        ? "सुनें"
                        : "Listen"
                    }

                  </button>

                )
              }

            </div>

          </div>

        )
      )
    }


    {/* LOADING */}

    {
      loading && (

        <div

          className="

            inline-flex

            items-center

            gap-2

            bg-white

            dark:bg-slate-800

            px-4
            py-3

            rounded-2xl

            shadow-sm

            text-xs

            font-bold

            text-slate-500

          "

        >

          <span
            className="
              animate-pulse
            "
          >
            🤖
          </span>

          {
            isHindi
              ? "अभिमन्यु सोच रहा है..."
              : "Abhimanyu is thinking..."
          }

        </div>

      )
    }

  </div>


  {/* ================================================= */}
  {/* QUICK PROMPTS */}
  {/* ================================================= */}

  {
    messages.length <= 2 && (

      <div

        className="

          px-4
          py-2

          flex

          gap-2

          overflow-x-auto

          bg-slate-50

          dark:bg-slate-900

          border-t

          border-slate-200

          dark:border-slate-800

        "

      >

        {
          quickPrompts.map(
            (
              prompt,
              index
            ) => (

              <button

                key={index}

                type="button"

                disabled={
                  loading
                }

                onClick={() =>
                  handleSend(
                    prompt
                  )
                }

                className="

                  px-3
                  py-2

                  whitespace-nowrap

                  rounded-full

                  bg-white

                  dark:bg-slate-800

                  border

                  border-slate-200

                  dark:border-slate-700

                  text-xs

                  font-bold

                  text-slate-600

                  dark:text-slate-300

                  hover:bg-[#2f80ed]

                  hover:text-white

                  transition-all

                  disabled:opacity-50

                "

              >

                {prompt}

              </button>

            )
          )
        }

      </div>

    )
  }


  {/* ================================================= */}
  {/* VOICE ERROR */}
  {/* ================================================= */}

  {
    voiceError && (

      <div

        className="

          px-4
          py-2

          bg-red-50

          dark:bg-red-950/30

          text-red-500

          text-xs

          font-bold

          text-center

        "

      >

        ⚠️ {voiceError}

      </div>

    )
  }


  {/* ================================================= */}
  {/* INPUT AREA */}
  {/* ================================================= */}

  <div

    className="

      p-3

      bg-white

      dark:bg-slate-900

      border-t

      border-slate-200

      dark:border-slate-800

    "

  >

    <div

      className="

        flex

        items-center

        gap-2

        bg-slate-100

        dark:bg-slate-800

        rounded-full

        p-1.5

        border

        border-slate-200

        dark:border-slate-700

      "

    >

      {/* ============================================= */}
      {/* TEXT INPUT */}
      {/* ============================================= */}

      <input

        type="text"

        value={input}

        onChange={
          (event) =>
            setInput(
              event.target.value
            )
        }

        onKeyDown={
          handleKeyDown
        }

        disabled={
          loading
        }

        placeholder={

          isListening

            ? (

              isHindi

                ? "🎙️ बोलिए... मैं सुन रहा हूं"

                : "🎙️ Speak now... I am listening"

            )

            : (

              isHindi

                ? "अपना स्वास्थ्य प्रश्न लिखें..."

                : "Ask your health question..."

            )

        }

        className="

          flex-1

          min-w-0

          bg-transparent

          outline-none

          border-none

          px-3
          py-2

          text-sm

          text-slate-800

          dark:text-white

          placeholder:text-slate-400

        "

      />


      {/* ============================================= */}
      {/* MICROPHONE */}
      {/* ============================================= */}

      <button

        type="button"

        onClick={
          toggleListening
        }

        disabled={
          loading
        }

        className={`

          w-11
          h-11

          shrink-0

          rounded-full

          flex

          items-center

          justify-center

          transition-all

          disabled:opacity-50

          ${
            isListening

              ? `

                bg-red-500

                text-white

                animate-pulse

                shadow-lg

              `

              : `

                text-slate-500

                hover:bg-blue-100

                hover:text-[#2f80ed]

              `
          }

        `}

        title={

          isListening

            ? "Stop microphone"

            : "Start voice input"

        }

      >

        {
          isListening

            ? "⏹️"

            : "🎙️"
        }

      </button>


      {/* ============================================= */}
      {/* SEND BUTTON */}
      {/* ============================================= */}

      <button

        type="button"

        onClick={() =>
          handleSend()
        }

        disabled={
          loading ||
          !input.trim()
        }

        className="

          w-11
          h-11

          shrink-0

          rounded-full

          bg-[#2f80ed]

          hover:bg-blue-600

          text-white

          flex

          items-center

          justify-center

          shadow-md

          transition-all

          active:scale-95

          disabled:opacity-50

          disabled:cursor-not-allowed

        "

      >

        {
          loading

            ? "..."

            : "➤"
        }

      </button>

    </div>


    {/* LISTENING STATUS */}

    {
      isListening && (

        <div

          className="

            mt-2

            text-center

            text-xs

            font-bold

            text-red-500

            animate-pulse

          "

        >

          🎙️ {

            isHindi

              ? "बोलिए... मैं सुन रहा हूं"

              : "Speak now... I am listening"

          }

        </div>

      )
    }

  </div>

</div>


);
};

export default HealthBot;
